FROM python:3.9-alpine

RUN pip install influxdb-client
RUN pip install paho-mqtt
RUN pip install envyaml
RUN pip install python-logstash-async

WORKDIR /app

ADD thethings-network.pem   ./thethings-network.pem

COPY influxify.py      ./influxify.py
COPY influxify.yml     ./influxify.yml

CMD [ "python", "-u", "/app/influxify.py" ]