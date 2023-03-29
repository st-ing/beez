import os
import time
import datetime
import sched
from envyaml import EnvYAML
import json
import logging
import paho.mqtt.client
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from logstash_async.handler import AsynchronousLogstashHandler
from logstash_async.transport import HttpTransport
from logstash_async.handler import LogstashFormatter

# logging config
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "WARNING"),
	format='%(asctime)s [%(levelname)-8s] #%(lineno)03d / %(funcName)s / (%(threadName)-10s) %(message)s',
)

# reading configuration
config = EnvYAML("influxify.yml")

# remote logging set-up
log = logging.getLogger("stash")

# set log level
log.setLevel(os.environ.get("LOGSTASH_LEVEL", "WARNING"))

# configure http transport
transport = HttpTransport(
    host=config['logstash']['host'],
    port=443,
    ssl_enable=True,
    ssl_verify=True,
    timeout=5.0,
    username=config['logstash']['username'],
    password=config['logstash']['password'],
)

# define async logstash handler which will use configured http transport
handler = AsynchronousLogstashHandler(
    host=config['logstash']['host'],
    port=443,
	transport=transport,
    database_path='log-stash.db')

# let's add extra fields using logstash formatter
formatter = LogstashFormatter(
	extra={
		'application': "beez",
		'component': "influxify",		
		'environment': config['logstash']['environment']})
handler.setFormatter(formatter)

# register this handler
log.addHandler(handler)

# ttn config
ttn_mqtt_broker = config['ttn_mqtt']['server']
ttn_mqtt_broker_port = config['ttn_mqtt']['port']
ttn_mqtt_username = config['ttn_mqtt']['username']
ttn_mqtt_password = config['ttn_mqtt']['password']
ttn_mqtt_client_id = 'beez'

# influx config
influx_url = config['influx']['url']
influx_org = config['influx']['org']
influx_bucket = config['influx']['bucket']
influx_token = config['influx']['token']

def isfloat(value):
  try:
    float(value)
    return True
  except Exception:
    return False


def ttn_on_connect(client, userdata, flags, rc):
	log.info("MQTT * On Connect - Result: " + paho.mqtt.client.connack_string(rc))
	ttn_mqtt_client.subscribe("v3/+/devices/+/up", 0)


def ttn_on_disconnect(client, userdata, rc):
	if rc != 0:
		log.warning("MQTT * On Disconnect - unexpected disconnection")

def ttn_on_message(client, userdata, message):
	try:
		log.debug('MQTT * On Message - Topic - %s' % message.topic)
		
		try:
			payload = message.payload.decode('utf8')
			log.debug('MQTT * On Message - Payload -  %s' % payload)

			message_data = json.loads(payload)
			
			device_ids = message_data["end_device_ids"]
			uplink_message = message_data["uplink_message"]
			
			data = uplink_message["decoded_payload"]
			rx_data = uplink_message["rx_metadata"]

			node = device_ids.get("device_id") #.replace("beez-", "")
			hwd = device_ids.get("dev_eui")

			bat	= data.get("Battery")

			temA = data["Temperature"].get("Ambient")
			humA = data["Humidity"].get("Ambient")
			temH = data["Temperature"].get("High")
			humH = data["Humidity"].get("High")
			temM = data["Temperature"].get("Medium")
			humM = data["Humidity"].get("Medium")
			temL = data["Temperature"].get("Low")
			humL = data["Humidity"].get("Low")

			weight	= data.get("Weight")

			rssi = -1000
			snr = -1000			
			gtw = ''

			for rx_datum in rx_data:
				if rx_datum['rssi'] > rssi:
					gtw = rx_datum['gateway_ids']['gateway_id']
					rssi = rx_datum['rssi']
					snr = rx_datum.get('snr', 0)

			log.info('MQTT * On Message - Data : node=%s serial=%s data=%s battery=%sV gtw=%s rssi=%s snr=%s' % (node, hwd, data, bat, gtw, rssi, snr))

		except Exception:
			log.exception("MQTT * On Message - Error parsing payload: %s" % (payload), exc_info=True)
			return

		try:
			points = [
				{
					"measurement": "telemetry",
					"tags": {
						"node": node,
						"gateway": gtw,
					},
					"time": datetime.datetime.now().utcnow(),
					"fields": {
						"rssi" : rssi,
					}
				}
			]

			if isfloat(bat):
				points[0]['fields']["battery"] = round(float(bat),2)

			if isfloat(temA) or isfloat(humA):
				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "ambient",
							"node": node,
							"gateway": gtw,
						},
						"time": datetime.datetime.now().utcnow(),
						"fields": {
							"temperature" : round(float(temA),1),
							"humidity" : round(float(humA),1),
						}
					})

			if isfloat(temH) or isfloat(humH):
				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "top",
							"node": node,
							"gateway": gtw,
						},
						"time": datetime.datetime.now().utcnow(),
						"fields": {
							"temperature" : round(float(temH),1),
							"humidity" : round(float(humH),1),
						}
					})

			if isfloat(temM) or isfloat(humM):
				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "middle",
							"node": node,
							"gateway": gtw,
						},
						"time": datetime.datetime.now().utcnow(),
						"fields": {
							"temperature" : round(float(temM),1),
							"humidity" : round(float(humM),1),
						}
					})

			if isfloat(temL) or isfloat(humL):
				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "bottom",
							"node": node,
							"gateway": gtw,
						},
						"time": datetime.datetime.now().utcnow(),
						"fields": {
							"temperature" : round(float(temL),1),
							"humidity" : round(float(humL),1),
						}
					})

			if isfloat(weight):
				points.append(
					{
						"measurement": "honey",
						"tags": {
							"node": node,
							"gateway": gtw,
						},
						"time": datetime.datetime.now().utcnow(),
						"fields": {
							"weight" : round(float(weight),1),
						}
					})

			log.debug(points)

			influx_write_api.write(influx_bucket, influx_org, points)

			log.debug('MQTT * On Message - Update persisted to Database')
		except Exception:
			log.exception("InfluxDB * On Message -	Exception persisting update to Database", exc_info=True)
			return

	except Exception:
		log.exception("MQTT * On Message - Error")

	return


def ttn_on_subscribe(client, userdata, mid, granted_qos):
	log.info('MQTT * On Subscribe - MId=' + str(mid) + ' QoS=' + str(granted_qos))


def ttn_on_log(client, userdata, level, string):	
	if level >= logging.INFO:
		log.log(level, 'MQTT * Log - %s' % str(string))


log.info('BeeZ - TTN to InfluxDB / started')

try:
	influx_client = InfluxDBClient(url=influx_url, token=influx_token, debug=True)
	influx_write_api = influx_client.write_api(write_options=SYNCHRONOUS)

	# ttn
	ttn_mqtt_client = paho.mqtt.client.Client(client_id=ttn_mqtt_client_id, clean_session=False, userdata=None)

	ttn_mqtt_client.on_connect = ttn_on_connect
	ttn_mqtt_client.on_disconnect = ttn_on_disconnect

	ttn_mqtt_client.on_message = ttn_on_message

	ttn_mqtt_client.on_subscribe = ttn_on_subscribe
	ttn_mqtt_client.on_log = ttn_on_log

	ttn_mqtt_client.username_pw_set(username=ttn_mqtt_username, password=ttn_mqtt_password)
	ttn_mqtt_client.tls_set('thethings-network.pem')
	ttn_mqtt_client.connect(ttn_mqtt_broker, ttn_mqtt_broker_port, 60)

	ttn_mqtt_client.loop_forever()

except Exception:
	log.exception("BeeZ - TTN to InfluxDB / error", exc_info=True)

log.error('BeeZ - TTN to InfluxDB / finished')
