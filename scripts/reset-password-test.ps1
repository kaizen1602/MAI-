<#
PowerShell script to automate "Forgot password" flow for local development.

Usage:
  .\scripts\reset-password-test.ps1 -Email "user@example.com" -NewPassword "NewPass123"

Options:
  -BackendUrl (default http://localhost:8000)
  -PollAttempts / -PollIntervalSeconds: how long to wait for token in logs if backend doesn't return it

This script will:
  1) Call POST /api/auth/forgot-password
  2) If response includes `reset_token`, use it. Otherwise look for the token in:
     - local log file at `backend/storage/logs/laravel.log`
     - docker compose logs for service `backend`
  3) Call POST /api/auth/reset-password with the token and new password

NOTE: This does not modify backend code and is intended for local/dev testing only.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Email,

    [Parameter(Mandatory=$true)]
    [string]$NewPassword,

    [string]$BackendUrl = 'http://localhost:8000',

    [int]$LogTailLines = 200,
    [int]$PollAttempts = 6,
    [int]$PollIntervalSeconds = 2
)

function Invoke-ForgotPassword {
    param($email)
    try {
        $body = @{ email = $email } | ConvertTo-Json
        $resp = Invoke-RestMethod -Method Post -Uri "$($BackendUrl.TrimEnd('/'))/api/auth/forgot-password" -ContentType 'application/json' -Body $body -ErrorAction Stop
        return $resp
    } catch {
        Write-Host "Error calling forgot-password: $_" -ForegroundColor Red
        return $null
    }
}

function Invoke-ResetPassword {
    param($email, $token, $newPassword)
    try {
        $body = @{
            email = $email
            token = $token
            password = $newPassword
            password_confirmation = $newPassword
        } | ConvertTo-Json

        $resp = Invoke-RestMethod -Method Post -Uri "$($BackendUrl.TrimEnd('/'))/api/auth/reset-password" -ContentType 'application/json' -Body $body -ErrorAction Stop
        return $resp
    } catch {
        Write-Host "Error calling reset-password: $_" -ForegroundColor Red
        return $null
    }
}

function Get-Token-From-LocalLog {
    param($email)

    $repoRoot = Split-Path -Parent $PSScriptRoot
    $logPath = Join-Path $repoRoot 'backend\storage\logs\laravel.log'
    if (-Not (Test-Path $logPath)) { return $null }

    try {
        $lines = Get-Content -Path $logPath -Tail $LogTailLines -ErrorAction Stop
    } catch {
        return $null
    }

    $escaped = [regex]::Escape($email)
    $pattern = "Token de restablecimiento para\s+${escaped}\s*:\s*([0-9a-fA-F]+)"

    foreach ($l in $lines) {
        if ($l -match $pattern) { return $matches[1] }
    }
    return $null
}

function Get-Token-From-DockerLogs {
    param($email)

    # Attempt to get recent docker compose logs for service 'backend'
    try {
        $output = & docker compose logs --no-color --no-log-prefix --tail $LogTailLines backend 2>$null
        if (-not $output) { return $null }
        $lines = $output -split "`n"
    } catch {
        return $null
    }

    $escaped = [regex]::Escape($email)
    $pattern = "Token de restablecimiento para\s+${escaped}\s*:\s*([0-9a-fA-F]+)"
    foreach ($l in $lines) {
        if ($l -match $pattern) { return $matches[1] }
    }
    return $null
}

Write-Host "Solicitando token de restablecimiento para: $Email" -ForegroundColor Cyan
$resp = Invoke-ForgotPassword -email $Email

$token = $null
if ($resp -ne $null -and $resp.reset_token) {
    $token = $resp.reset_token
    Write-Host "Token recibido en la respuesta: $token" -ForegroundColor Green
} else {
    Write-Host "Token no devuelto por el endpoint. Buscando en logs..." -ForegroundColor Yellow

    for ($i=0; $i -lt $PollAttempts; $i++) {
        Write-Host "Intento $($i+1) de $PollAttempts: buscando token en logs locales..." -NoNewline
        $token = Get-Token-From-LocalLog -email $Email
        if ($token) { Write-Host " encontrado." -ForegroundColor Green; break }
        Write-Host " no encontrado." -ForegroundColor Yellow

        Write-Host "Buscando token en logs de Docker..." -NoNewline
        $token = Get-Token-From-DockerLogs -email $Email
        if ($token) { Write-Host " encontrado en Docker logs." -ForegroundColor Green; break }
        Write-Host " no encontrado en Docker." -ForegroundColor Yellow

        Start-Sleep -Seconds $PollIntervalSeconds
    }
}

if (-not $token) {
    Write-Host "No se pudo obtener token de restablecimiento. Revisa los logs en backend/storage/logs/laravel.log o configura el envío de emails." -ForegroundColor Red
    exit 1
}

Write-Host "Usando token: $token" -ForegroundColor Cyan

$resetResp = Invoke-ResetPassword -email $Email -token $token -newPassword $NewPassword
if ($resetResp -ne $null) {
    Write-Host "Respuesta de reset-password:" -ForegroundColor Green
    $resetResp | ConvertTo-Json | Write-Host
    Write-Host "Prueba finalizada. Intenta iniciar sesión con la nueva contraseña." -ForegroundColor Green
    exit 0
} else {
    Write-Host "Fallo al restablecer la contraseña." -ForegroundColor Red
    exit 1
}