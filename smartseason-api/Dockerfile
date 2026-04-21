FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    unzip curl libpq-dev libzip-dev libxml2-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring xml zip tokenizer \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY . .

RUN php artisan config:clear 2>/dev/null || true

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=$PORT
