# Base Image
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Ensure composer.lock is present
RUN test -f composer.lock || composer update

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --ignore-platform-req=ext-zip

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port 8000 for PHP-FPM
EXPOSE 8000

# Start PHP-FPM
CMD ["php-fpm"]
