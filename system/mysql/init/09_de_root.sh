#!/bin/bash

echo "De-rooting"
mysql -u root -p${MYSQL_ROOT_PASSWORD} <<EOF
RENAME USER 'root'@'%' TO '${MYSQL_ROOT_USERNAME}'@'%';
FLUSH PRIVILEGES;
EOF
