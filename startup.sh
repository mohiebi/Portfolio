#!/usr/bin/env bash
set -e

APP_ROOT="/home/site/wwwroot"
PUBLIC_ROOT="${APP_ROOT}/public"
NGINX_CONFIG="${APP_ROOT}/default"

if [ -f "${APP_ROOT}/artisan" ]; then
  cd "${APP_ROOT}"
  rm -f public/hot
  php artisan optimize:clear --no-interaction
  php artisan migrate --force --no-interaction
  php artisan app:seed-once --no-interaction
fi

if [ -d "${PUBLIC_ROOT}" ]; then
  if [ -f "${NGINX_CONFIG}" ] && [ -f /etc/nginx/sites-available/default ]; then
    cp "${NGINX_CONFIG}" /etc/nginx/sites-available/default
    service nginx reload || true
  fi
fi

if [ -x /opt/startup/startup.sh ]; then
  exec /opt/startup/startup.sh
fi
