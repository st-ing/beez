#!/bin/sh

#shopt -s expand_aliases
alias dc='docker-compose -p beez --compatibility -f docker-compose.yml -f docker-compose-$1.yml --env-file $1.env'
alias dci='dc exec -T influxdb'
alias influx='dci influx'

echo "Connecting to InfluxDB..."
until influx ping
do
  echo "InfluxDB not ready... Retrying in 5s..."
  sleep 5
done
echo "...connected!"

echo "Replacing environment variables..."
auth_list=`influx auth list --json`
ttn_token=`echo $auth_list | jq -r '.[] | select(.description=="TTN Influxify") | .token'`
portal_token=`echo $auth_list | jq -r '.[] | select(.description=="Web Portal") | .token'`
telegraf_token=`echo $auth_list | jq -r '.[] | select(.description=="Telegraf") | .token'`

env_file="$1.env"

sed -i "s/TTN_INFLUX_TOKEN=.*/TTN_INFLUX_TOKEN=$ttn_token/g" $env_file
sed -i "s/PORTAL_INFLUX_TOKEN=.*/PORTAL_INFLUX_TOKEN=$portal_token/" $env_file
sed -i "s/TELEGRAF_INFLUX_TOKEN=.*/TELEGRAF_INFLUX_TOKEN=$telegraf_token/" $env_file

echo "...done replacing variables"
echo
