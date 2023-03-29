/*
  BeeZ Scale - Calibration

  BeeZ Scale sketch - Calibration of the scales

  Copyright (c) 2017 Thingy.IO
*/

#include <HX711.h>

HX711 scale;

float calibration_factor = 19190;
#define offset -

void setup()
{
	// Reset switch
	pinMode(5, INPUT);
  
  Serial.begin(115200);
	Serial.println("HX711 calibration sketch");
	Serial.println("Remove all weight from scale");
	Serial.println("After readings begin, place known weight on scale");
	Serial.println("Press + or a to increase calibration factor");
	Serial.println("Press - or z to decrease calibration factor");

  scale.begin(11,12);

	scale.set_scale(64);
	scale.read_average(7);
	scale.set_offset(-12854);

	long zero_factor = scale.read_average(); //Get a baseline reading
	Serial.print("Zero factor: "); //This can be used to remove the need to tare the scale. Useful in permanent scale projects.
	Serial.println(zero_factor);
}

float weight;
float weightCummulative=0;
int   weightCount=0;

unsigned long ticks = 0;
void loop()
{
     Serial.print("Reading: ");
  
    // weight
    double w = scale.get_units(3);
    weightCummulative += round(w * 100) * 0.01f;
 
    weightCount++;
    weight = (weightCount> 0) ? (1.0 * weightCummulative / weightCount) : NAN;

    Serial.print(w); Serial.print(" kg ");
    Serial.print(weight); Serial.print(" kg ");

    if (ticks % 5 == 0)
    {
      weightCount=0;
      weightCummulative=0;
    }


  Serial.print(" calibration_factor: ");
  Serial.print(calibration_factor);
  Serial.println();

  if(Serial.available())
  {
    char temp = Serial.read();
    if(temp == 'q' ) calibration_factor += 10;
    if(temp == 'w' ) calibration_factor += 100;
    if(temp == 'e' ) calibration_factor += 1000;
    if(temp == 'a')  calibration_factor -= 10;
    if(temp == 's')  calibration_factor -= 100;
    if(temp == 'd')  calibration_factor -= 1000;

 	  scale.set_scale(calibration_factor);
  }

  ticks++;
}
