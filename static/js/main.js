
var PcaWithOpear = React.createClass({
    getInitialState: function () {
        return {ip: ""};
    },
    changeip: function (event) {
        var newip = event.target.value;
        this.setState(function (state) {
            state.ip = newip;
            return state;
        })
    },
    addPca: function () {
        var pca = this.refs.mypca.state;
        var arr = [];
        (pca.province&&pca.province!="请选择省") ? arr.push(pca.province) : "";
        (pca.city&&pca.city!="请选择市") ? arr.push(pca.city) : "";
        (pca.area&&pca.area!="请选择区") ? arr.push(pca.area) : "";
        console.log(arr);
        console.log({_id: arr.join(","), ip: this.state.ip});
        this.props.addpcaip({_id: arr.join(","), ip: this.state.ip})
    },
    render: function () {
        return (<div>
            <Pca ref="mypca"/>
            <input type="text" onChange={this.changeip}></input>
            <input type="button" value="添加" onClick={this.addPca}></input>
        </div>);
    }
})

var Pca = React.createClass({
    getInitialState: function () {
        return {province: "请选择省", city: "请选择市", area: "请选择区"};
    },
    getSel: function (event) {
        var targetname = event.target.getAttribute("name");
         if (targetname == "province") {
            var province = getProvince(event.target.value);
            this.setState(function (state) {
                state.province = event.target.value;
                state.city = province.sub[0].name;
                state.area = province.sub[0].sub[0].name;
                return state;
            })
        }
        else if (targetname == "city") {
            var province = getProvince(this.state.province);
            var city = getCity(province, event.target.value);
            this.setState(function (state) {
                state.city = event.target.value;
                state.area = city.sub[0].name;
                return state;
            })
        }
        else if (targetname == "area") {
            this.setState(function (state) {
                state.area = event.target.value;
                return state;
            })
        }
    },
    render: function () {
        return (
            <span onChange={this.getSel}>
                <Province pname={this.state.province}/>
                <City pname={this.state.province} cname={this.state.city}/>
                <Area pname={this.state.province} cname={this.state.city} aname={this.state.area}/>
            </span>);
    }
});
var Province = React.createClass({
    render: function () {
        return (
            <select name="province" defaultValue={this.props.pname}>
            {
                allpca.map(function (pca) {
                    return <option key={pca.name} value={pca.name}>{pca.name}</option>;
                })
            }
            </select>
        );
    }
});

var City = React.createClass({
    render: function () {
        var province = getProvince(this.props.pname);
        return (
            <select name="city" defaultValue={this.props.cname}>
            {
                province.sub.map(function (city) {
                    return <option key={city.name} value={city.name}>{city.name}</option>;
                })}
            </select>
        );
    }
});

var Area = React.createClass({
    render: function () {
        var province = getProvince(this.props.pname);
        var city = getCity(province, this.props.cname);
        return (
            <select name="area" defaultValue={this.props.aname}>
            {
                city.sub.map(function (area) {
                    return <option key={area.name} value={area.name}>{area.name}</option>;
                })}
            </select>);
    }
});


var PcaShow = React.createClass({
    getInitialState: function () {
        return {searchkey: ""};
    },
    search: function () {
        this.props.search(this.state.searchkey)
    },
    change: function (event) {
        this.setState(function (state) {
            state.searchkey = event.target.value;
            return state;
        })
    },
    render: function () {
        return (
            <div>
                <SearchPcaIp change={this.change} search={this.search} value={this.state.searchkey}/>
                <PcaIpList remove={this.props.remove} update={this.props.update} pcaips={this.props.pcaips}/>
            </div>
        );
    }
});
var SearchPcaIp = React.createClass({
    render: function () {
        return (
            <div style={{margin: "10px"}}>
                <input type="text" value={this.props.searchkey} onChange={this.props.change}/>
                <input type="button" value="查询" onClick={this.props.search}/>
            </div>
        );
    }
});


var PcaIpList = React.createClass({
    render: function () {
        console.log("render list");
        console.log(this.props.pcaips);
        var self = this;
        return (
            <ul>{
                this.props.pcaips.map(function (pcaip) {
                    return <PcaIpItem key={pcaip["_id"]} remove={self.props.remove} update={self.props.update}
                                      pcastring={pcaip["_id"]} ip={pcaip.ip}/>
                })}
            </ul>);
    }
});

var PcaIpItem = React.createClass({
    getInitialState: function () {
        return {ip: this.props.ip};
    },
    change: function (event) {
        this.setState(function (state) {
            state.ip = event.target.value;
            return state;
        })
    },
    remove: function (event) {
        this.props.remove(this.props.pcastring);
    },
    update: function () {
        this.props.update(this.props.pcastring, this.state.ip, this.props.ip);
    },
    render: function () {
        return (
            <li>
                <lable>{this.props.pcastring}</lable>
                <input type="text" value={this.state.ip} onChange={this.change}/>
                <input type="button" value="删除" onClick={this.remove}/>
                <input type="button" value="更新" onClick={this.update}/>
            </li>);
    }
});


var Root = React.createClass({
    getInitialState: function () {
        return {pcaips: []};
    },
    componentWillMount: function () {
        var self = this;
        $.ajax(
            {
                type: "GET",
                url: "/api/v1/pcaip/",
                dataType: "json",
                success: function (data) {
                    self.setState(function (state) {
                        state.pcaips = data;
                        return state;
                    })
                }
            });
    },
    search: function (searchkey) {
        var self = this;
        $.ajax(
            {
                type: "GET",
                url: "/api/v1/pcaip/",
                dataType: "json",
                data: {searchkey: searchkey},
                success: function (data) {
                    self.setState(function (state) {
                        state.pcaips = data;
                        return state;
                    })
                }
            });

    },
    change: function (event) {
        console.log(event.target);
        var newip = event.target.value;
        this.setState(function (state) {
            state.ip = newip;
            return state;
        })
    },
    addpcaip: function (newpcaip) {
        var self = this;
        $.ajax(
            {
                type: "POST",
                url: "/api/v1/pcaip/",
                data: newpcaip,
                dataType: "json",
                success: function (data) {
                    self.setState(function (state) {
                        state.pcaips.push(newpcaip);
                        return state;
                    })
                }
            });

    },
    remove: function (pcaipid) {
        var self = this;
        $.ajax(
            {
                type: "DELETE",
                url: "/api/v1/pcaip/" + pcaipid,
                dataType: "json",
                success: function (data) {
                    alert((data.item == "success") ? "操作成功" : "操作失败");
                    self.setState(function (state) {
                        state.pcaips = state.pcaips.filter(function (pcaip) {
                            return pcaip._id != pcaipid;
                        })
                        return state;
                    })
                }
            });
    },
    update: function (id, ip, oldip) {
        var self = this;
        console.log("/api/v1/pcaip/" + id);
        $.ajax(
            {
                type: "PATCH",
                url: "/api/v1/pcaip/" + id,
                dataType: "json",
                data: {ip: ip},
                success: function (data) {
                    alert((data.item == "success") ? "操作成功" : "操作失败");
                    self.setState(function (state) {
                        for (var i = 0; i < state.pcaips.length; i++) {
                            if (state.pcaips[i]._id == id) {
                                state.pcaips[i].ip = ip;
                            }
                        }
                        return state;
                    })
                }
            });
    },
    render: function () {
        return (<div>
            <PcaWithOpear addpcaip={this.addpcaip}/>
            <PcaShow search={this.search} ref="mypcashow" remove={this.remove} update={this.update}
                     pcaips={this.state.pcaips}/></div>);
    }
});
function getProvince(name) {
    for (var i = 0; i < allpca.length; i++) {
        if (allpca[i].name == name) {
            return allpca[i];
        }
    }
};
function getCity(province, cityname) {
    for (var i = 0; i < province.sub.length; i++) {
        if (province.sub[i].name == cityname) {
            return province.sub[i];
        }
    }
};

ReactDOM.render(
    <Root/>,
    document.getElementById('message')
);