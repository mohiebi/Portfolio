#!/usr/bin/env bash
set -e

APP_ROOT="/home/site/wwwroot"
PUBLIC_ROOT="${APP_ROOT}/public"

if [ -d "${PUBLIC_ROOT}" ]; then
  if [ -f /etc/nginx/sites-available/default ]; then
    sed -i "s#${APP_ROOT}#${PUBLIC_ROOT}#g" /etc/nginx/sites-available/default
    service nginx reload || true
  fi

  if [ -f /etc/apache2/sites-available/000-default.conf ]; then
    sed -i "s#DocumentRoot .*#DocumentRoot ${PUBLIC_ROOT}#g" /etc/apache2/sites-available/000-default.conf
    service apache2 reload || true
  fi
fi
