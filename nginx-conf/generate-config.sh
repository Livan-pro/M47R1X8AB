#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -f $DIR/.env ]
then
  export $(cat $DIR/.env | xargs)
fi

cp $DIR/base.conf $DIR/app.conf
sed -i 's/$BASE_DOMAIN/'"$BASE_DOMAIN"'/g' $DIR/app.conf
echo "app.conf generated!"