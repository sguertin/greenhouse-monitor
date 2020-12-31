import asyncio
import json

from pathlib import Path

import pigpio
from flask import Flask, send_from_directory, Response

import configuration
from json_encoder import default_json_encoder
from monitor import MonitorService, MockMonitorService


# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')
cwd = Path.cwd()

pi = pigpio.pi()
config = configuration.get_settings(cwd)

if config.hardware_emulation:
    monitor_service = MockMonitorService(pi, config)
else:
    monitor_service = MonitorService(pi, config)


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


app.run()
