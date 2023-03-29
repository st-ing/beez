/*
  BeeZ - Node

  This is the firmware for the node that acquires:
     - air conditions (temperature, humidity) from uper SHT31 sensors
     - air conditions (temperature, humidity) from bottom SHT31 sensors
     - air conditions (temperature, humidity) from ambient AM2320 sensors
     - ?
  accumulates data and sends it via 'The Things Network' or 'Beez - LoRa/GSM gateway' to BeeZ system.

*/

#include <SPI.h>

#ifdef LoRaWAN
#include <lmic.h>
#include <hal/hal.h>
#endif

#ifdef LORA
#include <LoRa.h>
#endif

#include <Streaming.h>
#include "LowPower.h"

#include "Adafruit_SHT31.h"
#include "Adafruit_AM2320.h"

#ifdef WEIGHT
#include <HX711.h>
#endif

#define LOG if(DEBUG)Serial

#define LED_PIN 13

#ifdef LoRaWAN
static const uint8_t NWKSKEY[16] = NWK_S_KEY;
static const uint8_t APPSKEY[16] = APP_S_KEY;
static const uint32_t DEVADDR = DEV_ADDR;
void os_getArtEui (u1_t* buf) { }
void os_getDevEui (u1_t* buf) { }
void os_getDevKey (u1_t* buf) { }
#if LoRaWAN == OTAA
static const u1_t PROGMEM APPEUI[8]=APP_EUI; //LSB
static const u1_t PROGMEM DEVEUI[8]=DEV_EUI // LSB
static const u1_t PROGMEM APPKEY[16] = APP_KEY; //MSB
void os_getArtEui (u1_t* buf) { memcpy_P(buf, APPEUI, 8);}
void os_getDevEui (u1_t* buf) { memcpy_P(buf, DEVEUI, 8);}
void os_getDevKey (u1_t* buf) {  memcpy_P(buf, APPKEY, 16);}
#endif
#endif

Adafruit_SHT31 sensor_H = Adafruit_SHT31();
Adafruit_SHT31 sensor_L = Adafruit_SHT31();
Adafruit_AM2320 sensor_A = Adafruit_AM2320();

#ifdef WEIGHT
HX711 scale;
#endif

#ifdef LoRa32u4IIv13
#ifdef LoRaWAN
const lmic_pinmap lmic_pins =
{
    .nss = 8,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 4,
    .dio = {7, 5, LMIC_UNUSED_PIN},
};
#endif
const double batteryNominal = 4.2 / 0.75;
#else
#ifdef LoRaWAN
const lmic_pinmap lmic_pins =
{
    .nss = 8,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 4,
    .dio = {7, 6, LMIC_UNUSED_PIN},
};
#endif
const double batteryNominal = 8.888;
#endif

// A, L, M, H
double humidity[4];
double humidityCummulative[4] = {0, 0, 0, 0};

double temperature[4];
double temperatureCummulative[4] = {0, 0, 0, 0};

int    countCummulative[4] = {0, 0, 0, 0};

float batteryLevel;
float batteryLevelCummulative=0;
int   batteryLevelCount=0;

// W
#ifdef WEIGHT
float weight;
float weightCummulative=0;
int   weightCount=0;
#endif

uint8_t data[18];

unsigned long cycle_length = CYCLE * 60 * 1000UL; // in minutes
unsigned long sense_every = SENSING;              // in cycles
unsigned long send_every = SENDING;               // in cycles

unsigned long cycle = -1;

void ledOn() { digitalWrite(LED_PIN,HIGH); }
void ledOff() { digitalWrite(LED_PIN,LOW); }
void ledBlink() { bool s = digitalRead(LED_PIN);digitalWrite(LED_PIN,!s);delay(250);digitalWrite(LED_PIN,s);delay(500);digitalWrite(LED_PIN,!s);delay(250);digitalWrite(LED_PIN,s); }

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN,LOW);

  ledOn();

  // setting serial
  #if(DEBUG)
  Serial.begin(115200);
  while (!Serial && millis() < 10000);
  Serial << F(VERSION) << F(" - ") << F(_NAME_) << F(" - ") << F(__DATE__) << F(" ") << F(__TIME__) << endl << endl;
  #endif

  ledBlink();

  // init sensors
  LOG << F("Initializing sensors...") << endl;

  #ifdef LoRa32u4IIv13
  // setup battery charger
  DDRB |= (1<<PB0);
  PORTB |= (1<<PB0);    // on
  //PORTB &= ~(1<<PB0); // off
  #endif

  if (!sensor_A.begin())
    LOG << F("...error ambient sensor") << endl;
  if (!sensor_L.begin(0x44)) 
    LOG << F("...error lower sensor") << endl;
  if (!sensor_H.begin(0x45)) // ADDR <-> VIN
    LOG << F("...error upper sensor") << endl;

  #ifdef WEIGHT
  scale.begin(11,12);
	scale.set_scale(LOADCELL_DIVIDER);
	scale.set_offset(LOADCELL_OFFSET);
  #endif

  #ifdef LoRaWAN
  // init LoRa
  LOG << F("Initializing LoRa...") << endl;
  os_init();
  LMIC_reset();

  LMIC_setSession (0x13, DEVADDR, (uint8_t*)NWKSKEY, (uint8_t*)APPSKEY);

  LMIC_setupChannel(0, 868100000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(1, 868300000, DR_RANGE_MAP(DR_SF12, DR_SF7B), BAND_CENTI);      // g-band
  LMIC_setupChannel(2, 868500000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(3, 867100000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(4, 867300000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(5, 867500000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(6, 867700000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(7, 867900000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
  LMIC_setupChannel(8, 868800000, DR_RANGE_MAP(DR_FSK,  DR_FSK),  BAND_MILLI);      // g2-band

  //for(int i=1; i<9; i++) LMIC_disableChannel(i); // channel enabler/disabler
  
  LMIC_setLinkCheckMode(0);

  //LMIC_disableTracking();
  //LMIC_stopPingable();

  LMIC.dn2Dr = DR_SF9;
  LMIC_setDrTxpow(DR_SF7,14);

  #endif

  #ifdef LORA
  LoRa.setPins(8, 4, 7);
  LoRa.setSyncWord(0xBE);
  LoRa.enableCrc();
  LoRa.begin(866E6);
  #endif

  #if!(DEBUG)
  //USBDevice.detach();
  USBCON |= _BV(FRZCLK); // Disable USB clock
  PLLCSR &= ~_BV(PLLE);  // Disable USB PLL
  USBCON &= ~_BV(USBE);   // Disable USB
  #endif

  ledBlink();

  LOG << F(" ...initializing DONE") << endl;

  ledOff();
}


void loop()
{
  unsigned long cycle_ts = millis();
  cycle += 1;

  // sense
  if ( (cycle % sense_every) == 0 )
  {
    LOG << F("[") << millis() << F("] Acquiring Data :   ");

    // battery level
    int batteryVoltage = 0;
    analogRead(A9); for (int i=0; i<3; i++) batteryVoltage += analogRead(A9);
    batteryLevelCount++;
    batteryLevelCummulative += 1.0 * batteryVoltage / 4096;
    batteryLevel = batteryNominal * batteryLevelCummulative / batteryLevelCount;
    
    LOG << batteryLevel << F("V   ");

    #ifdef WEIGHT // make it cummulative as well
    // weight
    double w = scale.get_units(3);
    weightCummulative += round(w * 100) * 0.01f;
 
    weightCount++;
    weight = (weightCount> 0) ? (1.0 * weightCummulative / weightCount) : NAN;

    LOG << weight << F("kg   ") << endl;
    #endif
    
    // humidity & temperature
    for (int s=0; s<3; s++)
    {
      for (int l=0; l<3; l++)
      {
          unsigned long s_ = millis();
          while (millis() - s_ < 1000 && l>0)
          {
              yield();
              
              #ifdef LoRaWAN
              os_runloop_once();
              #endif
              // LowPower.idle(SLEEP_2S, ADC_OFF, TIMER4_OFF, TIMER3_OFF, TIMER1_OFF, TIMER0_OFF, SPI_OFF, USART1_OFF, TWI_OFF, USB_OFF);
          }

          bool ok = true;
          float h = NAN;
          float t = NAN;

          switch (s)
          {
            case 0: // ambient
              h = sensor_A.readHumidity();
              t = sensor_A.readTemperature();
              break;

            case 1: // low
              h = sensor_L.readHumidity();
              t = sensor_L.readTemperature();
              break;

            case 2: // high
              h = sensor_H.readHumidity();
              t = sensor_H.readTemperature();
              break;
          }

          if (ok && !isnan(h) && !isnan(t))
          {
              humidityCummulative[s] += h;
              temperatureCummulative[s] += t;
              countCummulative[s]++;
          }
          /*
          else
          {
              humidityCummulative[s] += random(50,90);
              temperatureCummulative[s] += random(15,30);
              countCummulative[s]++;
          }
          */

          //LOG << F(": ") <<l << F("# ") << t << F("°C ") << h <<F("% RH") << F(":");
      }

      humidity[s] = (countCummulative[s]> 0) ? (1.0 * humidityCummulative[s] / countCummulative[s]) : NAN;
      temperature[s] = (countCummulative[s]> 0) ? (1.0 * temperatureCummulative[s] / countCummulative[s]) : NAN;

      LOG << F("[") << s << F("] ") << humidity[s] << F("% ") << temperature[s] << F("°C   ");
    }
    LOG << endl;
    //

    if ((cycle % send_every) == 0)
    {
      for (int s=0; s<4; s++)
      {
        countCummulative[s] = 0;
        humidityCummulative[s] = 0;
        temperatureCummulative[s] = 0;
      }
      batteryLevelCount=0;
      batteryLevelCummulative=0;
      
      #ifdef WEIGHT 
      weightCount=0;
      weightCummulative=0;
      #endif
    }

    //delay(60000);return; /////////////////////////////
    
    /*
    if (batteryLevel < 3.6)
      cycle_length = 10 * 60 * 1000UL;
    else
      cycle_length = 5 * 60 * 1000UL;
    */
  }

  /*
  if (batteryLevel < 3.5)
    return; ?????
  */

  // check if need to send
  if ( (cycle % send_every) == 0)
  {
    // pack data
    uint16_t datum;
    uint8_t data_len=0;

    // battery
    datum = batteryLevel * 100;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    // ambient
    datum = isnan(humidity[0]) ? 0xFFFF : humidity[0] * 10;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    datum = isnan(temperature[0]) ? 0xFFFF : temperature[0] * 10;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    // low
    datum = isnan(humidity[1]) ? 0xFFFF : humidity[1] * 10;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    datum = isnan(temperature[1]) ? 0xFFFF : temperature[1] * 10;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    // high
    datum = isnan(humidity[2]) ? 0xFFFF : humidity[2] * 10;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    datum = isnan(temperature[2]) ? 0xFFFF : temperature[2] * 10;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;

    #ifdef WEIGHT
    // weight
    datum = isnan(weight) ? 0xFFFF : weight * 100;
    data[data_len++] = ( datum >> 8 ) & 0xFF;
    data[data_len++] = ( datum >> 0 ) & 0xFF;
    #endif

    #ifdef LORA
    data[data_len++] = ( DEV_ADDR >> 24 ) & 0xFF;
    data[data_len++] = ( DEV_ADDR >> 16 ) & 0xFF;
    data[data_len++] = ( DEV_ADDR >>  8 ) & 0xFF;
    data[data_len++] = ( DEV_ADDR >>  0 ) & 0xFF;
    #endif

    //ledBlink();

    #ifdef LoRaWAN
    // sending
    //LMIC.txChnl = 0;
    //LMIC.chRnd = 2;
    
    uint8_t data_port = 1;
    if (data_len == 6)  data_port = 3; // demo/test node
    if (data_len == 14) data_port = 1; // regular
    if (data_len == 16) data_port = 2; // weight
    if (data_len == 18) data_port = 4; // 4+1

    LOG << F("[") << millis() << F("] Queueing");
    int res = LMIC_setTxData2(data_port, (uint8_t*) data, data_len, 0);
    LOG << ((res == 0) ? F(" - OK") : F(" - ERROR")) << F(" (CH") << LMIC.txChnl << F(")") << endl;

    LOG << F("[") << millis() << F("] Sending ... ");
    unsigned long _s = millis();
    while ( (LMIC.opmode & OP_JOINING) or (LMIC.opmode & OP_TXRXPEND) ) { os_runloop_once(); }
    LOG << F(" ... (") << (millis()-_s) << F(" ms)") << endl;

    #endif

    #ifdef LORA
    LoRa.beginPacket();
    LoRa.write((uint8_t*) data, data_len);
    LoRa.endPacket(true); // true = async / non-blocking mode
    #endif

    ledBlink();
  }

  /*
  /// tempotary time stuff ///
  Serial << F("[") << millis() << F("] zz.. ");
  unsigned long st = (cycle_length - millis() + cycle_ts) / 1000;
  for (int i1=0; i1 < st; i1++) delay(1000);
  Serial << F(" ..zz [") << millis() << F("]") << endl;
  return;
  ///
  */

  // go to sleep
  #if(DEBUG)
  Serial << F("[") << millis() << F("] zz.. ");
  Serial.flush();

  //USBDevice.detach();
  USBCON |= _BV(FRZCLK); // Disable USB clock
  PLLCSR &= ~_BV(PLLE);  // Disable USB PLL
  USBCON &= ~_BV(USBE);   // Disable USB
  #endif

  unsigned long sleep_time = (cycle_length - millis() + cycle_ts) / 1000;
  for (int i8=0; i8 < sleep_time / 8; i8++) LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
  for (int i1=0; i1 < sleep_time % 8; i1++) LowPower.powerDown(SLEEP_1S, ADC_OFF, BOD_OFF);

  // TO DO maybe ??? check the cunsumption with and without this one.... and reboot if yes....
  //LMIC_shutdown();
  ////

  #if(DEBUG)
  USBDevice.attach();

  Serial << F(" ..zz [") << millis() << F("]") << endl;
  #endif
}

#ifdef LoRaWAN

void onEvent (ev_t ev) {
  switch (ev) {
    case EV_TXCOMPLETE:
      LOG.print(F("EV_TXCOMPLETE"));
      if (LMIC.dataLen) {
        // data received in rx slot after tx
        LOG.print(F("Data Received: "));
        LOG.write(LMIC.frame+LMIC.dataBeg, LMIC.dataLen);
      }
      break;
    default:
      break;
  }
}

#endif