# coding=utf-8
from flask import Flask
from api.v1.pcaip.controller import pcaroutemanager

app = Flask(__name__)
app.register_blueprint(pcaroutemanager)

if __name__ == "__main__":
    app.debug = False
    app.run()
