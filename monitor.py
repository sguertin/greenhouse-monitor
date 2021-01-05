#!/usr/bin/env python3
import asyncio
from datetime import datetime, timedelta
from dataclasses import dataclass
import random

from dataclasses_json import dataclass_json, LetterCase
from pigpio import pi as Pi
import DHT
from DHT import sensor as Sensor

from configuration import SensorSettings


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass(eq=True, frozen=True)
class Reading:
    temperature: float
    humidity: float
    location: str
    pin: int
    recorded: datetime = datetime.now()


class SensorMonitor:
    sensor: Sensor  # Sensor should be set to DHT.DHT11, DHT.DHTXX or DHT.DHTAUTO
    location: str
    pin: int

    # Using Pin 11 (GPIO 17) would be set to a value of 17
    def __init__(self, pi: Pi, pin: int, location: str, sensor_model_no: int = DHT.DHTAUTO):
        if not pi.connected:
            raise Exception('GPIO on Pi not connected')
        self.location = location
        self.sensor = Sensor(pi, pin, model=sensor_model_no)
        self.pin = pin

    async def get_reading(self) -> Reading:
        tries = 10   # try 10 times if error
        while tries:
            try:
                # timestamp, GPIO, temperature, humidity
                _, _, status, temperature, humidity = self.sensor.read()  # read DHT device
                if(status == DHT.DHT_TIMEOUT):  # no response from sensor
                    break
                if(status == DHT.DHT_GOOD):
                    return Reading(temperature, humidity, self.location, self.pin)
                await asyncio.sleep(1)
                tries -= 1
            except KeyboardInterrupt:
                break
        return


class MockSensorMonitor(SensorMonitor):
    _last_updated: datetime
    _last_temp: int
    _last_humid: int

    # Using Pin 11 (GPIO 17) would be set to a value of 17
    def __init__(self, pi: Pi, pin: int, location: str, sensor_model_no: int = DHT.DHTAUTO):
        self.pin = pin
        self.location = location
        self._last_updated = datetime.now()
        self._last_temp = random.randint(55, 95)
        self._last_humid = random.randint(30, 90)

    async def get_reading(self) -> Reading:
        # timestamp, GPIO, temperature, humidity
        if datetime.now() - timedelta(hours=0, minutes=2) > self._last_updated:
            temperature = self._last_temp
            humidity = self._last_humid
        else:
            temperature = random.randint(55, 95)
            humidity = random.randint(30, 90)
            self._last_updated = datetime.now()

        await asyncio.sleep(random.randint(0, 5))

        self._last_temp = temperature
        self._last_humid = humidity

        return Reading(temperature, humidity, self.location, self.pin)


class MonitorService:
    pi: Pi
    sensors: list[SensorMonitor] = []

    def __init__(self, pi: Pi, sensors: list[SensorSettings]):
        self.pi = pi
        for sensor in sensors:
            self.sensors.append(
                SensorMonitor(
                    self.pi,
                    sensor.pin,
                    sensor.location,
                    sensor.sensor_model_no,
                )
            )

    async def get_data(self) -> list[Reading]:
        tasks = []

        for sensor in self.sensors:
            tasks.append(
                asyncio.create_task(
                    sensor.get_reading()
                )
            )

        return await asyncio.gather(*tasks)


class MockMonitorService(MonitorService):

    def __init__(self, pi: Pi, sensors: list[SensorSettings]):
        for sensor in sensors:
            self.sensors.append(
                MockSensorMonitor(
                    pi,
                    sensor.pin,
                    sensor.location,
                    sensor.sensor_model_no,
                )
            )


class MonitorServiceProvider:

    @staticmethod
    def get_monitor_service(emulation: bool, pi: Pi, sensors: list[SensorSettings]) -> MonitorService:
        if emulation:
            return MockMonitorService(None, sensors)
        else:
            return MonitorService(pi, sensors)
