FROM phpdockerio/php:8.3-fpm
WORKDIR "/application"

RUN apt-get update \
    && apt-get -y --no-install-recommends install \
    php8.3-mysql \
    php8.3-gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Set permissions for the application directory
RUN chown -R www-data:www-data /application && \
    find /application -type d -exec chmod 755 {} \; && \
    find /application -type f -exec chmod 644 {} \;