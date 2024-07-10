#!/bin/bash

# Log file
LOGFILE=~/data/certbot/ssl-creation.log

log() {
  echo "$(date +"%Y-%m-%d %T") - $1" | tee -a $LOGFILE
}

# Ensure the log directory exists
mkdir -p $(dirname $LOGFILE)

log "Starting SSL certificate creation process"

# Remove any existing certbot data
log "Removing existing certbot data"
sudo rm -rf ~/data/certbot

log "Creating necessary directories for certbot"
mkdir -p ~/data/certbot/conf ~/data/certbot/www

# Run a temporary Nginx container to handle the HTTP challenge
log "Running temporary Nginx container"
docker run -d --name certbot-webserver \
  -v ~/data/certbot/www:/usr/share/nginx/html:ro \
  -p 80:80 \
  --network host \
  nginx

# Wait for Nginx to start
sleep 5

log "Running certbot to obtain the SSL certificate"
docker run --rm \
  -v ~/data/certbot/conf:/etc/letsencrypt \
  -v ~/data/certbot/www:/var/www/certbot \
  --network host \
  certbot/certbot \
  certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email tausifo3.14@gmail.com \
  --agree-tos \
  --no-eff-email \
  -d pelyform.com \
  --force-renewal \
  --debug-challenges | tee -a $LOGFILE

# Stop and remove the temporary Nginx container
log "Stopping and removing temporary Nginx container"
docker stop certbot-webserver
docker rm certbot-webserver

# Set the correct permissions for the certbot directories and files
log "Setting correct permissions for certbot directories and files"
sudo chmod -R 755 ~/data/certbot

# Check if the certificate was successfully obtained
if [ -f ~/data/certbot/conf/live/pelyform.com/fullchain.pem ]; then
    log "SSL certificate successfully obtained"
else
    log "Failed to obtain SSL certificate. Check the logs for more information."
fi

# End logging
log "SSL certificate creation process completed"