/*
  BeeZ - Gateway

  This is the firmware for the BeeZ gateway. It get aggregated values from 
  the nodes using LoRa and sends them via GSM to BeeZ system.

*/

#include <Arduino.h>
#include <MKRGSM.h>
#include <ArduinoLowPower.h>
#include <Streaming.h>
#include <ArduinoJson.h>

#include <SPI.h>
#include <LoRa.h>

#ifndef DEBUG
#define DEBUG false
#endif

#define LOG if(DEBUG)Serial1

GSM gsmAccess;
GSMModem modem;
GPRS gprs;
GSMSSLClient client;
#ifdef LOCATION
GSMLocation location;
#endif

#ifdef SMS
GSM_SMS sms;
char senderNumber[20];
#endif

String imei = "";

#define GPS_ACCURACY 50000 // in meters

StaticJsonDocument<2048> dataS; // 20 local nodes (111 * N)
DynamicJsonDocument dataA(2048);

volatile bool synchronisingData = false;

//diagnostics
unsigned long diag_packageDroppedSyncing = 0;
unsigned long diag_packageDroppedWrongSize = 0;
unsigned long diag_packageReceived = 0;
unsigned long diag_nodesSeen = 0;


// time sync

/*
unsigned long webUnixTime()
{
  unsigned long time = 0;

  if (client.connectSSL(INFLUXDB_HOST, 443)) 
  {
    client << F("POST /ping HTTP/1.1") << endl;
    client << F("Host: ) << INFLUXDB_HOST << endl;
    client << F("User-Agent: BeeZ-GSM/0.2") << endl;
    client << F("Connection: close") << endl;
    client << F("Content-Length: 0") << endl << endl;

    char buf[5];
    client.setTimeout(5000);
    if (client.find((char *)"\r\nDate: ") && client.readBytes(buf, 5) == 5)
    {
      unsigned day = client.parseInt();
      client.readBytes(buf, 1);
      client.readBytes(buf, 3);
      int year = client.parseInt();
      byte hour = client.parseInt();
      byte minute = client.parseInt();
      byte second = client.parseInt();

      int daysInPrevMonths;
      switch (buf[0])
      {
          case 'F': daysInPrevMonths =  31; break;
          case 'S': daysInPrevMonths = 243; break;
          case 'O': daysInPrevMonths = 273; break;
          case 'N': daysInPrevMonths = 304; break;
          case 'D': daysInPrevMonths = 334; break;
          default:
            if (buf[0] == 'J' && buf[1] == 'a')
              daysInPrevMonths = 0;
            else if (buf[0] == 'A' && buf[1] == 'p')
              daysInPrevMonths = 90;
            else 
            switch (buf[2])
            {
              case 'r': daysInPrevMonths =  59; break;
              case 'y': daysInPrevMonths = 120; break;
              case 'n': daysInPrevMonths = 151; break;
              case 'l': daysInPrevMonths = 181; break;
              default:
              case 'g': daysInPrevMonths = 212; break;
            }
      }
      day += (year - 1970) * 365;
      day += (year - 1969) >> 2;
      day += daysInPrevMonths;
      if (daysInPrevMonths >= 59 && ((year & 3) == 0)) day += 1;
      time = (((day-1ul) * 24 + hour) * 60 + minute) * 60 + second;
    }
  }
  delay(10);
  client.flush();
  client.stop();

  return time;
}

bool epochSync()
{
  unsigned long epoch = webUnixTime();  
  
  if (epoch == 0) return false;
  epoch_ = epoch;
  ticks_ = millis() / 1000;
  return true;
}
*/

unsigned long epoch_ = 1554122096;
unsigned long ticks_ = 0;
unsigned long sleeps_ = 0;

bool epochSync(unsigned long epoch)
{
  if (epoch < 1073900000) return false;
  epoch_ = epoch;
  ticks_ = millis() / 1000;
  sleeps_ = 0;
  return true;
}

unsigned long epoch()
{
  return epoch_ + millis()/1000 - ticks_ + sleeps_;
}


// utility

void ledOn()
{
  digitalWrite(LED_BUILTIN, HIGH);
}

void ledOff()
{
  digitalWrite(LED_BUILTIN, LOW);
}

void ledToggle()
{
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}

float readBatteryLevel()
{
  int sensorValue = analogRead(ADC_BATTERY);
  float voltage = sensorValue * (4.3 / 1023.0);
  
  return voltage;
}

void resetSystem(bool blink = true)
{
  if (blink)
  {
    ledOn();delay(512);ledOff();delay(512);ledOn();delay(512);ledOff();delay(512);ledOn();delay(512);ledOff();
  }

  NVIC_SystemReset();
}

// LoRa 

void onReceive(int packetSize) {
  if (synchronisingData) 
  {
    diag_packageDroppedSyncing++;
    return;
  }

  if (packetSize != 18)
  {
    LOG << "Received (" << packetSize << " bytes) - Ignored" << endl;
    for (int i=0; i<packetSize; i++) LoRa.read();
    diag_packageDroppedWrongSize++;
    return;
  }
  diag_packageReceived++;

  ledOn();
  
  uint8_t data[18];  
  LoRa.readBytes(data, 18);

  // unpack data
  uint32_t node_v = data[14] << 24 | data[15] << 16 | data[16] << 8 | data[17] << 0;
  String node = String(node_v, HEX);
  float battery = 0.01 * (data[0] << 8 | data[1]);
  float humidity_A    = 0.1 * (data[2] << 8 | data[3]);
  float temperature_A = 0.1 * (data[4] << 24 >> 16 | data[5]);
  float humidity_L    = 0.1 * (data[6] << 8 | data[7]);
  float temperature_L = 0.1 * (data[8] << 24 >> 16 | data[9]);
  float humidity_H    = 0.1 * (data[10] << 8 | data[11]);
  float temperature_H = 0.1 * (data[12] << 24 >> 16 | data[13]);
  
  #ifdef DEBUG_LORA_DETAILS
  LOG << F("@") << epoch() << F(" [") << node << "] " << _FLOAT(battery,2) << "V" 
         << F(" - A ") << _FLOAT(humidity_A,0) << F("% ") << _FLOAT(temperature_A, 1) << F("°C")
         << F(" - L ") << _FLOAT(humidity_L,0) << F("% ") << _FLOAT(temperature_L, 1) << F("°C")
         << F(" - H ") << _FLOAT(humidity_H,0) << F("% ") << _FLOAT(temperature_H, 1) << F("°C");

  LOG << F(" / ") << "RSSI = " << LoRa.packetRssi() << "dB / SNNR = " << LoRa.packetSnr() << "db / Frequency error = " << LoRa.packetFrequencyError() << "Hz" << endl;
  #endif

  if (dataA[node].isNull())
    diag_nodesSeen++;

  dataA[node]["s"] = round(min(LoRa.packetRssi(), dataS[node]["r"]));

  if (!isnan(battery))
  {
    float b = dataS[node]["b"] = battery + dataS[node]["b"].as<float>();
    int c   = dataS[node]["cb"] = 1 + dataS[node]["cb"].as<int>();

    dataA[node]["b"] = 0.01 * round(100.0 * b / c);
  }
  if (!isnan(humidity_A) && !isnan(temperature_A))
  { 
    float h = dataS[node]["ha"] = humidity_A + dataS[node]["ha"].as<float>();
    float t = dataS[node]["ta"] = temperature_A + dataS[node]["ta"].as<float>();
    int c   = dataS[node]["ca"] = 1 + dataS[node]["ca"].as<int>();

    dataA[node]["ha"] = round(h / c);
    dataA[node]["ta"] = 0.1 * round(10.0 * t / c);
  }
  if (!isnan(humidity_L) && !isnan(temperature_L))
  {
    float h = dataS[node]["hl"] = humidity_A + dataS[node]["hl"].as<float>();
    float t = dataS[node]["tl"] = temperature_A + dataS[node]["tl"].as<float>();
    int c   = dataS[node]["cl"] = 1 + dataS[node]["cl"].as<int>();

    dataA[node]["hl"] = round(h / c);
    dataA[node]["tl"] = 0.1 * round(10.0 * t / c);
  }
  if (!isnan(humidity_H) && !isnan(temperature_H))
  {
    float h = dataS[node]["hh"] = humidity_A + dataS[node]["hh"].as<float>();
    float t = dataS[node]["th"] = temperature_A + dataS[node]["th"].as<float>();
    int c   = dataS[node]["ch"] = 1 + dataS[node]["ch"].as<int>();

    dataA[node]["hh"] = round(h / c);
    dataA[node]["th"] = 0.1 * round(10.0 * t / c);
  }

  ledOff();

  #ifdef DEBUG_LORA_DETAILS
  #ifdef DEBUG
  LOG << F(" R - "); serializeJson(dataS, Serial); LOG << endl;
  #endif
  #endif
}

// GSM

#ifdef SMS
void checkSMS()
{
  // Receiving SMS
  LOG << F("  Checking SMS         : ");
  unsigned long _ = millis();
  bool smsAvailable = false;
  while (smsAvailable = sms.available() == 0 && millis() - _ < 5000);

  LOG << (smsAvailable ? F("✔") : F("⌀")) << " (" << smsAvailable << ")" << endl;

  if (!smsAvailable) return;

  sms.remoteNumber(senderNumber, 20);
  LOG << F("    From : ") << senderNumber << endl;

  if (sms.peek() == '#') 
  {
    LOG << F("<discarded message>") << endl;
    sms.flush();
  }	

  LOG << F("    Text : ");
  char smsChar;
  int smsLen = 0;
  while (smsLen++ < 918 && (smsChar = sms.read() != -1) )
  {
    LOG.print((char)smsChar);
  }
  LOG << endl;
}

bool sendSMS(const char* to, const char* text)
{
  LOG << F("  Sending SMS          : ");
  bool smsOk = sms.beginSMS(to);
  sms.print(text);
  smsOk &= sms.endSMS();
  LOG << (smsOk ? F("✔") : F("✖")) << endl;
  return smsOk;
}

#endif

void startGSM()
{
  // GSM & GPRS

  bool initiatedGSM = false;
  uint8_t initiatedGSMTry = 1;

  while (!initiatedGSM) {
    LOG << F("  Starting GSM   (") << initiatedGSMTry << F("/5) : ");
    GSM3_NetworkStatus_t stat = gsmAccess.begin(MOBILE_PIN);
    bool gsmOk = stat == GSM_READY;
    LOG << (gsmOk ? F("✔") : F("✖")) << endl;  

    LOG << F("  Starting GPRS  (") << initiatedGSMTry << F("/5) : ");
    GSM3_NetworkStatus_t gprsStat = gsmOk ? gprs.attachGPRS(MOBILE_DATA_APN, MOBILE_DATA_USERNAME, MOBILE_DATA_PASSWORD) : GSM_OFF;
    bool gprsOk = gprsStat == GPRS_READY;
    LOG << (gprsOk ? F("✔") : F("✖")) << endl;  

    initiatedGSM = gsmOk && gprsOk;

    if (!initiatedGSM)
    {
      LOG << F("      GSM status = ") << stat << F("   GPRS status = ") << gprsStat << endl;
      if (initiatedGSMTry++ == 5) resetSystem();
      delay(1000);
      continue;
    }
  }
  LOG << F("  Connecting           : ");
  LOG << (initiatedGSM ? F("✔") : F("✖")) << endl;

  #ifdef LOCATION
  // AGPS
	LOG << F("  Starting AGPS        : ");
  bool locating = location.begin();
  LOG << (locating ? F("✔") : F("✖")) << endl;
  #endif

  // Time sync
  /*
	LOG << F("  Synching clock       : ");
  bool synched = epochSync();
  LOG << (synched ? F("✔") : F("✖")) << endl;
  */
 
	LOG << F("  Synching clock (GSM) : ");
  long e1 = epoch();
  bool synchedGSM = epochSync(gsmAccess.getLocalTime());
  long e2 = epoch();
  LOG << (synchedGSM ? F("✔") : F("✖")) << F(" <") << (e2-e1) << F("s>") << endl;
}

bool stopGSM()
{
  LOG << F("  Shutting down        : ");
  bool gsmDown = gsmAccess.shutdown();
  LOG << (gsmDown ? F("✔") : F("✖")) << endl;  

  LOG << F("  Lowering power       : ");
  bool gsmLowPower = gsmAccess.lowPowerMode();
  LOG << (gsmLowPower ? F("✔") : F("✖")) << endl;

  return gsmDown && gsmLowPower;
}


// looping & sleeping

unsigned long last_loop_epoch = 0;


unsigned long nextSyncIn()
{
  //return (5 * 60) - epoch() % (5 * 60); // debugging 5 minutes
  return (SYNC_INTERVAL * 60 * 60) - epoch() % (SYNC_INTERVAL * 60 * 60);
}



void setup() {
  for (int i=0; i < 15; i++) { pinMode(i, INPUT_PULLUP); digitalWrite(i,LOW); }
  pinMode(LED_BUILTIN, OUTPUT);
  
  delay(5000);

  // setting serial
  #if(DEBUG)
  LOG.begin(115200);
  //while (!Serial && millis() < 10000);
  LOG << endl << endl  << F("Bee-Z Gateway") << F(" /v") << F(VERSION) << F("/ - ") << F(__DATE__) << F(" ") << F(__TIME__) << endl << endl << F("#") << endl;
  #endif

  ledOn();

  // modem
	LOG << F("  Getting IMEI         : ");
  bool modeming = modem.begin();
  if (modeming)
    modeming = (imei = modem.getIMEI()) != NULL;
  LOG << (modeming ? F("✔") : F("✖")) << " (" << imei << ")" << endl;

  if (!modeming) resetSystem();

  startGSM();

  #ifdef SMS
  checkSMS();
  #endif

  // LoRa
  bool initiatedLoRa = false;
  uint8_t initiatedLoRaTry = 1;
  while (!initiatedLoRa) 
  {  
    LOG << F("  Setting LoRa   (") << initiatedLoRaTry << F("/5) : ");
    LoRa.setPins(6, 7, 0);
    LoRa.setSyncWord(0xBE);
    /*
    LoRa.setFrequency(866E6);
    LoRa.setSpreadingFactor(7); // between 6 and 12. If a spreading factor of 6 is set, implicit header mode must be used to transmit and receive packets.
    LoRa.setSignalBandwidth(125E3); // 7.8E3, 10.4E3, 15.6E3, 20.8E3, 31.25E3, 41.7E3, 62.5E3, 125E3, and 250E3
    */
    LoRa.enableCrc();
    
    bool loring = LoRa.begin(866E6);
    LOG << (loring ? F("✔") : F("✖")) << endl; 

    if (!loring)
    {
      if (initiatedLoRaTry++ == 5) resetSystem();
      delay(5000);
      continue;
    }

    LoRa.onReceive(onReceive);
    LoRa.receive();
    initiatedLoRa = true;
  }

  #ifdef SMS
  String smsText = String("Setup @ ") + epoch() + " - " + millis()+" millis"+
    " - IMEI: " + imei +
    " - Battery " + readBatteryLevel() + "V" + 
    " - Sleep for " + nextSyncIn() +"s / " + (nextSyncIn()/3600)+"h "+(nextSyncIn()%3600/60)+"m "+(nextSyncIn()%60)+"s";

  sendSMS(SMS_LOGGING_NUMBER, smsText.c_str());
  #endif
  stopGSM();

  ledOff();
  LOG << F("#") << endl << endl;
  
  #ifdef DEEP_SLEEP
  USBDevice.detach();
  #endif
}



void loop()
{
  // reset
  if (millis() > 86400000L) resetSystem(false);
  
  LOG << "zzz" << endl << endl;
  // sleeping
  unsigned long sleep_seconds = nextSyncIn();
  sleeps_ += sleep_seconds;
  #ifdef DEEP_SLEEP
  //LowPower.attachInterruptWakeup(RTC_ALARM_WAKEUP, onSync, CHANGE); // instead of using normal attachInterrupt from LoRa lib - ! not working
  //LowPower.deepSleep(sleep_seconds * 1000); // 21 mA @ 5.1 V - ! not working
  //LowPower.sleep(sleep_seconds * 1000); // 21 mA @ 5.1 V - ! not working
  //LowPower.idle(sleep_seconds * 1000); // ! not working
  delay(sleep_seconds * 1000); // not optimal but only one working atm
  #else
  delay(sleep_seconds * 1000); // 35 mA @ 5.1 V ≈ 420 mAh/day
  #endif
  LOG << endl << endl << "ZZZ" << endl;
  LOG << F("@") << epoch() << F(" [init]") <<endl;
  
  long epoch_resumed = epoch();
  float batteryLevel = readBatteryLevel();

  ledOn();
  
  startGSM();

  /*
  #ifdef SMS
  String smsTextWakeUp = String("Waking @ ") + epoch() + 
    " - Epoching " + ((long)epoch()-epoch_resumed) + "s"+
    " - Battery " + batteryLevel + "V" + 
    " - Packages " + diag_packageReceived + " / t " + diag_packageDroppedWrongSize + " / s "+diag_packageDroppedSyncing +
    " - Nodes " + diag_nodesSeen;

  sendSMS(SMS_LOGGING_NUMBER, smsTextWakeUp.c_str());
  #endif
  */

  synchronisingData = true;
  
  last_loop_epoch = epoch();

  LOG << F("@") << epoch() << F(" [start]") <<endl;
    
  // Handling data
  String content = String("");

  LOG << F("  Parsing              : ");
  DynamicJsonDocument dataDoc = dataA;
  JsonObject dataObj = dataDoc.as<JsonObject>();
  for (JsonPair p : dataObj) 
  {
    String node = String(p.key().c_str());
    float bat = float(p.value()["b"]);
    float hum_a = float(p.value()["ha"]);
    float tem_a = float(p.value()["ta"]);
    float hum_l = float(p.value()["hl"]);
    float tem_l = float(p.value()["tl"]);
    float hum_h = float(p.value()["hh"]);
    float tem_h = float(p.value()["th"]);
    int rssi = int(p.value()["s"]);
    
    String content_ln = 
      String("air,") + 
      "node="+node+","+"gateway=beez-gsm-"+imei+","+"position=ambient"+" "+ // hive, location, keeper ????
      "temperature=" + tem_a + "," + "humidity=" + hum_a + " " +
      epoch() + "\n" +
      String("air,") + 
      "node="+node+","+"gateway=beez-gsm-"+imei+","+"position=bottom"+" "+ // hive, location, keeper ????
      "temperature=" + tem_l + "," + "humidity=" + hum_l + " " +
      epoch() + "\n" +
      String("air,") + 
      "node="+node+","+"gateway=beez-gsm-"+imei+","+"position=top"+" "+ // hive, location, keeper ????
      "temperature=" + tem_h + "," + "humidity=" + hum_h + " " +
      epoch() + "\n" +
      String("telemetry,") + 
      "node="+node+","+"gateway=beez-gsm-"+imei+" "+ // hive, location, keeper ????
      "battery=" + bat +"," + "rssi=" + rssi +"i"+ " "+
      epoch();

    content = (content.length() > 0 ? content + "\n" : String("")) + content_ln;
  }
  dataDoc.clear();

  // Handling gateway
  #ifdef LOCATION
  // GPS
  while (!location.available() && location.accuracy() > GPS_ACCURACY) { yield(); }
  LOG << "  AGPS -  lat : " << String(location.latitude(),7) << " - lon : " << String(location.longitude(),7)<< " - # : " << String(location.accuracy()) << endl;
  #endif

  String content_ln = String("telemetry,") + 
    "gateway=beez-gsm-"+imei+" "+ // hive, location, keeper ????
    "battery=" + batteryLevel +","+"millis=" + millis()+","+
    "sleepies=" + ((long)epoch()-epoch_resumed) +","+
    "nodes_seen=" + diag_nodesSeen +","+
    "packages_received=" + diag_packageReceived +","+
    "packages_dropped_wrong_size=" + diag_packageDroppedWrongSize +","+
    "packages_dropped_syncing=" + diag_packageDroppedSyncing;    
  #ifdef LOCATION
     content_ln = content_ln+","+"latitude="+String(location.latitude(),7)+","+"longitude="+String(location.longitude(),7)+","+"accuracy="+ String(location.accuracy());
  #endif    
  content_ln = content_ln + " " + epoch();

  content = (content.length() > 0 ? content + "\n" : String("")) + content_ln;

  LOG << "|" << endl << content << endl << "|" << endl;

  // Request
  bool request_ok;
  LOG << F("  Connecting to BeeZ   : ");

  client.setCertificateValidationLevel(0);

  if (client.connectSSL(INFLUXDB_HOST, 443))
  {
    LOG << F("✔") << endl;

    LOG << F("  Sending data         : ");

    client << F("POST /api/v2/write?org=") << INFLUXDB_ORG << F("&bucket=") << INFLUXDB_BUCKET << F("&precision=s HTTP/1.1") << endl;
    client << F("Host: ") << INFLUXDB_HOST << endl;
    client << F("User-Agent: beez-gsm-gateway/") << VERSION << endl;
    client << F("Authorization: Token ") << INFLUXDB_TOKEN << endl;
    //client << F("Content-Type: text/plain") << endl;
    client << F("Connection: close") << endl;
    client << F("Content-Length: ") << content.length() << endl;
    client << endl;
    client << content;

    LOG << F("✔") << endl;
    request_ok = true;
  }
  else
  {
    LOG << F("✖") << endl;
    request_ok = false;
  }
  
  bool response_ok = false;
  #ifdef DEBUG_GPRS_RESPONSE
  LOG << F("  Receiving response ->") << endl;
  #endif
  while  (client.available()) {
    char c = client.read();
    #ifdef DEBUG_GPRS_RESPONSE
    Serial.print(c);
    #endif
    response_ok = true;
  }
  #ifdef DEBUG_GPRS_RESPONSE
  LOG << endl << F("  <- response received.") << endl;
  #endif

  if (!client.available() && !client.connected()) {
    LOG << F("  Disconnecting        : ");
    client.stop();
    LOG << F("✔") << endl << endl;
  }

  #ifdef SMS
  String smsTextSync = String("Sync @ ") + epoch() + 
  " - Epoching " + ((long)epoch()-epoch_resumed) + "s"+
  " - Battery " + batteryLevel + "V" +   
  " - Packages " + diag_packageReceived + " /w " + diag_packageDroppedWrongSize + " /s "+diag_packageDroppedSyncing +
  " - Nodes " + diag_nodesSeen +
  " - Data req " + ((request_ok ? F("Y") : F("N")) ) + " / resp " + ((response_ok ? F("Y") : F("N")) ) +
  " - Sleep for " + (nextSyncIn()/3600)+"h "+(nextSyncIn()%3600/60)+"m "+(nextSyncIn()%60)+"s";
  #endif

  LOG << F("@") << epoch() << F(" [deinit]") <<endl;

  {
    diag_packageDroppedSyncing = 0;
    diag_packageDroppedWrongSize = 0;
    diag_packageReceived = 0;
    diag_nodesSeen = 0;
  } 
  if (request_ok)// && response_ok)
  {
    dataA.clear();
    dataS.clear();
  }
  
  synchronisingData = false;
  //ledBlink();

  #ifdef SMS
  sendSMS(SMS_LOGGING_NUMBER, smsTextSync.c_str());
  #endif

  stopGSM();
   
  ledOff();
  
  LOG << F("@") << epoch() << F(" [stop]") <<endl;
}