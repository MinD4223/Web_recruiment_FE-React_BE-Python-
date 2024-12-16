from flask import Flask
from modules.register_route import register_route
from modules.login_route import login_route

app = Flask(__name__)
app.register_blueprint(register_route)
app.register_blueprint(login_route)

@app.route('/')
def index():
    return "This is UAA Service - Register Account Authentication"


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8024, debug=True)