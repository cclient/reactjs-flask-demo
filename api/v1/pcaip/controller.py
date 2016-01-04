# coding=utf-8
import json
import re

from flask import Blueprint
from flask import request

from  api.v1.pcaip import dao
from api.v1 import tool

pcaroutemanager = Blueprint('pcaip', __name__, url_prefix="/api/v1/pcaip")


@pcaroutemanager.route('/', methods=['GET'])
def list():
    searchkey = request.args.get('searchkey', '')
    print(searchkey)
    query = {}
    if searchkey != "":
        query = {"_id": {"$regex": searchkey}}
    res = dao.list(query)
    jres = json.dumps(res)
    return jres


@pcaroutemanager.route('/<id>', methods=['PATCH'])
def update(id):
    print(id)
    ip = request.form['ip']
    if dao.update(id, {"ip": ip}) == True:
        return json.dumps({"item": "success"})
    else:
        return json.dumps({"error": "error"})


@pcaroutemanager.route('/<id>', methods=['DELETE'])
def delete(id):
    if dao.delete(id) == True:
        return json.dumps({"item": "success"})
    else:
        return json.dumps({"error": "error"})


@pcaroutemanager.route('/', methods=['POST'])
def insert():
    print("hhelp")
    id = request.form['_id']
    ip = request.form['ip']
    if dao.insert({"_id": id, "ip": ip}) >= 0:
        return json.dumps({"item": "success"})
    else:
        return json.dumps({"error": "error"})
