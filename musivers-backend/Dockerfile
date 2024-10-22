# Usa la imagen oficial de PHP con Apache
FROM php:8.1-apache

# Establecer el directorio de trabajo en /var/www/html
WORKDIR /var/www/html

# Instala las extensiones necesarias para Symfony
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libpq-dev \
    git \
    unzip \
    && docker-php-ext-install intl pdo pdo_pgsql

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar los archivos del proyecto al contenedor
COPY . /var/www/html

# Establecer permisos de escritura en las carpetas cache y logs
RUN chown -R www-data:www-data /var/www/html/var \
    && a2enmod rewrite

# Instalar dependencias de Symfony
RUN composer install --no-scripts --no-interaction

# Configurar Apache
COPY docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# Exponer el puerto 80
EXPOSE 80
