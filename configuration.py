

from dataclasses import dataclass
import json
from pathlib import Path
from typing import List

from dataclasses_json import dataclass_json, LetterCase


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class SensorSettings:
    location: str
    pin: int
    sensor_model_no: int


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Configuration:
    sensors: List[SensorSettings]


def get_settings(self):
    with open(Path.cwd().joinpath('configuration.json'), 'r') as f:
        return Configuration.from_json(f.read())
