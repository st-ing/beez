#!/bin/bash

cd /app

# Gateway A
#  1 / BeeHive A.1.1 - 1999-12-31
python -u simulator.py --gateway gtw-A --node sim-01 --up $(date +"%Y-%m-%d" --date '24 months ago') --batch_tact 1 --batch_size 1024 --delay 150 ;
python -u simulator.py --gateway gtw-A --node sim-01 --on &
#  2 / BeeHive A.1.2 - 1999-12-31
python -u simulator.py --gateway gtw-A --node sim-02 --up $(date +"%Y-%m-%d" --date '24 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-A --node sim-02 --on &
#  3 / BeeHive A.1.3 - 1999-12-31
python -u simulator.py --gateway gtw-A --node sim-03 --up $(date +"%Y-%m-%d" --date '24 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-A --node sim-03 --on &

# Gateway B1
#  7 / BeeHive A.4.1 - 2001-02-28 
python -u simulator.py --gateway gtw-B1 --node sim-07 --up $(date +"%Y-%m-%d" --date '18 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-B1 --node sim-07 --on &
#  8 / BeeHive A.4.2 - 2002-02-28
python -u simulator.py --gateway gtw-B1 --node sim-08 --up $(date +"%Y-%m-%d" --date '18 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-B1 --node sim-08 --on &
#  9 / BeeHive A.4.3 - 2003-02-28
python -u simulator.py --gateway gtw-B1 --node sim-09 --up $(date +"%Y-%m-%d" --date '18 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-B1 --node sim-09 --on &

# Gateway B2
#  6 / Beehive A.3.3 - 2000-01-03
python -u simulator.py --gateway gtw-B2 --node sim-06 --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
#  10 / Košnica Q11 - 1982-04-16
python -u simulator.py --gateway gtw-B2 --node sim-10 --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
#  11 / Bienenstock R10
python -u simulator.py --gateway gtw-B2 --node sim-11 --on &
#  12 / Košnica S09 - 1982-04-16
python -u simulator.py --gateway gtw-B2 --node sim-12 --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-B2 --node sim-12 --on &

# Gateway G
#   31 / Cassandra - 1972-04-16
#  --- LoRa ---
#   32 / Freddy - 1978-04-16
python -u simulator.py --gateway gtw-G --node tst-E0AB6917 --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-G --node tst-E0AB6917 --on &
#   33 / Willi - 1973-04-16
python -u simulator.py --gateway gtw-G --node tst-3EEA0DAF --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-G --node tst-3EEA0DAF --on &
#  [34] / Buzzlina - 1974-04-16
python -u simulator.py --gateway gtw-G --node tst-1541B162 --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-G --node tst-1541B162 --on &
#   41  / Bosby - 1972-04-16
#   --- LoRa ---
#   42  / Flip - 1978-04-16
python -u simulator.py --gateway gtw-G --node tst-BD0CE2B5 --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-G --node tst-BD0CE2B5 --on &
#  [43] / Barry - 1973-04-16
python -u simulator.py --gateway gtw-G --node tst-E62C91FD --up $(date +"%Y-%m-%d" --date '12 months ago') --batch_tact 1 --batch_size 1024 ;
python -u simulator.py --gateway gtw-G --node tst-E62C91FD --on &

wait
