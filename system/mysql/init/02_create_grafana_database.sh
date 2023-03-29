#!/bin/bash

echo "Creating Grafana database"
mysql -u root -p${MYSQL_ROOT_PASSWORD} <<EOF
CREATE DATABASE grafana;
EOF

echo "Adding system user to Grafana database"
mysql -u root -p${MYSQL_ROOT_PASSWORD} <<EOF
CREATE USER '${GRAFANA_DB_RT_USERNAME}'@'%' IDENTIFIED WITH mysql_native_password BY '${GRAFANA_DB_RT_PASSWORD}';
GRANT USAGE ON grafana.* TO '${GRAFANA_DB_RT_USERNAME}'@'%';
GRANT ALL PRIVILEGES ON grafana.* to '${GRAFANA_DB_RT_USERNAME}'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

#echo "Creating session table"
#mysql -u root -p${MYSQL_ROOT_PASSWORD} <<EOF
#CREATE TABLE IF NOT EXISTS `beez`.`session` (
#  `key`   char(16) NOT NULL,
#  `data`  blob,
#  `expiry` int(11) unsigned NOT NULL,
#  PRIMARY KEY (`key`)
#)
#COLLATE='utf8mb4_unicode_ci';
#EOF