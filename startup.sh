#!/usr/bin/env bash
set -e

APP_ROOT="/home/site/wwwroot"
PUBLIC_ROOT="${APP_ROOT}/public"
NGINX_CONFIG="${APP_ROOT}/default"

if [ -f "${APP_ROOT}/artisan" ]; then
  cd "${APP_ROOT}"
  php artisan migrate:fresh --seed --force --no-interaction
fi

if [ -d "${PUBLIC_ROOT}" ]; then
  if [ -f "${NGINX_CONFIG}" ] && [ -f /etc/nginx/sites-available/default ]; then
    cp "${NGINX_CONFIG}" /etc/nginx/sites-available/default
    service nginx reload || true
  fi
fi
