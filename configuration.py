from dataclasses import dataclass
from pathlib import Path

from dataclasses_json import dataclass_json, LetterCase


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass(frozen=True)
class SensorSettings:
    """
    A class to represent sensor settings

    Attributes
    ----------
    location : str
        the location of the sensor in the greenhouse

    pin : int
        the number of the pin to read data from

    sensor_model_no : int
        the model number of the sensor

    """

    location: str
    pin: int
    sensor_model_no: int


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass(frozen=True)
class Configuration:
    """
    A class to represent the application configuration

    Attributes
    ----------

    hardware_emulation : bool 
        Whether to emulate the raspberry pi and sensors or attempt to connect

    heater_url : str 
        The url of the endpoint to toggle power for the heater

    humidifier_url : str 
        The url of the endpoint to toggle power for the humidifier

    sensors : list[SensorSettings] 
        The configuration of each sensor

    Methods
    -------
    to_json() -> str: 
        Convert the configuration to a json string representation

    from_json(json_string) -> Configuration: 
        Returns an instance of Configuration from a json string representation

    """

    hardware_emulation: bool
    heater_url: str
    humidifier_url: str
    sensors: list[SensorSettings]


def get_settings(cwd: Path) -> Configuration:
    with open(cwd.joinpath('configuration.json'), 'r') as f:
        return Configuration.from_json(f.read())
