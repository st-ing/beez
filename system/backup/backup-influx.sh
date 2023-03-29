#!/bin/bash

echo "Backing up..."
docker exec beez_influxdb_1 influx backup /tmp/influxdb_backup
echo "Compressing backup..."
docker exec beez_influxdb_1 tar -zcvf /tmp/backup.tar.gz /tmp/influxdb_backup
echo "Transfering backup..."
docker cp beez_influxdb_1:/tmp/backup.tar.gz ~/backup/beez-influx-daily-$(date "+%Y-%m-%d").tar.gz
echo "Cleaning up..."
docker exec beez_influxdb_1 rm /tmp/backup.tar.gz
docker exec beez_influxdb_1 rm -rf /tmp/influxdb_backup

if [ $(date +%u) -eq 7 ];then
    echo "Creating weekly backup..."
    cp ~/backup/beez-influx-daily-$(date "+%Y-%m-%d").tar.gz ~/backup/beez-influx-weekly-$(date "+%Y-%m-%d").tar.gz
fi

if [ $(date +%d) -eq 25 ];then
    echo "Creating mohtly backup..."
    cp ~/backup/beez-influx-daily-$(date "+%Y-%m-%d").tar.gz ~/backup/beez-influx-monthly-$(date "+%Y-%m-%d").tar.gz
fi

echo "Removing old daily backups..."
rm -rf ~/backup/beez-influx-daily-$(date +"%Y-%m-%d" --date '7 days ago').tar.gz
echo "Removing old weekly backups..."
rm -rf ~/backup/beez-influx-weekly-$(date +"%Y-%m-%d" --date '5 weeks ago').tar.gz
echo "Removing old monthly backups..."
rm -rf ~/backup/beez-influx-monthly-$(date +"%Y-%m-%d" --date '12 months ago').tar.gz