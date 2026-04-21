FROM php:8.4-fpm-bullseye

RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_pgsql mbstring zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY . .

RUN php artisan config:clear 2>/dev/null || true

EXPOSE 8000

CMD php -S 0.0.0.0:${PORT:-8000} -t public
