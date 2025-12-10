#!/bin/bash

echo "========================================="
echo "  Inicializando AgroMarket con Docker   "
echo "========================================="
echo ""

# Verificar si existe el archivo .env en el root
if [ ! -f .env ]; then
    echo "   No existe el archivo .env, creando uno por defecto..."
    cat > .env <<EOF
# Variables de entorno globales para Docker Compose

# Credenciales MySQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=agro_db
MYSQL_USER=agro_user
MYSQL_PASSWORD=agro_password

# Credenciales PhpMyAdmin
PMA_USER=root
PMA_PASSWORD=rootpassword
EOF
    echo " Archivo .env creado. Puedes modificarlo antes de continuar."
else
    echo " Archivo .env ya existe"
fi

# Verificar si existe el archivo .env en el backend
if [ ! -f backend/.env ]; then
    echo "   No existe el archivo backend/.env, copiando desde .env.docker..."
    if [ -f backend/.env.docker ]; then
        cp backend/.env.docker backend/.env
        echo " Archivo backend/.env creado desde .env.docker"
    elif [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
        echo " Archivo backend/.env creado desde .env.example"
    else
        echo "L No se encontró ni .env.docker ni .env.example en backend/"
        exit 1
    fi
else
    echo " Archivo backend/.env ya existe"
fi

echo ""
echo "=' Deteniendo contenedores existentes..."
docker-compose down

echo ""
echo "<×  Construyendo imágenes Docker..."
docker-compose build --no-cache

echo ""
echo "=€ Iniciando contenedores..."
docker-compose up -d

echo ""
echo "ó Esperando a que los servicios estén listos..."
sleep 10

echo ""
echo "=æ Instalando dependencias de Composer..."
docker-compose exec php composer install --no-dev --optimize-autoloader

echo ""
echo "= Generando APP_KEY de Laravel..."
docker-compose exec php php artisan key:generate --force

echo ""
echo "=Ä  Ejecutando migraciones..."
docker-compose exec php php artisan migrate --force

echo ""
echo "<1 Ejecutando seeders..."
docker-compose exec php php artisan db:seed --force

echo ""
echo "= Creando enlace simbólico de storage..."
docker-compose exec php php artisan storage:link

echo ""
echo " Optimizando Laravel..."
docker-compose exec php php artisan config:cache
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache

echo ""
echo "========================================="
echo "   Inicialización completada!          "
echo "========================================="
echo ""
echo "< Servicios disponibles:"
echo "   - Frontend:    http://localhost:3000"
echo "   - Backend API: http://localhost/api"
echo "   - PhpMyAdmin:  http://localhost:8080"
echo "   - Mailhog:     http://localhost:8025"
echo "   - n8n:         http://localhost:5678"
echo ""
echo "=Ë Comandos útiles:"
echo "   - Ver logs:        docker-compose logs -f"
echo "   - Parar:           docker-compose down"
echo "   - Reiniciar:       docker-compose restart"
echo "   - Shell PHP:       docker-compose exec php bash"
echo "   - Artisan:         docker-compose exec php php artisan"
echo ""
