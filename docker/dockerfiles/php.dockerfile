FROM php:8.2-fpm

# Variables de usuario
ARG USER_ID
ARG GROUP_ID

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar Composer desde la imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Crear usuario no root
RUN groupadd -g ${GROUP_ID} devgroup || true \
    && useradd -u ${USER_ID} -g ${GROUP_ID} -m devuser || true

# Directorio de trabajo
WORKDIR /var/www/html

# Exponer puerto PHP-FPM
EXPOSE 9000