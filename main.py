from pathlib import Path

from flask import Flask, send_from_directory

from monitor import Reading

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')
cwd = Path.cwd()


@app.route('/js/<path:path>', methods=['GET'])
def send_js(path):
    return send_from_directory(cwd.joinpath('static', 'js'), path)

@app.route('/<path:path>', methods=['GET'])
def send_html(path):
    if path == '':
        path = 'index.html'
    return send_from_directory(cwd.joinpath('static'), path)

@app.route('/css/<path:path>', methods=['GET'])
def send_css(path):
    return send_from_directory(cwd.joinpath('static', 'css'), path)

@app.route('/reading', methods=['GET'])
def send_reading():
    return Response()

if __name__ == "__main__":
    app.run()