/*
    Setup.h - Pin Declarations, patterns, common variables & setup function for POVWand.
    Created by Daniel Esteban, February 19, 2013.
*/

#ifndef Config_h
#define Config_h

#include <Arduino.h>
#include <SoftwareSerial.h>

//#define SerialSpeed 57600
#define SerialSpeed 19200

#define TimerMs 2

//Pin Declarations
#define Register DDRA
#define Port PORTA
#define LatchPin 1
#define ClockPin 2
#define DataPin 0
#define Led9Pin 3
#define Led10Pin 4
#define SerialRxPin 8
#define SerialTxPin 7

//Patterns
const byte numPatterns = 1,
    numSteps = 40;

bool patternTest[numSteps * 10] PROGMEM = {
    1,1,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,0,0,0,1,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,1,1,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
};

const bool * patterns[numPatterns] = {patternTest};

//STOP EDITING HERE...

//Library and setup function

SoftwareSerial Serial(SerialRxPin, SerialTxPin);

void setup() {
	pinMode(SerialRxPin, INPUT);
	pinMode(SerialTxPin, OUTPUT);
	Serial.begin(SerialSpeed);
	
	Register |= (1 << LatchPin);
	Register |= (1 << ClockPin);
	Register |= (1 << DataPin);
	Register |= (1 << Led9Pin);
	Register |= (1 << Led10Pin);

	cli(); //stop interrupts

	TCCR1A = 0;
	TCCR1B = 0;
	TCNT1  = 0;
  	TCCR1B |= (1 << WGM12); //turn on CTC mode
	TCCR1B |= (1 << CS11) | (1 << CS10); //Set CS11 & CS10 bits for 64 prescaler
	OCR1A = (F_CPU / (64000 / TimerMs)) - 1; //set compare match register to sampleRate
	TIMSK1 |= (1 << OCIE1A); //enable timer compare interrupt

	sei(); //allow interrupts
}

#endif
