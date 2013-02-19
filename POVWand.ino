//#include <EEPROM.h>
#include <SoftwareSerial.h>
#include "Setup.h"

#define SERIAL_FUNC_DUMP 1
#define SERIAL_FUNC_RESET 2
#define SERIAL_FUNC_STOP 3

byte pattern = 0, step = 0;

void loop(void) {
    if(Serial.available()) {
        switch((byte) Serial.read()) {
            case 0: //Dump EEPROM
                Serial.write(SERIAL_FUNC_DUMP);
                Serial.write(numSteps);
                for(int x=0; x<numSteps * 10; x++) Serial.write(pgm_read_byte_near(patterns[pattern] + x)); //Serial.write(EEPROM.read(x));
            break;
            case 1: //Reset EEPROM
                //EEPROM.write(0, 0);
                //EEPROM.write(1, 0);
                Serial.write(SERIAL_FUNC_RESET);
            break;
            case 2: //Stop Flashing
                cli();
                TCCR1A = 0;
                TCCR1B = 0;
                TIMSK1 &= ~(1 << OCIE1A);
                sei();
                Serial.write(SERIAL_FUNC_STOP);
        }
    }
}

ISR(TIM1_COMPA_vect) {
    int offset = (int) step * 10;

    Port &= ~(1 << LatchPin);
    for(byte x=0; x<10; x++) {
        switch(x) {
            case 8:
            case 9:
                if(step < numSteps && pgm_read_byte_near(patterns[pattern] + (offset + x))) Port |= (1 << (x == 8 ? Led9Pin : Led10Pin));
                else Port &= ~(1 << (x == 8 ? Led9Pin : Led10Pin));
            break;
            default:
                if(step < numSteps && pgm_read_byte_near(patterns[pattern] + (offset + x))) Port |= (1 << DataPin);
                else Port &= ~(1 << DataPin);
                Port |= (1 << ClockPin);
                Port &= ~(1 << ClockPin);
        }
    }
    Port |= (1 << LatchPin);

    if(step == numSteps + 7) step = 0;
    else step++;
}
