FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip curl libpq-dev libzip-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring xml zip tokenizer

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application
COPY . .

# Generate app key if not set
RUN php artisan config:clear

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=$PORT
