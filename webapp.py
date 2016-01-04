# coding=utf-8
from flask import Flask
from api.v1.pcaip.controller import pcaroutemanager
from api.v1.ap.controller import aproutemanager

app = Flask(__name__)
app.register_blueprint(pcaroutemanager)
app.register_blueprint(aproutemanager)

if __name__ == "__main__":
    app.debug = False
    app.run()