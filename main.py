import asyncio
import json

from pathlib import Path

import pigpio
from flask import Flask, send_from_directory, Response, request

import configuration
from json_encoder import default_json_encoder
from monitor import MonitorServiceProvider
from power import PowerServiceProvider, PowerSwitchStatus

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')
app.temperature_status = 'OFF'
app.heater_status = 'OFF'

cwd = Path.cwd()

pi = pigpio.pi()
config = configuration.get_settings(cwd)

monitor_service = MonitorServiceProvider.get_monitor_service(
    config.hardware_emulation,
    pi,
    config,
)
power_service = PowerServiceProvider.get_power_service(
    config.hardware_emulation,
    config.heater_url,
    config.humidifier_url,
)


@app.route('/js/<path:path>', methods=['GET'])
def send_js(path):
    return send_from_directory(cwd.joinpath('static', 'js'), path, content_type='application/javascript')


@app.route('/<path:path>', methods=['GET'])
def send_html(path):
    if path == '':
        path = 'index.html'
    return send_from_directory(cwd.joinpath('static'), path, content_type='text/html')


@app.route('/css/<path:path>', methods=['GET'])
def send_css(path):
    return send_from_directory(cwd.joinpath('static', 'css'), path, content_type='text/css')


@app.route('/reading', methods=['GET'])
def send_reading():
    result = asyncio.get_event_loop().run_until_complete(
        _send_reading()
    )

    return result


async def _send_reading():
    results = []
    readings = await monitor_service.get_data()
    for reading in readings:
        results.append(reading.to_dict())
    return Response(
        json.dumps(results, default=default_json_encoder),
        content_type='application/json'
    )


@app.route('/humidifier', methods=['GET', 'POST'])
def humidifier_status():
    if request.method == 'POST':
        asyncio.get_event_loop().run_until_complete(
            power_service.toggle_heater()
        )
        return Response('OK', status=200)
    result = asyncio.get_event_loop().run_until_complete(
        power_service.get_humidifier_status()
    )
    return Response(result, status=200, content_type='application/json')


async def get_humidifier_status() -> PowerSwitchStatus:
    return await power_service.get_humidifier_status()


async def set_humidifier_status():
    await power_service.toggle_humidifier()


@app.route('/heater', methods=['GET', 'POST'])
def heater_status():
    if request.method == 'POST':
        asyncio.get_event_loop().run_until_complete(
            power_service.toggle_heater()
        )
        return Response('OK', status=200)
    result = asyncio.get_event_loop().run_until_complete(
        power_service.get_heater_status()
    )
    return Response(result, status=200, content_type='application/json')


async def get_heater_status() -> PowerSwitchStatus:
    return await power_service.get_heater_status()


async def set_heater_status():
    await power_service.toggle_humidifier()

app.run()
