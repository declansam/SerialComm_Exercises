

/*
  Samyam Lamichhane
  Serial Communication
  Intro-To-Interactive-Media
    
  Nov 20, 2022 Sun.
    
  * Description *
    - Keyboard arrows can be used to control the x-position of the ball on screen
    - In return, it controls the brightness of an LED

  * Schematics *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_2/ex_2_led_write_schem_Samyam.png


  * Pair it with *
  p5.js file

*/


int ledPin = 5;
int serialRead = 0;

void setup()
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}
 
void loop() 
{
  while (Serial.available() > 0) 
  {
    serialRead = Serial.read();
    analogWrite(ledPin, serialRead);
  }
}

