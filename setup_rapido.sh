#!/bin/bash

# =====================================================
# MAI - Setup Rápido del Módulo de Precios Inteligentes
# =====================================================
#
# Este script configura TODO automáticamente:
# - Base de datos
# - Productos
# - Unidades de medida
# - Datos MOCK para pruebas
#
# Uso: bash setup_rapido.sh
# =====================================================

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   MAI - Módulo de Precios Inteligentes                ║"
echo "║   Setup Automático                                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ]; then
    print_error "Error: Debes ejecutar este script desde la raíz del proyecto MAI"
    exit 1
fi

# Solicitar credenciales MySQL
print_info "Configuración de MySQL"
read -p "Usuario MySQL (default: root): " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-root}

read -sp "Contraseña MySQL: " MYSQL_PASS
echo ""

read -p "Nombre de base de datos (default: mai): " MYSQL_DB
MYSQL_DB=${MYSQL_DB:-mai}

echo ""
print_info "Usando: Usuario=$MYSQL_USER, DB=$MYSQL_DB"
echo ""

# Verificar conexión
print_info "Verificando conexión a MySQL..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" -e "USE $MYSQL_DB" 2>/dev/null
if [ $? -ne 0 ]; then
    print_error "No se pudo conectar a MySQL. Verifica tus credenciales."
    exit 1
fi
print_success "Conexión exitosa"
echo ""

# Paso 1: Crear tablas
print_info "Paso 1/4: Creando tablas del módulo de precios..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" < database/migrations/2025_11_26_create_intelligent_module_tables.sql
if [ $? -eq 0 ]; then
    print_success "Tablas creadas correctamente"
else
    print_error "Error al crear tablas"
    exit 1
fi
echo ""

# Paso 2: Insertar unidades de medida
print_info "Paso 2/4: Insertando unidades de medida (70+ unidades)..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" < database/migrations/2025_11_26_seed_measurement_units.sql
if [ $? -eq 0 ]; then
    print_success "Unidades de medida insertadas"
else
    print_error "Error al insertar unidades"
    exit 1
fi
echo ""

# Paso 3: Insertar productos
print_info "Paso 3/4: Insertando catálogo de productos (120+ productos)..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" < database/migrations/2025_11_26_seed_products_catalog.sql
if [ $? -eq 0 ]; then
    print_success "Productos insertados"
else
    print_error "Error al insertar productos"
    exit 1
fi
echo ""

# Paso 4: Insertar datos MOCK
print_info "Paso 4/4: Generando datos MOCK de precios (450+ registros)..."
print_warning "Esto puede tardar 15-20 segundos..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" < database/migrations/2025_11_26_seed_MOCK_market_prices.sql
if [ $? -eq 0 ]; then
    print_success "Datos MOCK generados correctamente"
else
    print_error "Error al generar datos MOCK"
    exit 1
fi
echo ""

# Verificación
print_info "Verificando instalación..."
echo ""

# Contar productos
PRODUCT_COUNT=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -sN -e "SELECT COUNT(*) FROM products_catalog WHERE is_active = 1")
print_success "Productos en catálogo: $PRODUCT_COUNT"

# Contar unidades
UNIT_COUNT=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -sN -e "SELECT COUNT(*) FROM measurement_units WHERE is_active = 1")
print_success "Unidades de medida: $UNIT_COUNT"

# Contar precios MOCK
PRICE_COUNT=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -sN -e "SELECT COUNT(*) FROM market_prices WHERE source = 'MOCK_DATA'")
print_success "Precios simulados: $PRICE_COUNT"

# Contar tendencias
TREND_COUNT=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -sN -e "SELECT COUNT(*) FROM price_trends WHERE period_end = CURDATE()")
print_success "Tendencias calculadas: $TREND_COUNT"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ INSTALACIÓN COMPLETADA                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

print_success "El módulo de precios inteligentes está listo para usar!"
echo ""

print_info "Próximos pasos:"
echo ""
echo "1. Inicia el backend (si no está corriendo):"
echo "   ${BLUE}cd backend && php artisan serve${NC}"
echo ""
echo "2. Prueba la API con curl:"
echo "   ${BLUE}curl -X POST http://localhost:8000/api/recommendations/check-price \\${NC}"
echo "   ${BLUE}  -H 'Content-Type: application/json' \\${NC}"
echo "   ${BLUE}  -d '{\"product_name\":\"papa criolla\",\"price_per_kg\":6000}'${NC}"
echo ""
echo "3. O importa la colección Postman:"
echo "   ${BLUE}backend/MAI_Intelligent_Pricing.postman_collection.json${NC}"
echo ""
echo "4. Lee la guía de inicio rápido:"
echo "   ${BLUE}GUIA_RAPIDA_DATOS_MOCK.md${NC}"
echo ""

print_info "Productos disponibles para probar:"
echo "   - Papa Criolla (~$4,520/kg)"
echo "   - Aguacate Hass (~$6,450/kg)"
echo "   - Tomate Chonto (~$3,200/kg)"
echo "   - Banano (~$2,000/kg)"
echo "   - Y 11 productos más..."
echo ""

print_success "¡Disfruta el módulo de precios inteligentes! 🚀"
echo ""
