# coding=utf-8
import requests

from flask import (Blueprint, request, make_response)

from api.v1.ap import tool

aptool = tool
from api.v1.pcaip import dao
from api.v1 import tool

aproutemanager = Blueprint('ap', __name__, url_prefix=u"/api/v1/ap")


@aproutemanager.route('/autoadd/<apmac>', methods=['GET'])
@tool.tojson
def autoadd(apmac):
    res = requests.get(u"http://data-api.xiaoyun.com/v1/router/by/mac/" + apmac)
    ap = res.json()
    shop = requests.get(u"http://data-api.xiaoyun.com/v1/shop/" + ap[u"item"][u"shopID"]).json()
    loc = shop[u"item"][u"location"]
    province = aptool.trimProvince(loc[u"province"])
    city = aptool.trimCity(loc[u"province"], loc[u"city"], loc[u"district"])
    area = aptool.trimArea(loc[u"province"], loc[u"city"], loc[u"district"])

    pcainfo = aptool.getMatchPcaString(province + "," + city + "," + area)
    if (pcainfo[0] != ""):
        ipinfo = getipinfobypca(pcainfo)
        if (ipinfo == None):
            # return json.dumps({"error": "ipinfo is null "})
            return {"error": "ipinfo is null "}
        else:
            addres = reqautoaddapihttps(ipinfo["ip"], apmac)
            if addres['code'] == "Failed" or addres['code'] == -1:
                msg = ""
                if ("message" in addres.keys()):
                    msg = addres["message"]
                else:
                    msg = addres["msg"]
                return {"error": msg}
                # resp = make_response(json.dumps({"error": msg}))
                # resp.headers['Content-Type'] = 'text/json; charset=utf-8'
                # return resp
            else:
                # return json.dumps({"item": "success"})
                return {"item": "success"}

    else:
        # return json.dumps({"error": u"场所区域匹配失败,原始为" + loc['province'] + "," + loc['city'] + u"," + loc[
        #     'district'] + u"\n 匹配结果为" + province + u"," + city + u"," + area})
        return {"error": u"场所区域匹配失败,原始为" + loc['province'] + "," + loc['city'] + u"," + loc[
            'district'] + u"\n 匹配结果为" + province + u"," + city + u"," + area}


def getipinfobypca(pcainfo):
    pcaarr = pcainfo[0].split(",")  # ip设置里有这一条.
    ipinfo = dao.findbyid(pcainfo[0])
    if (ipinfo == None and len(pcaarr) == 3):
        ipinfo = dao.findbyid(pcaarr[0] + "," + pcaarr[1])
    if (ipinfo == None and len(pcaarr) > 1):
        ipinfo = dao.findbyid(pcaarr[0])
    return ipinfo


def reqautoaddapihttp(ip, apmac):
    url = "http://" + ip + ":9900/api/v1/ap/autobymac?mac=" + apmac + "&accountid=55cc85ef18a9f163fac999f5"
    return requests.get(url).json()


def reqautoaddapihttps(ip, apmac):
    cookies = requests.post("https://" + ip + ":8987/signin", {"username": "email@goyoo.com", "password": "123456"},
                            verify=False).cookies
    return requests.post("https://" + ip + ":8987/device/add", {"mac": apmac}, verify=False, cookies=cookies).json()
