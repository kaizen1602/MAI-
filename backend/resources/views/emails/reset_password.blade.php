<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #007bff;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 10px 0;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #0056b3;
        }
        .link-container {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }
        .link-container p {
            margin: 5px 0;
            word-break: break-all;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .warning p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Restablecer tu Contraseña</h1>
        </div>

        <div class="content">
            <p>Hola <strong>{{ $user->name }}</strong>,</p>

            <p>Recibimos una solicitud para restablecer tu contraseña en MAI. Si no fuiste tú quien realizó esta solicitud, ignora este email.</p>

            <p>Para restablecer tu contraseña, haz clic en el botón de abajo:</p>

            <center>
                <a href="{{ $resetLink }}" class="cta-button">Restablecer Contraseña</a>
            </center>

            <p>O copia y pega este enlace en tu navegador:</p>

            <div class="link-container">
                <p><a href="{{ $resetLink }}">{{ $resetLink }}</a></p>
            </div>

            <div class="warning">
                <p>⏰ <strong>Este enlace expira en 60 minutos.</strong></p>
                <p>Si no restauraste tu contraseña en ese tiempo, deberás solicitar un nuevo enlace.</p>
            </div>

            <p>Si tienes problemas, contáctanos respondiendo a este email.</p>

            <p>
                Saludos,<br>
                <strong>El equipo de MAI</strong>
            </p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} MAI - Plataforma de Comercio Agrícola. Todos los derechos reservados.</p>
            <p>Este es un email automático. Por favor no respondas con información sensible.</p>
        </div>
    </div>
</body>
</html>
