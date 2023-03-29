#!/bin/bash

export $(grep -v '^#' ~/hot.env | xargs -d '\r\n')

echo "Backing up & compressing..."
docker exec beez_mysql_1 /usr/bin/mysqldump -u$DB_RT_ROOT_USERNAME --password=$DB_RT_ROOT_PASSWORD --all-databases | gzip -9 > ~/backup/beez-mysql-daily-$(date "+%Y-%m-%d").sql.gz

if [ $(date +%u) -eq 7 ];then
    echo "Creating weekly backup..."
    cp ~/backup/beez-mysql-daily-$(date "+%Y-%m-%d").sql.gz ~/backup/beez-mysql-weekly-$(date "+%Y-%m-%d").sql.gz
fi

if [ $(date +%d) -eq 25 ];then
    echo "Creating mohtly backup..."
    cp ~/backup/beez-mysql-daily-$(date "+%Y-%m-%d").sql.gz ~/backup/beez-mysql-monthly-$(date "+%Y-%m-%d").sql.gz
fi

echo "Removing old daily backups..."
rm -rf ~/backup/beez-mysql-daily-$(date +"%Y-%m-%d" --date '7 days ago').sql.gz
echo "Removing old weekly backups..."
rm -rf ~/backup/beez-mysql-weekly-$(date +"%Y-%m-%d" --date '5 weeks ago').sql.gz
echo "Removing old monthly backups..."
rm -rf ~/backup/beez-mysql-monthly-$(date +"%Y-%m-%d" --date '12 months ago').sql.gz