#!/usr/bin/env bash
set -u

APP_ROOT="/home/site/wwwroot"
PUBLIC_ROOT="${APP_ROOT}/public"
NGINX_CONFIG="${APP_ROOT}/default"
NGINX_CONF_D="/etc/nginx/conf.d/default.conf"
STARTUP_LOG="/home/LogFiles/startup-refresh.log"

mkdir -p /home/LogFiles

if [ -f "${APP_ROOT}/artisan" ]; then
  cd "${APP_ROOT}"
  rm -f public/hot
  {
    echo "[$(date -u)] Clearing Laravel caches"
    php artisan optimize:clear --no-interaction
    echo "[$(date -u)] Running one-time migrate:fresh --seed"
    php artisan migrate:fresh --seed --force --no-interaction
    echo "[$(date -u)] Database refresh completed"
  } >> "${STARTUP_LOG}" 2>&1 || {
    echo "[$(date -u)] Database refresh failed; continuing web startup" >> "${STARTUP_LOG}" 2>&1
  }
fi

if [ -d "${PUBLIC_ROOT}" ]; then
  if [ -f "${NGINX_CONFIG}" ] && [ -f "${NGINX_CONF_D}" ]; then
    cp "${NGINX_CONFIG}" "${NGINX_CONF_D}"
  fi
fi

php-fpm -D >> "${STARTUP_LOG}" 2>&1 || echo "[$(date -u)] php-fpm start failed" >> "${STARTUP_LOG}" 2>&1
exec nginx -g "daemon off;"
