from dataclasses import dataclass
from pathlib import Path
from typing import List

from dataclasses_json import dataclass_json, LetterCase


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass(frozen=True)
class SensorSettings:
    location: str
    pin: int
    sensor_model_no: int


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass(frozen=True)
class Configuration:
    hardware_emulation: bool
    sensors: List[SensorSettings]


def get_settings(cwd: Path) -> Configuration:
    with open(cwd.joinpath('configuration.json'), 'r') as f:
        return Configuration.from_json(f.read())
