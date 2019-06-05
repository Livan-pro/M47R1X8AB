#!/bin/bash

echo -n "Enter email: "
read email

domains=(m47r1x8ab.tk www.m47r1x8ab.tk)
rsa_key_size=4096
letsencrypt_path="/etc/letsencrypt"
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

# Source: github.com/wmnnd/nginx-certbot

if [ ! -e "$letsencrypt_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$letsencrypt_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$letsencrypt_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/options-ssl-nginx.conf > "$letsencrypt_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/ssl-dhparams.pem > "$letsencrypt_path/conf/ssl-dhparams.pem"
  echo
fi

for domain in "${domains[@]}"; do
  echo "### Removing old certificate for $domain ..."
  rm -Rf /etc/letsencrypt/live/$domain
  rm -Rf /etc/letsencrypt/archive/$domain
  rm -Rf /etc/letsencrypt/renewal/$domain.conf
  echo
done

for domain in "${domains[@]}"; do
  echo "### Creating dummy certificate for $domain ..."
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$data_path/conf/live/$domain"
  openssl req -x509 -nodes -newkey rsa:1024 -days 1 -keyout "$path/privkey.pem" -out "$path/fullchain.pem" -subj '/CN=localhost'
  echo
done

echo "### Starting nginx ..."
nginx -s reload
echo

for domain in "${domains[@]}"; do
  echo "### Removing dummy certificate for $domain ..."
  rm -Rf /etc/letsencrypt/live/$domain
  echo
done

echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

certbot certonly --webroot -w /var/www/certbot $staging_arg $email_arg $domain_args --rsa-key-size $rsa_key_size --agree-tos --force-renewal
echo

echo "### Reloading nginx ..."
nginx -s reload