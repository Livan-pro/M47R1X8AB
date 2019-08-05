#!/bin/bash

cp ./base.conf ./app.conf
sed -i 's/$BASE_DOMAIN/'"$BASE_DOMAIN"'/g' ./app.conf
echo "app.conf generated!"