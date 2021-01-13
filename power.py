import asyncio
from dataclasses import dataclass
import random

from dataclasses_json import dataclass_json, LetterCase
from pydantic import BaseModel

@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass(frozen=True)
class PowerSwitchStatus(BaseModel):
    status: str


class PowerService:
    heater_url: str
    humidifier_url: str

    def __init__(self, heater_url: str, humidifier_url: str):
        self.heater_url = heater_url
        self.humidifier_url = humidifier_url

    async def get_humidifier_status(self) -> PowerSwitchStatus:
        raise NotImplementedError(
            "get_humidifier_status has not been implemented")

    async def toggle_humidifier(self) -> PowerSwitchStatus:
        raise NotImplementedError("toggle_humidifier has not been implemented")

    async def get_heater_status(self) -> PowerSwitchStatus:
        raise NotImplementedError("get_heater_status has not been implemented")

    async def toggle_heater(self) -> PowerSwitchStatus:
        raise NotImplementedError("toggle_heater has not been implemented")


class MockPowerService(PowerService):
    _heater_status: str = 'OFF'
    _humidifier_status: str = 'OFF'

    def __init__(self):
        super().__init__('', '')

    async def get_heater_status(self) -> PowerSwitchStatus:
        await asyncio.sleep(random.randint(1, 3))
        return PowerSwitchStatus(self._heater_status)

    async def toggle_heater(self) -> PowerSwitchStatus:
        await asyncio.sleep(random.randint(1, 3))
        if self._heater_status == 'OFF':
            self._heater_status = 'ON'
        else:
            self._heater_status = 'OFF'

        return PowerSwitchStatus(self._heater_status)

    async def get_humidifier_status(self) -> PowerSwitchStatus:
        await asyncio.sleep(random.randint(1, 3))
        return PowerSwitchStatus(self._humidifier_status)

    async def toggle_humidifier(self) -> PowerSwitchStatus:
        await asyncio.sleep(random.randint(1, 3))
        if self._humidifier_status == 'OFF':
            self._humidifier_status = 'ON'
        else:
            self._humidifier_status = 'OFF'

        return PowerSwitchStatus(self._humidifier_status)


class PowerServiceProvider:

    @staticmethod
    def get_power_service(emulate_hardware: bool, heater_url: str = '', humidifier_url: str = '') -> PowerService:
        if emulate_hardware:
            return MockPowerService()
        else:
            return PowerService(heater_url, humidifier_url)
