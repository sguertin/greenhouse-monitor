#!/usr/bin/env python3
import asyncio

from datetime import datetime, timedelta
from dataclasses import dataclass

import random

from dataclasses_json import dataclass_json, LetterCase
from pigpio import pi as Pi
import DHT
from DHT import sensor as Sensor

from configuration import Configuration


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Reading:
    temperature: float
    humidity: float
    location: str
    recorded: datetime = datetime.now()


class SensorMonitor:
    sensor: Sensor  # Sensor should be set to DHT.DHT11, DHT.DHTXX or DHT.DHTAUTO
    location: str

    # Using Pin 11 (GPIO 17) would be set to a value of 17
    def __init__(self, pi: Pi, pin: int, location: str, sensor_model_no: int = DHT.DHTAUTO):
        if not pi.connected:
            raise Exception('GPIO on Pi not connected')
        self.location = location
        self.sensor = Sensor(pi, pin, model=sensor_model_no)

    async def get_reading(self) -> Reading:
        tries = 10   # try 5 times if error
        while tries:
            try:
                # timestamp, GPIO, temperature, humidity
                _, _, status, temperature, humidity = self.sensor.read()  # read DHT device
                if(status == DHT.DHT_TIMEOUT):  # no response from sensor
                    break
                if(status == DHT.DHT_GOOD):
                    return Reading(temperature, humidity, self.location)
                await asyncio.sleep(1)
                tries -= 1
            except KeyboardInterrupt:
                break
        return


class MonitorService:
    sensors: list[SensorMonitor] = {}

    def __init__(self, pi: Pi, config: Configuration):
        for sensor in config.sensors:
            self.sensors.append(
                SensorMonitor(
                    pi,
                    sensor.pin,
                    sensor.location,
                    sensor.sensor_model_no,
                )
            )

    async def get_data(self) -> list[Reading]:
        tasks = []

        for sensor in self.sensors:
            tasks.append(asyncio.create_task(sensor.get_reading()))

        return await asyncio.gather(*tasks)


class MockSensorMonitor:
    sensor: Sensor  # Sensor should be set to DHT.DHT11, DHT.DHTXX or DHT.DHTAUTO
    location: str
    _last_reading: datetime
    _last_temp: int
    _last_humid: int
    # Using Pin 11 (GPIO 17) would be set to a value of 17

    def __init__(self, pi: Pi, pin: int, location: str, sensor_model_no: int = DHT.DHTAUTO):
        # if not pi.connected:
        #     raise Exception('GPIO on Pi not connected')

        self.location = location
        self._last_reading = datetime.now()
        self._last_temp = random.randint(75, 95)
        self._last_humid = random.randint(30, 90)
        # self.sensor = Sensor(pi, pin, model=sensor_model_no)

    async def get_reading(self) -> Reading:
        # timestamp, GPIO, temperature, humidity
        if datetime.now() - timedelta(hours=0, minutes=2) > self._last_reading:
            temperature = self._temperature
            humidity = self._humidity
        else:
            temperature = random.randint(55, 95)
            humidity = random.randint(30, 90)
        await asyncio.sleep(random.randint(0, 10))
        return Reading(temperature, humidity, self.location)


class MockMonitorService(MonitorService):
    def __init__(self, pi: Pi, config: Configuration):
        for sensor in config.sensors:
            self.sensors.append(
                MockSensorMonitor(
                    pi,
                    sensor.pin,
                    sensor.location,
                    sensor.sensor_model_no,
                )
            )
