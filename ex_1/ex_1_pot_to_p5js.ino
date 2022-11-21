

/*
  Samyam Lamichhane
  Serial Communication
  Intro-To-Interactive-Media
    
  Nov 20, 2022 Sun.
    
    
  * Description *
    - Potentiometer can be used to control the x-coordinates of the ball on the canvas

  * Schematics *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_1/ex_1_pot_read_schem_Samyam.png


  * Pair it with *
  p5.js file
  

*/


int potPin = A0;

void setup() 
{
  Serial.begin(9600); // initialize serial communications
}
 
void loop() 
{
  // read the input pin:
  int pot_read = analogRead(potPin); 

  // remap the pot value to fit in 1 byte:
  int mappedPot = map(pot_read, 0, 1023, 0, 255); 

  // print it out the serial port:
  Serial.write(mappedPot);    
                           
  // slight delay to stabilize the ADC:
  delay(1);                                          
  
  // Delay to send 10 times per second 
  delay(100);
}

