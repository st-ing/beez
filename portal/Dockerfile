# building backend
FROM composer AS vendor

COPY database/ database/
COPY composer.json composer.lock ./

RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist


# builing frontend
FROM node:14 AS frontend

WORKDIR /app
RUN mkdir -p /app/public

COPY package*.json yarn.lock artisan webpack.mix.js /app/

RUN npm install --prefer-offline --no-audit
#RUN npm ci --prefer-offline --no-audit

COPY artisan webpack.mix.js /app/
COPY public/ /app/public/
COPY resources/ /app/resources/

RUN npm run production
RUN npm prune --production


# runtime
FROM php:8.1.13-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    zip \
    curl \
    sudo \
    unzip \
    libzip-dev \
    libicu-dev \
    libbz2-dev \
    libpng-dev \
    libjpeg-dev \
    libmcrypt-dev \
    libreadline-dev \
    libfreetype6-dev \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install \
    bz2 \
    intl \
    iconv \
    bcmath \
    opcache \
    calendar \
    pdo_mysql \
    zip

COPY --chown=1000:1000 . /var/www/html

WORKDIR /var/www/html

COPY --chown=1000:1000 --from=frontend /app/node_modules/ /var/www/html/node_modules/
COPY --chown=1000:1000 --from=frontend /app/public/ /var/www/html/public/
COPY --chown=1000:1000 --from=vendor /app/vendor/ /var/www/html/vendor/

COPY --chown=1000:1000 docker-beez-entrypoint /usr/bin/
RUN chmod +x /usr/bin/docker-beez-entrypoint

RUN sed -i -e "s/html/html\/public/g" /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod rewrite

ARG BUILD_NUMBER
ENV APP_VERSION=1.0.$BUILD_NUMBER

RUN usermod -u 1000 www-data && groupmod -g 1000 www-data
USER 1000

ENTRYPOINT ["/usr/bin/docker-beez-entrypoint"]
