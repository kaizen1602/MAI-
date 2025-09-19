FROM nginx:stable-alpine

# Remueve configuración default
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada
COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf



WORKDIR /var/www/html
