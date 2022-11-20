

/*

  Samyam Lamichhane
  Serial Communication
  Bi-directional communcation
  Intro-To-Interactive-Media
  
  Nov 20, 2022 Sun.
    
    
  * Description *
    - LED Blinks when the ball bounces
    - Potentiometer can be used to control the wind direction and speed
      
  
  * Schematics *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_3_bi_directional/bi_dir_schem_ex_3_Samyam.png


  * Pair it with *
  
    

*/


// Global variables
int ledPin = 5;
int potPin = A0;
int serialRead = 0;

void setup()
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);          // Set the LED pin
}
 
void loop() 
{
  // Reading input from the potentiometer
  while (Serial.available() > 0) 
  {
    serialRead = Serial.read();
    analogWrite(ledPin, serialRead);
  }

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

