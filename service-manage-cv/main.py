from flask import Flask
from modules.user_route import user_route
from modules.admin_route import admin_route
from modules.cv_route import cv_route

app = Flask(__name__)
app.register_blueprint(user_route)
app.register_blueprint(admin_route)
app.register_blueprint(cv_route)

@app.route('/')
def index():
    return "This is Manage Service"


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8022, debug=True)