FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install -r requirements.txt

COPY simulator.py .
COPY simulator.yml .

COPY simulate.sh /usr/bin/
RUN chmod +x /usr/bin/simulate.sh

ENTRYPOINT ["/usr/bin/simulate.sh"]
