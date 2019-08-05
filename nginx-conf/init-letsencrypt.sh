#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -f $DIR/.env ]
then
  export $(cat $DIR/.env | xargs)
fi

domains=("$BASE_DOMAIN" "www.$BASE_DOMAIN" "admin.$BASE_DOMAIN")
echo "Domains: ${domains[@]}"

echo -n "Enter email: "
read email

echo "You can enable staging mod if you're testing your setup to avoid hitting request limits."
read -p "Enable staging? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  staging=1
else
  staging=0
fi

rsa_key_size=4096
letsencrypt_path="/etc/letsencrypt"

# Source: github.com/wmnnd/nginx-certbot, with edits

check_exit_code() {
  local code=$?
  if [ $code -ne 0 ]; then
    echo "Error detected. Exit code: $code"
    exit $code
  fi
}

if [ ! -e "$letsencrypt_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$letsencrypt_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$letsencrypt_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/options-ssl-nginx.conf > "$letsencrypt_path/conf/options-ssl-nginx.conf"
  check_exit_code
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/ssl-dhparams.pem > "$letsencrypt_path/conf/ssl-dhparams.pem"
  check_exit_code
  echo
fi

for domain in "${domains[@]}"; do
  echo "### Removing old certificate for $domain ..."
  rm -Rf $letsencrypt_path/live/$domain
  check_exit_code
  rm -Rf $letsencrypt_path/archive/$domain
  check_exit_code
  rm -Rf $letsencrypt_path/renewal/$domain.conf
  check_exit_code
  echo
done

for domain in "${domains[@]}"; do
  echo "### Creating dummy certificate for $domain ..."
  path="$letsencrypt_path/live/$domain"
  mkdir -p $path
  check_exit_code
  openssl req -x509 -nodes -newkey rsa:1024 -days 1 -keyout "$path/privkey.pem" -out "$path/fullchain.pem" -subj '/CN=localhost'
  check_exit_code
  echo
done

echo "### Starting nginx ..."
nginx -s reload
check_exit_code
echo

for domain in "${domains[@]}"; do
  echo "### Removing dummy certificate for $domain ..."
  rm -Rf /etc/letsencrypt/live/$domain
  check_exit_code
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

mkdir -p /var/www/certbot
check_exit_code
certbot certonly --webroot -w /var/www/certbot $staging_arg $email_arg $domain_args --rsa-key-size $rsa_key_size --agree-tos --force-renewal
check_exit_code
echo

echo "### Reloading nginx ..."
nginx -s reload
check_exit_code