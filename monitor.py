#!/usr/bin/env python3

import sys
from typing import Union
import pigpio
import DHT
import time
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Reading:
    temperature: float
    humidity: float
    recorded: datetime = datetime.now()

class SensorMonitorService:    
    pin: int # e.g. Using Pin 11 (GPIO 17) would be set to a value of 17
    sensor: int # Sensor should be set to DHT.DHT11, DHT.DHTXX or DHT.DHTAUTO

    def __init__(self, sensor: int, pin: int):
        self.pin = pin
        self.sensor = sensor

    @classmethod
    def getDHT11MonitorService(cls, pin: int):
        return cls(DHT.DHT11, pin)  

    @classmethod
    def getDHTXXMonitorService(cls, pin: int):
        return cls(DHT.DHTXX, pin)

    @classmethod
    def getDHTAUTOMonitorService(cls, pin: int):
        return cls(DHT.DHTAUTO, pin)

    def get_reading(self) -> Reading:
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
                time.sleep(2)
                tries -=1
            except KeyboardInterrupt:
                break
        return 

class DHT11MonitorService(SensorMonitorService):
    def __init__(self, pin: int):
        super().__init__(DHT.DHT11, pin)

class DHTXXMonitorService(SensorMonitorService):
    def __init__(self, pin: int):
        super().__init__(DHT.DHTXX, pin)








def output_data(timestamp, temperature, humidity):
    # Sample output Date: 2019-11-17T10:55:08, Temperature: 25°C, Humidity: 72%
    date = datetime.fromtimestamp(timestamp).replace(microsecond=0).isoformat()
    print(u"Date: {:s}, Temperature: {:g}\u00b0C, Humidity: {:g}%".format(date, temperature, humidity))


