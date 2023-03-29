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

# Influx bucket
echo "Creating buckets..."

influx bucket create --org 'bee•z' --name 'infrastructure' > /dev/null

bucket_list=`influx bucket list --json`

beez_bucket_id=`echo $bucket_list | jq -r '.[] | select(.name=="beez") | .id'`
infra_bucket_id=`echo $bucket_list | jq -r '.[] | select(.name=="infrastructure") | .id'`

echo "...done creating buckets"
echo

# Influx tokens
echo "Creating tokens..."

influx auth create -d 'TTN Influxify' -o 'bee•z' --write-bucket $beez_bucket_id > /dev/null
influx auth create -d 'Web Portal' -o 'bee•z' --read-bucket $beez_bucket_id > /dev/null

influx auth create -d 'Telegraf' -o 'bee•z' --write-bucket $infra_bucket_id > /dev/null

echo "...done creating tokens"
echo
