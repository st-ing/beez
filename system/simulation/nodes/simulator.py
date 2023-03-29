#from doctest import IGNORE_EXCEPTION_DETAIL
from cmath import exp
import os
import argparse
import time
import random
import datetime
#import sched
from envyaml import EnvYAML
#import json
import logging
from influxdb_client import InfluxDBClient, Point, WriteOptions, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
 
import pandas as pd
import numpy as np
import scipy as sp
from UliEngineering.SignalProcessing.Simulation import sine_wave, cosine_wave, triangle_wave
#from matplotlib import pyplot as plt

# arguments
parser = argparse.ArgumentParser(description="bee•z node simulator")
parser.add_argument("--up",  metavar='YYYY-MM-DD', type=datetime.date.fromisoformat, help="Simulate historical data (from YYYY-MM-DD up to now)")
parser.add_argument("--on", action="store_true", help="Simulate real-time data (from now on)")
parser.add_argument("--delay", type=int, default=0, help="Startup delay in seconds")
parser.add_argument("--batch_size", type=int, default=10000, help="Size of the batch")
parser.add_argument("--batch_tact", type=int, default=0, help="Tact between batches in seconds")
parser.add_argument("--node",  metavar='NodeId', help="Node Identifier")
parser.add_argument("--gateway",  metavar='GatewayId', help="Gateway Identifier")

args = parser.parse_args()
#args = parser.parse_args(['--up', '2020-06-01', '--on', '--node', 'node-T01', '--gateway', 'gtw-T01'])

# logging config
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "WARNING"),
	format='%(asctime)s [%(levelname)-8s] #%(lineno)03d ('+args.node+') %(message)s',
)

# reading configuration
config = EnvYAML("simulator.yml")

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


logging.info('bee•z node simulator / started')

try:	
	if args.up:
		start_timestamp = pd.Timestamp(args.up)
	else:
		start_timestamp = pd.Timestamp('now')

	if args.on:
		stop_timestamp = pd.Timestamp('now')+ pd.DateOffset(years=1)
	else:
		stop_timestamp = pd.Timestamp('now')

	logging.info("Simulating into '%s' node '%s' via gateway '%s' from '%s' till '%s' in %s seconds" % (influx_url, args.node, args.gateway, start_timestamp, stop_timestamp, args.delay))

	time.sleep(args.delay)

	logging.info("Started")

	influx_client = InfluxDBClient(url=influx_url, token=influx_token, timeout=30000, debug=False)
		
	# Configure the properties of the sine wave here
	f_day = 1/24/60/60
	f_year = f_day / 365.5
	samplerate =  1 / ( 3 * 60 * 60) # 3h
	duration =int((stop_timestamp - start_timestamp).total_seconds())

	cyclus_year = sine_wave(frequency=f_year, samplerate=samplerate, 
		amplitude=8, offset=14, timedelay=int((start_timestamp - pd.Timestamp(start_timestamp.year, 5, 1)).total_seconds()), 
		length=duration)
	cyclus_day = sine_wave(frequency=f_day, samplerate=samplerate, 
		amplitude=8, offset=0, timedelay=0.75/f_day, 
		length=duration)

	cyclus_year_in = sine_wave(frequency=f_year, samplerate=samplerate, 
		amplitude=1, offset=35, timedelay=int((start_timestamp - pd.Timestamp(start_timestamp.year, 5, 1)).total_seconds()), 
		length=duration)
	cyclus_day_in = sine_wave(frequency=f_day, samplerate=samplerate, 
		amplitude=1, offset=0, timedelay=0.75/f_day, 
		length=duration)

	nsamples = len(cyclus_day)

	series_tem_out = np.array(cyclus_year + cyclus_day)
	series_hum_out = np.array(100 - 5 * (series_tem_out - cyclus_year+8))

	series_tem_in = np.array(cyclus_year_in + cyclus_day_in)
	series_hum_in = np.array(100 - 5 * (series_tem_in - 30))

	series_tem_a = np.array([t * random.normalvariate(1,0.05) for t in series_tem_out])
	series_hum_a = np.array([h * random.normalvariate(1,0.05) for h in series_hum_out]).clip(0.,100.)

	series_tem_u = np.array([t * random.normalvariate(1,0.005) for t in series_tem_in])
	series_hum_u = np.array([h * random.normalvariate(1,0.005) for h in series_hum_in]).clip(0.,100.)

	series_tem_l = np.array([t - random.normalvariate(1,0.05) for t in series_tem_u])
	series_hum_l = np.array([h + random.normalvariate(1,0.1) for h in series_hum_u]).clip(0.,100.)

	timedelta = pd.Timedelta(1/samplerate, 'seconds')
	timestamps =  [start_timestamp + i * timedelta for i in range(nsamples)]

	battery = triangle_wave(frequency=f_day, samplerate=samplerate, 
		amplitude=0.2, offset=3.8, timedelay=f_day, 
		length=duration)

	rssi = [random.normalvariate(random.randrange(60,110),5) for i in range(nsamples)]

	df = pd.DataFrame(index=pd.to_datetime(timestamps), data={
		"temA": series_tem_a,
		"humA": series_hum_a,
		# "temI": series_tem_in,
		# "humI": series_hum_in,
		"temH": series_tem_u,
		"humH": series_hum_u,
		"temL": series_tem_l,
		"humL": series_hum_l,
		"bat" : battery,
		"rssi" : rssi,
	})

	df.index.name = 'Timestamp'

	# plt.style.use("ggplot")
	# df.plot()
	# plt.gcf().autofmt_xdate()
	# plt.savefig("see.png")
	# plt.legend(loc=1)

	# df.info()
	df_up = df[:pd.Timestamp('now')].copy()
	df_on = df[pd.Timestamp('now'):].copy()
	del [[df]]

	# df_up.info()
	# df_on.info()

	if args.up:
		logging.info("Catching up ...")
		try:
			points = []
			dp_processed = 0;
			dp_total = len(df_up)


			for row in df_up.itertuples(index=True):
				dp_processed += 1

				ts = row.Index
				
				points.append(
					{
						"measurement": "telemetry",
						"tags": {
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index,
						"fields": {
							"rssi" : round(float(row.rssi)),
							"battery" : round(float(row.bat),2),
						}
					})

				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "ambient",
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index, #datetime.datetime.now().utcnow(),
						"fields": {
							"temperature" : round(float(row.temA),1),
							"humidity" : round(float(row.humA),1),
						}
					})

				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "top",
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index,
						"fields": {
							"temperature" : round(float(row.temH),1),
							"humidity" : round(float(row.humH),1),
						}
					})

				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "bottom",
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index,
						"fields": {
							"temperature" : round(float(row.temL),1),
							"humidity" : round(float(row.humL),1),
						}
					})

				# if isset(row.weight):
				# 	points.append(
				# 		{
				# 			"measurement": "honey",
				# 			"tags": {
				# 				"node": args.node,
				# 				"gateway": args.gateway,
				# 			},
				# 			"time": row.Index,
				# 			"fields": {
				# 				"weight" : round(float(row.weight),1),
				# 			}
				# 		})

				if len(points)>=args.batch_size:
					logging.info("Persisting %d data points (batched) (%d/%d %.1f%%)" % ( len(points), 4 * dp_processed, 4 * dp_total, round(100.0 * dp_processed/dp_total, 1) ) )
					with influx_client.write_api(write_options=SYNCHRONOUS) as influx_write_api:
						influx_write_api.write(bucket= influx_bucket, org= influx_org, record= points, write_precision= WritePrecision.S)
					points = []
					logging.debug("... done")
					time.sleep(args.batch_tact)

			# logging.debug(points)
			
			logging.warning('Data frame exhausted')

			if len(points)>0:
				logging.info("Persisting %d data points (remaining) (%d/%d %.1f%%)" % ( len(points), 4 * dp_processed, 4 * dp_total, round(100.0 * dp_processed/dp_total, 1) ) )
				with influx_client.write_api(write_options=SYNCHRONOUS) as influx_write_api:
					influx_write_api.write(bucket= influx_bucket, org= influx_org, record= points, write_precision= WritePrecision.S)
				points = []
				logging.debug("... done")

		except Exception:
			logging.exception("Problem persisting data", exc_info=True)

		del [[df_up]]

	
	if args.on:
		logging.info("Catching on ...")
		try:
			points = []

			for row in df_on.itertuples(index=True):
				ts = row.Index
				
				while ts > pd.Timestamp('now'):
					if len(points)>0:
						logging.info("Persisting %d data points" % len(points))
						with influx_client.write_api(write_options=SYNCHRONOUS) as influx_write_api:
							influx_write_api.write(bucket= influx_bucket, org= influx_org, record= points, write_precision= WritePrecision.S)
						points = []
						logging.debug("... done")

					time.sleep(60) # sleep a minute

				points.append(
					{
						"measurement": "telemetry",
						"tags": {
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index,
						"fields": {
							"rssi" : round(float(row.rssi)),
							"battery" : round(float(row.bat),2),
						}
					})

				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "ambient",
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index, #datetime.datetime.now().utcnow(),
						"fields": {
							"temperature" : round(float(row.temA),1),
							"humidity" : round(float(row.humA),1),
						}
					})

				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "top",
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index,
						"fields": {
							"temperature" : round(float(row.temH),1),
							"humidity" : round(float(row.humH),1),
						}
					})

				points.append(
					{
						"measurement": "air",
						"tags": {
							"position" : "bottom",
							"node": args.node,
							"gateway": args.gateway,
						},
						"time": row.Index,
						"fields": {
							"temperature" : round(float(row.temL),1),
							"humidity" : round(float(row.humL),1),
						}
					})

				# if isset(row.weight):
				# 	points.append(
				# 		{
				# 			"measurement": "honey",
				# 			"tags": {
				# 				"node": args.node,
				# 				"gateway": args.gateway,
				# 			},
				# 			"time": row.Index,
				# 			"fields": {
				# 				"weight" : round(float(row.weight),1),
				# 			}
				# 		})

				if len(points)>args.batch_size:
					logging.info("Persisting %d data points (batched)" % len(points))
					with influx_client.write_api(write_options=SYNCHRONOUS) as influx_write_api:
						influx_write_api.write(bucket= influx_bucket, org= influx_org, record= points, write_precision= WritePrecision.S)
					points = []
					logging.debug("... done")
					time.sleep(args.batch_tact)

			# logging.debug(points)
			
			logging.warning('Data frame exhausted')

			if len(points)>0:
				logging.info("Persisting %d data points (remaining)" % len(points))
				with influx_client.write_api(write_options=SYNCHRONOUS) as influx_write_api:
					influx_write_api.write(bucket= influx_bucket, org= influx_org, record= points, write_precision= WritePrecision.S)
				points = []
				logging.debug("... done")

		except Exception:
			logging.exception("Problem persisting data", exc_info=True)

		del [[df_on]]
		
	
except Exception:
	logging.exception("bee•z node simulator / error", exc_info=True)

logging.info('bee•z node simulator / finished')