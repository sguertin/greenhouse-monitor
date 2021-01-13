import asyncio
import json
from pathlib import Path

import pigpio

import configuration
from json_encoder import default_json_encoder
from monitor import MonitorServiceProvider, ReadingResults
from power import PowerServiceProvider, PowerSwitchStatus
from fastapi import FastAPI, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
app = FastAPI()

temperature_status = 'OFF'
heater_status = 'OFF'

cwd = Path.cwd()
config = configuration.get_settings(cwd)

try:
    pi = pigpio.pi()
except:
    pi = None
    print('Failed to connect to raspberry pi, forcing hardware emulation')
    config.hardware_emulation = True


monitor_service = MonitorServiceProvider.get_monitor_service(
    config.hardware_emulation,
    pi,
    config.sensors,
)
power_service = PowerServiceProvider.get_power_service(
    config.hardware_emulation,
    config.heater_url,
    config.humidifier_url,
)

app.mount('/', StaticFiles(directory='static', html=True), name='static')

@app.get('/reading')
async def send_reading() -> ReadingResults:
    return await monitor_service.get_data()


@app.get('/heater')
async def heater_status() -> PowerSwitchStatus:
    return await power_service.get_heater_status()

@app.post('/heater')

async def toggle_heater():
    await power_service.toggle_heater()
    return Response(status=status.HTTP_200_OK)


@app.get('/humidifier')
async def humidifier_status() -> PowerSwitchStatus:
    return await power_service.get_humidifier_status()


@app.post('/humidifier')
async def set_humidifier_status():
    await power_service.toggle_humidifier()
    return Response(status=status.HTTP_200_OK)


app.run()
