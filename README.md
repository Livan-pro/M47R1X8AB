# M47R1XAB
## Development setup
```bash
npm i -g lerna # install lerna
lerna link # link projects to each other
lerna bootstrap # install dependencies

cd packages/backend
copy .env-example .env # copy config, you need to edit this
npm run dev # start development server

cd packages/website
npm run dev # start development website server
```

## Production setup (Ubuntu 18)
### Prepare
```bash
sudo apt update

# Install mysql
sudo apt install -y mysql-server
sudo mysql_secure_installation
mysql -uroot -p
# Enter password...
CREATE DATABASE matrix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'matrix'@'localhost' IDENTIFIED BY 'my-strong-password-here';
GRANT ALL ON matrix.* TO 'matrix'@'localhost';
# Optional: create other users
exit

# Optional: allow external connections
nano /etc/mysql/mysql.conf.d/mysqld.cnf # set bind-address = 0.0.0.0
service mysql restart

# Install Node.js
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs gcc g++ make

# Generate SSH key
ssh-keygen
cat ~/.ssh/id_rsa.pub # paste this to github deploy key

# Enable swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
echo "vm.swappiness=10" >> /etc/sysctl.conf
sudo sysctl vm.vfs_cache_pressure=50
echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf

# Install nginx
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'

# Install certbot
sudo add-apt-repository ppa:certbot/certbot
sudo apt install -y python-certbot-nginx

# Install pm2
npm install pm2 -g
pm2 startup

# Git config
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Allow access to /root for nginx
chmod +x /root
```
### Deploy
```bash
git clone git@github.com:xLivan/M47R1X8AB.git
cd M47R1X8AB

# Allow /deploy execution
chmod +x ./deploy

# Nginx config
cp nginx-conf/.env-example nginx-conf/.env
nano nginx-conf/.env # set BASE_DOMAIN
chmod +x ./nginx-conf/generate-config.sh
./nginx-conf/generate-config.sh
mv nginx-conf/app.conf /etc/nginx/conf.d/

# Request certificate
chmod +x ./nginx-conf/init-letsencrypt.sh
./nginx-conf/init-letsencrypt.sh

npm ci
npm run bootstrap-ci
npm run build

cp packages/database/.env-example packages/database/.env
nano packages/database/.env # set DB_PASSWORD

cp packages/backend/.env-example packages/backend/.env
nano packages/backend/.env # set DB_PASSWORD & JWT_SECRET

npm run deploy # migrate DB, restart backend, rebuild website
pm2 save # save pm2 process list for autostart on reboot
```
### Deploy on update
* Automatic: `./deploy`
* Manual
  ```bash
  git pull
  npm ci # only if needed
  npm run bootstrap-ci # only if needed
  npm run build # or: npx lerna run --scope <website/backend/matrix-database/shared> build
  npm run deploy # or: npx lerna run --scope <website/backend/matrix-database/shared> deploy
  ```