FROM php:8.1-fpm

ARG USER_ID
ARG GROUP_ID

RUN apt-get update && apt-get install -y \
    git zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN groupadd -g ${GROUP_ID} devgroup || true \
    && useradd -u ${USER_ID} -g ${GROUP_ID} -m devuser || true

WORKDIR /var/www/html

EXPOSE 9000
