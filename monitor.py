#!/usr/bin/env python3
# import asyncio

import sys
from typing import Union
import pigpio
import DHT
import time
from dataclasses import dataclass
from dataclasses_json import dataclass_json, LetterCase
from datetime import datetime

@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Reading:
    temperature: float
    humidity: float
    recorded: datetime = datetime.now()  
    
        

class SensorMonitor:    
    pin: int # e.g. Using Pin 11 (GPIO 17) would be set to a value of 17
    sensor: int # Sensor should be set to DHT.DHT11, DHT.DHTXX or DHT.DHTAUTO

    def __init__(self, pin: int, sensor: int = DHT.DHTAUTO):
        self.pin = pin
        self.sensor = sensor

    @classmethod
    def getDHT11Monitor(cls, pin: int):
        return cls(pin, DHT.DHT11)  

    @classmethod
    def getDHTXXMonitor(cls, pin: int):
        return cls(pin, DHT.DHTXX)

    @classmethod
    def getDHTAUTOMonitor(cls, pin: int):
        return cls(pin, DHT.DHTAUTO)

    async def get_reading(self) -> Reading:
        pi = pigpio.pi()
        if not pi.connected:
            raise Exception('GPIO on Pi not connected')
        
        s = DHT.sensor(pi, self.pin, model = self.sensor)

        tries = 5   # try 5 times if error
        while tries:
            try:
                _, _, status, temperature, humidity = s.read()   #read DHT device
                if(status == DHT.DHT_TIMEOUT):  # no response from sensor
                    return None
                if(status == DHT.DHT_GOOD):
                    return Reading(temperature, humidity)                    
                await time.sleep(2)
                tries -=1
            except KeyboardInterrupt:
                break
        return 










# def output_data(timestamp, temperature, humidity):
#     # Sample output Date: 2019-11-17T10:55:08, Temperature: 25°C, Humidity: 72%
#     date = datetime.fromtimestamp(timestamp).replace(microsecond=0).isoformat()
#     print(u"Date: {:s}, Temperature: {:g}\u00b0C, Humidity: {:g}%".format(
#         date, temperature, humidity))


# pi = pigpio.pi()
# if not pi.connected:
#     exit()

# s = DHT.sensor(pi, pin, model=sensor)

# tries = 5   # try 5 times if error
# while tries:
#     try:
#         timestamp, gpio, status, temperature, humidity = s.read()  # read DHT device
#         if(status == DHT.DHT_TIMEOUT):  # no response from sensor
#             print(f'Timed out')
#             exit()
#         if(status == DHT.DHT_GOOD):
#             output_data(timestamp, temperature, humidity)
#             exit()      # Exit after successful read\
#         print(f'Waiting.... [Status = {status}] Tries Remaining: {tries}')
#         time.sleep(2)
#         tries -= 1
#     except KeyboardInterrupt:
#         break
