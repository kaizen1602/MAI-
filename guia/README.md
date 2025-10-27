# 📚 Guía de Documentación - MAI

Esta carpeta contiene toda la documentación técnica del proyecto MAI (Mercado Agro Inteligente).

## 📖 Documentos Disponibles

### 🚀 [Instalación Completa](./INSTALACION_COMPLETA.md)
Guía paso a paso desde clonar el repositorio hasta tener la aplicación funcionando completamente.

**Incluye:**
- Prerrequisitos del sistema
- Configuración de Docker
- Setup de base de datos
- Instalación del frontend
- Credenciales de prueba
- Comandos útiles
- Solución de problemas

### 🏗️ [Backend](./BACKEND.md)
Documentación completa del backend desarrollado en Laravel 10.

**Incluye:**
- Arquitectura y estructura
- Modelos de base de datos
- Endpoints de API
- Sistema de autenticación
- Seeders y datos iniciales
- Comandos de desarrollo
- Configuración y debugging

### 🎨 [Frontend](./FRONTEND.md)
Documentación completa del frontend desarrollado en React 18 + TypeScript.

**Incluye:**
- Arquitectura de componentes
- Páginas principales
- Gestión de estado
- Integración con API
- Estilos y UI
- Optimizaciones
- Comandos de desarrollo

### 🔗 [Capa de Datos](./DATA_LAYER.md)
Documentación de la capa que conecta frontend y backend.

**Incluye:**
- Configuración de API
- Servicios de datos
- Gestión de estado global
- Tipos TypeScript
- Flujo de datos
- Manejo de autenticación
- Optimizaciones

### 🚨 [Troubleshooting](./TROUBLESHOOTING.md)
Guía completa para solucionar errores comunes al clonar el repositorio.

**Incluye:**
- Errores 404 y 500 en consola
- Problemas de autenticación
- Errores de base de datos
- Comandos de diagnóstico
- Solución paso a paso
- Debugging avanzado

## 🎯 Cómo Usar Esta Documentación

1. **Para empezar**: Lee [Instalación Completa](./INSTALACION_COMPLETA.md)
2. **Para entender el backend**: Consulta [Backend](./BACKEND.md)
3. **Para entender el frontend**: Consulta [Frontend](./FRONTEND.md)
4. **Para entender la integración**: Consulta [Capa de Datos](./DATA_LAYER.md)

## 🔧 Comandos Rápidos

```bash
# Instalación completa
docker-compose up -d
docker exec php_fpm php artisan migrate
docker exec php_fpm php artisan db:seed
cd frontend && npm install && npm run dev

# Acceso
Frontend: http://localhost:5173
Backend: http://localhost/api
PhpMyAdmin: http://localhost:8080
```

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación correspondiente
2. Consulta la sección de solución de problemas
3. Crea un issue en GitHub

---

**MAI** - Documentación técnica completa 🚀
