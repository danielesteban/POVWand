//#include <EEPROM.h>
#include <SoftwareSerial.h>
#include "Setup.h"

byte pattern = 0, step = 0;

void loop(void) { }

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

    if(step == numSteps + 5) step = 0;
    else step++;
}
