#define USB_VERSION 0x210
#include <Arduino.h>
#include <WebUSB.h>
#include <Adafruit_NeoPixel.h>

#define PIN 6
#define NUMPIXELS 16
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

//WebUSB WebUSBSerial(1, "localhost:3000");
WebUSB WebUSBSerial(1, "alvarowolfx.github.io/physical-led-ring-webusb-arduino");

//#define Serial WebUSBSerial

int color[4];
int index;

void setup()
{
    /*while (!Serial)
    {
        ;
    }*/
    WebUSBSerial.begin(9600);
    WebUSBSerial.write("Sketch begins.\r\n");
    WebUSBSerial.flush();

    pixels.begin();
    pixels.setBrightness(40);
    index = 0;
}

void loop()
{
    if (WebUSBSerial && WebUSBSerial.available())
    {
        color[index++] = WebUSBSerial.read();
        if (index == 4)
        {
            int ledIndex = color[0];
            int red = color[1];
            int green = color[2];
            int blue = color[3];

            // Turn all leds if receives 255
            if (ledIndex == 255)
            {
                for (int i = 0; i < NUMPIXELS; i++)
                {
                    pixels.setPixelColor(i, pixels.Color(red, green, blue));
                }
            }
            else if (ledIndex < NUMPIXELS)
            {
                pixels.setPixelColor(ledIndex, pixels.Color(red, green, blue));
            }
            pixels.show();

            WebUSBSerial.print("Set LED at position ");
            WebUSBSerial.print(ledIndex);
            WebUSBSerial.print(" to ");
            WebUSBSerial.print(color[1]);
            WebUSBSerial.print(", ");
            WebUSBSerial.print(color[2]);
            WebUSBSerial.print(", ");
            WebUSBSerial.print(color[3]);
            WebUSBSerial.print(".\r\n");
            WebUSBSerial.flush();
            index = 0;
        }
    }
}