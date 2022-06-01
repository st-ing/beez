# **bee•z** node #

This is the firmware for the node of the **bee•z** system.

The node acquires:
* air conditions (temperature, humidity) from top and bottom SHT31 sensors
* air conditions (temperature, humidity) from ambient AM2320 sensors
* ...

accumulates data and sends via [The Things Network](https://www.thethingsnetwork.org/) or [bee•z - LoRa/GSM gateway](../gateway) to the [bee•z](https://beez.link/) system.

🚧

The node is powered by:
  - Li-Ion 3.6V 10000mAh battery
  - 1 x Solar Panel 5V 50mA