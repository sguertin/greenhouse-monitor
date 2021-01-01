import asyncio
from dataclasses import dataclass

from dataclasses_json import dataclass_json, LetterCase


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class PowerSwitchStatus:
    status: str


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class PowerService:
    heater_url: str
    humidifier_url: str

    async def get_humidifier_status(self) -> PowerSwitchStatus:
        raise NotImplementedError(
            "get_humidifier_status has not been implemented")

    async def toggle_humidifier(self) -> None:
        raise NotImplementedError("toggle_humidifier has not been implemented")

    async def get_heater_status(self) -> PowerSwitchStatus:
        raise NotImplementedError("get_heater_status has not been implemented")

    async def toggle_heater(self) -> None:
        raise NotImplementedError("toggle_heater has not been implemented")


class MockPowerService(PowerService):
    _heater_status: str = 'OFF'
    _humidifier_status: str = 'OFF'

    def __init__(self):
        super().__init__('', '')

    async def get_humidifier_status(self) -> PowerSwitchStatus:
        await asyncio.sleep(2)
        return PowerSwitchStatus(self._heater_status)

    async def toggle_humidifier(self) -> None:
        await asyncio.sleep(1)
        if self._heater_status == 'OFF':
            self._heater_status = 'ON'
        else:
            self._heater_status = 'OFF'

    async def get_heater_status(self) -> PowerSwitchStatus:
        await asyncio.sleep(2)
        return PowerSwitchStatus(self._heater_status)

    async def toggle_heater(self) -> None:
        await asyncio.sleep(1)
        if self._heater_status == 'OFF':
            self._heater_status = 'ON'
        else:
            self._heater_status = 'OFF'


class PowerServiceProvider:

    @staticmethod
    def get_power_service(debug: bool, heater_url: str = '', humidifier_url: str = '') -> PowerService:
        if debug:
            return MockPowerService()
        else:
            return PowerService(heater_url, humidifier_url)
