FROM mysql:8

ARG GRAFANA_DB_RT_USERNAME
ARG GRAFANA_DB_RT_PASSWORD

COPY init/0*.sh  /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/0*.sh

COPY init/0*.sql /docker-entrypoint-initdb.d/

COPY init/pics/*.* /tmp/

CMD ["--default-authentication-plugin=mysql_native_password"]

EXPOSE 3306
