#!/bin/bash


echo "Preparing users pictures"
echo "UPDATE beez.users SET image='$(base64 /tmp/user-1.png | tr -d \\n)' WHERE id=1;" >> /tmp/pictures.sql
echo "UPDATE beez.users SET image='$(base64 /tmp/user-2.png | tr -d \\n)' WHERE id=2;" >> /tmp/pictures.sql
echo "UPDATE beez.users SET image='$(base64 /tmp/user-3.png | tr -d \\n)' WHERE id=3;" >> /tmp/pictures.sql
echo "UPDATE beez.users SET image='$(base64 /tmp/user-admin.webp | tr -d \\n)' WHERE id=10;" >> /tmp/pictures.sql
echo "UPDATE beez.users SET image='$(base64 /tmp/user-waldemar.bonsels.png | tr -d \\n)' WHERE id=11;" >> /tmp/pictures.sql

# echo "Preparing apiaries pictures"
# echo "UPDATE beez.apiaries SET image='$(base64 /tmp/apiary-05.png | tr -d \\n)' WHERE id=5;" >> /tmp/pictures.sql
# echo "UPDATE beez.apiaries SET image='$(base64 /tmp/apiary-06.png | tr -d \\n)' WHERE id=6;" >> /tmp/pictures.sql
# echo "UPDATE beez.apiaries SET image='$(base64 /tmp/apiary-07.png | tr -d \\n)' WHERE id=7;" >> /tmp/pictures.sql
# echo "UPDATE beez.apiaries SET image='$(base64 /tmp/apiary-11.png | tr -d \\n)' WHERE id=11;" >> /tmp/pictures.sql
# echo "UPDATE beez.apiaries SET image='$(base64 /tmp/apiary-12.png | tr -d \\n)' WHERE id=12;" >> /tmp/pictures.sql
# echo "UPDATE beez.apiaries SET image='$(base64 /tmp/apiary-54.png | tr -d \\n)' WHERE id=54;" >> /tmp/pictures.sql

# echo "Preparing apiaries pictures"
# echo "UPDATE beez.beehives SET image='$(base64 /tmp/beehive-505,6.png | tr -d \\n)' WHERE id=505;" >> /tmp/pictures.sql
# echo "UPDATE beez.beehives SET image='$(base64 /tmp/beehive-505,6.png | tr -d \\n)' WHERE id=506;" >> /tmp/pictures.sql

echo "Inserting pictures"
mysql -u root -p${MYSQL_ROOT_PASSWORD} < /tmp/pictures.sql;
