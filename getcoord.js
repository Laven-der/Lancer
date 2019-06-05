
var mapObj, geocoderObj, contextMenuPositon, surveyPoint = 0, aroundSearchPoint = 0, contextMenu,
surveyMarker, placeMarkers = [], surveyorMarkers = [], cheshangPOIMarkers = [], networkPOIMarkers = [],
servicePOIMarkers = [], rescuePointMarkers = [], currentSurveyorIndex = 0, feedBackDict = {},
feedBackLog = "";
var windowsArr = [], surveyorWindows = [], cheshangPOIWindows = [], servicePOIWindows = [],
networkPOIWindows = [], rescuePointWindows = [];
var sessionid;
var setAsText = "设为目标点";
var mousemoveListener;
var bCityLimit = true;
//实例化DistrictSearch
var district, polygons = [], citycode;
//根据传递进来的行政区划查询位置，显示边界
//行政区划查询
var opts = {
subdistrict: 1,   //返回下一级行政区
extensions: 'all',  //返回行政区边界坐标组等具体信息
level: 'city'  //查询行政级别为 市
};
district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
var param = '{{param}}';
//替换html引号
param = param.replace(/&quot;/g, '"');
var ruler = 0;
// var context = JSON.parse(param);
var context = { "expand": "0" }
var that = this;

//初始化地图，加载

var position = new AMap.LngLat(116.397428, 39.90923);
mapObj = new AMap.Map("container", {
view: new AMap.View2D({//创建地图二维视口
    center: position,//创建中心点坐标
    zoom: 14, //设置地图缩放级别
    rotation: 0 //设置地图旋转角度
}),
lang: "zh_cn"//设置地图语言类型，默认：中文简体
});
//创建地图实例
mapObj.plugin(["AMap.PlaceSearch"]);
mapObj.plugin(["AMap.ToolBar"], function () {
//加载工具条
var tool = new AMap.ToolBar();
mapObj.addControl(tool);
});
mapObj.plugin(["AMap.Scale"], function () {
var scale = new AMap.Scale();
mapObj.addControl(scale);
});


mapObj.plugin(["AMap.RangingTool"], function () {
ruler = new AMap.RangingTool(mapObj);
AMap.event.addListener(ruler, "end", function (e) {
    ruler.turnOff();
    showPolygons();
    AMap.event.removeListener(mousemoveListener);

});
document.getElementById("rangingTool").onclick = function () {
    ruler.turnOn();
    hidePolygons();
    mousemoveListener = AMap.event.addListener(mapObj, "mousemove", function (e) {
        var size = mapObj.getSize();
        if ((size.height - e.pixel.y) < 20) {
            mapObj.panBy(0, -20);
        }
        else if ((size.width - e.pixel.x) < 20) {
            mapObj.panBy(-20, 0);
        }
        else if (e.pixel.x < 20) {
            mapObj.panBy(20, 0);
        }
        else if (e.pixel.y < 20) {
            mapObj.panBy(0, 20);
        }
    });
};
});
/*******************添加右键菜单********************************/
//创建右键菜单

contextMenu = new AMap.ContextMenu();

contextMenu.addItem(setAsText, setAsSurveyPoint, 0);
//地图绑定鼠标右击事件——弹出右键菜单
mapObj.on('rightclick', rightClick);

/****************地理逆编码***************/
//加载地理编码插件
//AMap.service(["AMap.Geocoder"], function () {
geocoderObj = new AMap.Geocoder({
    extensions: "all"
});
//initScope(context);
//});

//原生js上树
function append(parent, text) {
if (typeof text === 'string') {
    var temp = document.createElement('div');
    temp.innerHTML = text;
    // 防止元素太多 进行提速
    var frag = document.createDocumentFragment();
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    parent.appendChild(frag);
}
else {
    parent.appendChild(text);
}
document.getElementById("searchInputCtl").onkeyup = keydown;
}

//设置点
function setAsSurveyPoint(lng, lat, address) {

if (lng != undefined) {
    surveyPoint = new AMap.LngLat(lng, lat);
}
else {
    surveyPoint = contextMenuPositon;
}
if (surveyMarker) {
    surveyMarker.setMap(null);
}
if (!geocoderObj) {
   // AMap.service(["AMap.Geocoder"], function () {
        geocoderObj = new AMap.Geocoder({
            extensions: "all"
        });
        //initScope(context);
  //  });
}
//逆地理编码
geocoderObj.getAddress(surveyPoint, function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
        geocoder_CallBack(result);
        if (address != undefined && address != "") {
            context["address"] = address;
            updateUserInfoTab(context);
        }
    }
});
contextMenu.close();
// dispatchPanel.expand();

}

function rightClick(e) {
if (mapObj.getZoom() < 15) {
    mapObj.setZoomAndCenter(15, e.lnglat)
    return;
}
contextMenu.open(mapObj, e.lnglat);
contextMenuPositon = e.lnglat;
}

function geocoder_CallBack(data) {
//返回地址描述
//clientAddressBox.setValue(data.regeocode.formattedAddress);
var address = data.regeocode.formattedAddress;
var province = data.regeocode.addressComponent.province;
var city = data.regeocode.addressComponent.city;
var street = data.regeocode.addressComponent.street;

var nameGs = data.regeocode.addressComponent.township;
if (data.regeocode.roads.length > 0) {
    var direction = data.regeocode.roads[0].direction;
    if (address.indexOf('高速') > -1 && address.indexOf('G') > -1) {
        var nameGs = data.regeocode.roads[0].name
    }
} else {
    var direction = "无";
}

if (!city) {
    city = province;
}
var district = data.regeocode.addressComponent.district;

address = ltrim(address, province);
address = ltrim(address, city);
address = ltrim(address, district);
//定义要显示的数据
context["address"] = address;
context["coord"] = surveyPoint;
context["province"] = province;
context["city"] = city;
context["district"] = district;
context["street"] = street;
context["direction"] = direction;
context["nameGs"] = nameGs;
updateUserInfoTab(context);

//设置当前设置点的样式
surveyMarker = new AMap.Marker({
    map: mapObj,
    position: surveyPoint, //基点位置
    icon: "/pin-run-red.png"
});
// queryDispatchCallback(true);
mapObj.setFitView();//地图自适应
}

var flag = false;

function ltrim(source, rep) { //删除左边字符
if (source.indexOf(rep) == 0) {
    return source.substr(rep.length);
}
return source;
}

function updateUserInfoTab(param) {
var coord = "";
var address = "";
if (param.coord != undefined) {
    //设置经纬度精度必须为六位
    coord = param.coord;
    coord.lng = (coord.lng - 0).toFixed(6)
    coord.lat = (coord.lat - 0).toFixed(6)
}
if (param.address != undefined) {
    address = param.address;
}
//回填数据
feedBackDict["coord"] = param.coord;
//高速
if (address.indexOf('高速') > -1 && address.indexOf('G') > -1) {
    var arr = [param.province, param.city, param.nameGs, param.direction, param.address]
    var Address = arr.join("-")
    feedBackDict["address"] = Address;
    feedBackDict["city"] = param.city;
    feedBackDict["province"] = param.province;
    feedBackDict["nameGs"] = param.nameGs;
    feedBackDict["street"] = "";
    feedBackDict["district"] = param.district;
    feedBackDict["direction"] = param.direction;
    feedBackDict["sessionid"] = param.sessionid;
    //显示数据
    var contentDict = {};
    contentDict["坐标"] = coord;
    contentDict["地址"] = param.address;
    contentDict["省级"] = param.province;
    contentDict["城市"] = param.city;
    contentDict["高速"] = param.nameGs;
    contentDict["通行方向"] = param.direction;
    // contentDict["事务号"] = param.sessionid;
} else {
    //城市道路
    var arr = [param.province, param.city, param.district, param.street ? param.street : param.nameGs, param.address]
    var Address = arr.join("-")
    feedBackDict["address"] = Address;
    feedBackDict["city"] = param.city;
    feedBackDict["province"] = param.province;
    feedBackDict["district"] = param.district;
    feedBackDict["direction"] = "";
    feedBackDict["nameGs"] = "";
    feedBackDict["street"] = param.street ? param.street : param.nameGs;
    feedBackDict["sessionid"] = param.sessionid;
    //显示数据
    var contentDict = {};
    contentDict["坐标"] = coord;
    contentDict["地址"] = param.address;
    contentDict["省级"] = param.province;
    contentDict["城市"] = param.city;
    contentDict["区县"] = param.district;
    contentDict["道路"] = param.street ? param.street : param.nameGs;
    // contentDict["事务号"] = param.sessionid;
}
openInfo(contentDict);



}
$('#confirmBtn').click(function () {
    var id = getQueryString('id');
    var url = getQueryString('url');
     jQuery.support.cors=true;
    $.ajax({
      type: "POST",
      url: "http://api.apiopen.top/searchPoetry",
      data: {
        id: id,
        name: feedBackDict["address"],
        lat: feedBackDict["coord"]["lat"],
        lng: feedBackDict["coord"]["lng"]
      },
      dataType: "json",
      cache: false,
      success: function(data) {
       alert("回填测试成功")
        if (data) {
          console.log(data, "ok");
          // window.opener = null;
          // window.open('', '_self');
          // window.close();
        } else {
          alertAuto("回填失败");
        }
      }
    });
})


//获取id
function getQueryString(name) {
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
var r = window.location.search.substr(1).match(reg);
if (r != null) return unescape(r[2]);
return null;
}


//构建信息窗体中显示的内容
function openInfo(contentDict) {
    
    var $tableTr = $(".table-hover tr")
    var i = 0;
    for (var k in contentDict) {
        if(i<1){
            $tableTr
            .eq(i)
            .children("td:first-child")
            .text(k).siblings("td").text(contentDict[k].lng+","+contentDict[k].lat);
        }else{
            $tableTr
            .eq(i)
            .children("td:first-child")
            .text(k).siblings("td").text(contentDict[k].slice(0,11));
        }
     
        i++;
    }
    $("#showTable").css({ "display": "block" });
}



//infowindow显示内容
function parseStr(p) {
if (!p || p == "undefined" || p == " undefined" || p == "tel") {
    p = "暂无";
}
return p;
}


$(".mounseup").click(function () {
var i = $(this).attr("dataid") - 0;
windowsArr[i].open(mapObj, placeMarkers[i].getPosition());
})



function getPlaceSearchHtmlWithButton(poiArr) {
var html = "<table class='table table-hover' style='margin-left: 15px;'>";
for (var j = 0; j < poiArr.length; j++) {
    var contentDict = {};
    contentDict["地址"] = poiArr[j].address;
    contentDict["电话"] = poiArr[j].tel;
    contentDict["类型"] = poiArr[j].type;
    var title = (j + 1) + "." + poiArr[j].name;
    html += "<tr dataid='" + j + "' class='mounseup'><td>";
    html += createTabContent(title, contentDict);
    if (poiArr[j].type.indexOf("公交") != -1) {
        html += "<button class='btn btn-default mbd' type='button' style='background:RGB(56,146,211);color:white' dataid='" + j + "'>" + setAsText + "</button></td></tr>";
    }
    else if (poiArr[j].type.indexOf("省级地名") != -1 ||
        poiArr[j].type.indexOf("区县级地名") != -1 ||
        poiArr[j].type.indexOf("地市级地名") != -1 ||
        poiArr[j].type.indexOf("乡镇级地名") != -1) {
        html += "</td></tr>";
    } else {
        html += "<button class='btn btn-default mbd2' type='button' style='background:RGB(56,146,211);color:white' dataid='" + j + "'>" + setAsText + "</button></td></tr>";
    }

}
html += "</table>";
return html;
}

var userinfoTab;

function createTabContent(title, paramDic) {
var html = "<h4><font color=\"#00a6ac\">" + title + "</font></h4>";
for (var rec in paramDic) {
    var recValue = "";
    if (paramDic[rec] != undefined) {
        recValue = paramDic[rec];
    }
    html = html + "<p><font color=\"#00a6ac\">" + rec + ":</font>" + recValue + "</p>";
}

return html;
}



function clearKeywordSearchResult() {
document.getElementById("keywordSearchResult").style.visibility = "hidden";
windowsArr = [];
clearPlaceMarkers();

}

function clearPlaceMarkers() {
for (var i = 0; i < placeMarkers.length; i++) {
    placeMarkers[i].setMap(null);
}
placeMarkers = [];
}

function drawDistrict(result) {
for (var j = 0; j < result.districtList.length; j++) {
    if (citycode != undefined && result.districtList[j].citycode != citycode) {
        continue;
    }
    for (var i = 0; i < result.districtList[j].boundaries.length; i++) {
        //生成行政区划polygon
        var polygon = new AMap.Polygon({
            map: mapObj,
            strokeWeight: 1,
            strokeColor: '#FF0000',
            fillColor: '#CCF3FF',
            fillOpacity: 0.3,
            path: result.districtList[j].boundaries[i]
        });
        polygon.on('rightclick', rightClick);
        polygons.push(polygon);
    }

}
mapObj.setFitView();//地图自适应
}

//从输入提示框中选择关键字并查询
function selectResult(index) {
if (index < 0) {
    return;
}
if (navigator.userAgent.indexOf("MSIE") > 0) {
    document.getElementById("searchInputCtl").onpropertychange = null;
}

//截取输入提示的关键字部分
var text = document.getElementById("divid" + (index + 1)).innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g, "");

var cityCode = document.getElementById("divid" + (index + 1)).getAttribute('data');
document.getElementById("searchInputCtl").value = text;
document.getElementById("result1").style.display = "none";
//根据选择的输入提示关键字查询
mapObj.plugin(["AMap.PlaceSearch"], function () {
    var msearch = new AMap.PlaceSearch({
        pageSize: 10,
        citylimit: bCityLimit,
        pageIndex: 1
        //map: mapObj,
        //panel: "keywordSearchResult"
    });  //构造地点查询类
    AMap.event.addListener(msearch, "complete", keywordSearch_CallBack); //查询成功时的回调函数
    msearch.setCity(cityCode);
    msearch.search(text);  //关键字查询查询
});
}

function autocomplete_CallBack(result) {
var tipArr = result.tips;
var resultStr = "";
if (tipArr && tipArr.length > 0) {
    for (var i = 0; i < result.tips.length; i++) {
        resultStr += "<div class='marker' id='divid" + (i + 1) + "' dataid='" + i + "' style=\"font-size: 13px;cursor:pointer;padding:5px 5px 5px 5px;\"" + "data=" + tipArr[i].adcode + ">" + tipArr[i].name + "<span style='color:#C1C1C1;'>" + tipArr[i].district + "</span></div>";
    }
}
else {
    resultStr = " π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字";
}
document.getElementById("result1").curSelect = -1;
document.getElementById("result1").tipArr = tipArr;
document.getElementById("result1").innerHTML = resultStr;
document.getElementById("result1").style.display = "block";
$(".marker").mouseover(function () {
    $(this).css('background', '#CAE1FF')
}).mouseout(function () {
    $(this).css('background', '')
}).click(function () {
    var index = $(this).attr('dataid') - 0;
    selectResult(index)
})
}

function searchEnter() {
var keyword = document.getElementById("searchInputCtl").value;
if (!keyword) {
    return;
}
document.getElementById("result1").style.display = "none";
mapObj.plugin(["AMap.PlaceSearch"], function () {
    var msearch = new AMap.PlaceSearch({
        pageSize: 10,
        citylimit: bCityLimit,
        pageIndex: 1
        //map: mapObj,
        //panel: "keywordSearchResult"
    });  //构造地点查询类
    AMap.event.addListener(msearch, "complete", keywordSearch_CallBack); //查询成功时的回调函数
    msearch.setCity(citycode);
    msearch.search(keyword);  //关键字查询查询
});
}

function keywordSearch_CallBack(data) {
//清空地图上的InfoWindow和Marker
//clearPolygons();
clearPlaceMarkers();
clearSurveyorMarkers();
clearCheShangPOIMarkers();
clearServicePOIMarkers();
clearNetworkPOIMarkers();
clearRescuePointMarkers();
document.getElementById("keywordSearchResult").style.visibility = "hidden";
var poiArr = data.poiList.pois;
var resultCount = poiArr.length;
for (var i = 0; i < resultCount; i++) {
    addmarker(i, poiArr[i], 'poi');

}
mapObj.setFitView();
document.getElementById("keywordSearchResult").style.visibility = "visible";
document.getElementById("keywordSearchResult").innerHTML = getPlaceSearchHtmlWithButton(poiArr);
$(".mbd").click(function () {
    var j = $(this).attr("dataid") - 0;
    console.log(j)
    console.log(poiArr[j].location.toString())
    setAsSurveyPoint(poiArr[j].location.lng, poiArr[j].location.lat, poiArr[j].name)
});
$(".mbd2").click(function () {
    var j = $(this).attr("dataid") - 0;
    console.log(j)
    console.log(poiArr[j].location)
    setAsSurveyPoint(poiArr[j].location.lng, poiArr[j].location.lat, poiArr[j].name + poiArr[j].address)
})
}

function clearSurveyorMarkers() {
surveyorWindows = [];
for (var i = 0; i < surveyorMarkers.length; i++) {
    surveyorMarkers[i].setMap(null);
}
surveyorMarkers = [];
}

function clearCheShangPOIMarkers() {
for (var i = 0; i < cheshangPOIMarkers.length; i++) {
    cheshangPOIMarkers[i].setMap(null);
}
cheshangPOIMarkers = [];
cheshangPOIWindows = [];
}

function clearServicePOIMarkers() {
for (var i = 0; i < servicePOIMarkers.length; i++) {
    servicePOIMarkers[i].setMap(null);
}
servicePOIMarkers = [];
servicePOIWindows = [];
}

function clearNetworkPOIMarkers() {
for (var i = 0; i < networkPOIMarkers.length; i++) {
    networkPOIMarkers[i].setMap(null);
}
networkPOIMarkers = [];
networkPOIWindows = [];
}

function clearRescuePointMarkers() {
for (var i = 0; i < rescuePointMarkers.length; i++) {
    rescuePointMarkers[i].setMap(null);
}
rescuePointMarkers = [];
rescuePointWindows = [];
}

//添加查询结果的marker&infowindow
function addmarker(i, d, type) {
var lngX = d.location.getLng();
var latY = d.location.getLat();
var markerOption;
if (type == 'poi') {
    markerOption = {
        map: mapObj,
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b" + (i + 1) + ".png",
        position: [lngX, latY]
    };
}
var placeMarker = new AMap.Marker(markerOption);
placeMarkers.push(placeMarker);
var content = "<h3><font color=\"#00a6ac\">  " + (i + 1) + ". " + d.name + "</font></h3>" + createContent(d.type, d.address, d.tel);
var marker = "marker" + i;
var marker2 = "markerer" + i;

var infoWindow = new AMap.InfoWindow({
    content: content,
    size: new AMap.Size(300, 0),
    autoMove: true,
    offset: new AMap.Pixel(0, -30),
    closeWhenClickMap: true
});
windowsArr.push(infoWindow);
var aa = function (e) {
    infoWindow.open(mapObj, placeMarker.getPosition());
};
placeMarker.on("mouseover", aa);



}

function createContent(type, address, tel) {  //窗体内容
type = parseStr(type);
address = parseStr(address);
tel = parseStr(tel);
var s = [];
s.push("地址：" + address);
s.push("电话：" + tel);
s.push("类型：" + type);
return s.join("<br>");
}

function searchChange(inputctl) {

/*var keyCode = e.getKey();
if (keyCode ===38 || keyCode===40 || keyCode===13){
return;
}*/
var keywords = inputctl.value;//newValue;//store.getValue();
var auto;
//加载输入提示插件
AMap.service(["AMap.Autocomplete"], function () {
    var autoOptions = {
        citylimit: bCityLimit,
        city: citycode //城市，默认全国
    };
    auto = new AMap.Autocomplete(autoOptions);
    //查询成功时返回查询结果

    if (keywords && keywords.length > 0) {
        auto.search(keywords, function (status, result) {
            autocomplete_CallBack(result);
        });
    }
    else {
        //document.getElementById("result1").style.display = "none";
    }
});
}

//搜索框键盘事件
function keydown(event) {
var key = (event || window.event).keyCode;
var result = document.getElementById("result1")
var cur = result.curSelect;
clearKeywordSearchResult();
if (key === 40) {//down
    if (cur + 1 < result.childNodes.length) {
        if (result.childNodes[cur]) {
            result.childNodes[cur].style.background = '';
        }
        result.curSelect = cur + 1;
        result.childNodes[cur + 1].style.background = '#CAE1FF';
        document.getElementById("searchInputCtl").value = result.tipArr[cur + 1].name;
    }
} else if (key === 38) {//up
    if (cur - 1 >= 0) {
        if (result.childNodes[cur]) {
            result.childNodes[cur].style.background = '';
        }
        result.curSelect = cur - 1;
        result.childNodes[cur - 1].style.background = '#CAE1FF';
        document.getElementById("searchInputCtl").value = result.tipArr[cur - 1].name;
    }
} else if (key === 13) {
    var res = document.getElementById("result1");
    if (res) {
        if (res['curSelect'] !== -1) {
            selectResult(document.getElementById("result1").curSelect);
        }
        else {
            searchEnter();
            document.getElementById("result1").style.display = "none";
        }
    }
} else {

    searchChange(document.getElementById("searchInputCtl"));
}
}

//设置样式
function alertAuto(content) {
var title = "警告:";
var time = 3000;
var alertAutoCtl = document.getElementById("alertAuto");
alertAutoCtl.innerHTML = "<strong>" + title + "</strong> " + content;
alertAutoCtl.style.visibility = "visible";
setTimeout("document.getElementById('alertAuto').style.visibility='hidden'", time);
}

var keywordSearchPanel = '<div id="searchdiv">\
        <div id="districtSelectDiv" class="input-group">\
        <span class="input-group-btn sel_mask">\
        <select id="provinceSelectCtl" class="form-control" style="width:100px">\
        <option>---</option><option>北京市</option> <option>天津市</option>\
        <option>河北省</option><option>山西省</option><option>内蒙古自治区</option><option>辽宁省</option><option>吉林省</option><option>黑龙江省</option><option>上海市</option><option>江苏省</option><option>浙江省</option><option>安徽省</option><option>福建省</option><option>江西省</option><option>山东省</option><option>河南省</option><option>湖北省</option><option>湖南省</option><option>广东省</option><option>广西壮族自治区</option><option>海南省</option><option>重庆市</option><option>四川省</option><option>贵州省</option><option>云南省</option><option>西藏自治区</option><option>陕西省</option> <option>甘肃省</option><option>青海省</option><option>宁夏回族自治区</option><option>新疆维吾尔自治区</option><option>香港特别行政区</option><option>澳门特别行政区</option>\
        </select>\
        </span>\
        <span class="input-group-btn sel_mask">\
        <select id="citySelectCtl" class="form-control" style="width:100px">\
        </select>\
        </span>\
        <span class="input-group-btn sel_mask">\
        <select id="districtSelectCtl" class="form-control" style="width:100px">\
        </select>\
        </span>\
        </div>\
        <div id="districtInputDiv" class="input-group" style="width:330px">\
        <input id = "searchInputCtl" type="text" class="form-control" placeholder="输入地址"> </input>\
        <span class="input-group-btn">\
        <button id="go" class="btn btn-default" type="button" style="background:#1ba0ef;color:white">搜索</button></span></div>\
<div id="result1" style="z-index:9999"></div>\
 <div id="keywordSearchResult"></div>\
        </div>';

append(document.getElementById("container"), keywordSearchPanel);


$('#provinceSelectCtl').change(function () {
var keyword = $(this).find("option:selected").text(); //关键字
if (keyword == "---") {
    // document.getElementById("Province").src = "./images/arrow_up.png";
    return;
}
clearKeywordSearchResult();
mapObj.clearMap();
// document.getElementById("Province").src = "./images/arrow_down.png";
district.setLevel('province'); //行政区级别
district.setSubdistrict(1);
//行政区查询
district.search(keyword, function (status, result_province) {
    if (status != 'complete') {
        alertAuto(status + keyword);
    }
    else {
        document.getElementById("citySelectCtl").innerHTML = "";
        var cityOptions = document.getElementById("citySelectCtl").options;

        cityOptions.add(new Option("---"));
        if (keyword == '北京市' || keyword == '重庆市' || keyword == '天津市' || keyword == '上海市') {
            cityOptions.add(new Option(keyword));
        }
        else {
            for (var i = 0, l = result_province.districtList[0].districtList.length; i < l; i++) {
                var name = result_province.districtList[0].districtList[i].name;
                var value = result_province.districtList[0].districtList[i].adcode;
                cityOptions.add(new Option(name, value));
            }
        }
        //drawDistrict(result_province);
        mapObj.setCenter(result_province.districtList[0].center);

    }
})
});
$('#citySelectCtl').change(function () {
var keyword = $(this).find("option:selected").text(); //关键字
var adcode = $(this).val();
if (keyword == "---") {
    // document.getElementById("City").src = "./images/arrow_up.png";
    return;
}

clearKeywordSearchResult();
mapObj.clearMap();
// document.getElementById("City").src = "./images/arrow_down.png";
district.setLevel('city'); //行政区级别
var keywords = [];
keywords[0] = keyword;
if (keyword == '北京市' || keyword == '重庆市' || keyword == '天津市' || keyword == '上海市') {
    district.setSubdistrict(2);
    keywords[0] = keyword.replace('市', '') + '城区';
    keywords[1] = keyword.replace('市', '') + '郊县';
}
else {
    district.setSubdistrict(1);
}

var districtOptions = document.getElementById("districtSelectCtl").options;
// for(var i = 0 ; i<keywords.length ; i ++){
//行政区查询
district.search(adcode, function (status, result_city) {
    if (status != 'complete') {
        alertAuto(status + keyword);
    }
    else {
        document.getElementById("districtSelectCtl").innerHTML = "";
        var count = 0;
        districtOptions.add(new Option("---"));
        if (result_city.districtList[0].districtList != undefined) {
            if (keyword == '北京市' || keyword == '重庆市' || keyword == '天津市' || keyword == '上海市') {
                for (var j = 0; j < result_city.districtList[0].districtList.length; j++) {
                    for (var i = 0, l = result_city.districtList[0].districtList[j].districtList.length; i < l; i++) {
                        var name = result_city.districtList[0].districtList[j].districtList[i].name;
                        districtOptions.add(new Option(name));
                        count++;
                    }
                }

            }
            else if (keyword != "中山市" && keyword != "东莞市") {
                for (var i = 0, l = result_city.districtList[0].districtList.length; i < l; i++) {
                    var name = result_city.districtList[0].districtList[i].name;
                    var value = result_city.districtList[0].districtList[i].adcode;
                    districtOptions.add(new Option(name, value));
                }
            }
        }

        citycode = result_city.districtList[0].citycode;
        drawDistrict(result_city);
        //mapObj.setCenter(result_city.districtList[0].center);
    }
})
});
$('#districtSelectCtl').change(function () {
var keyword = $(this).find("option:selected").text(); //关键字
var adcode = $(this).val();

if (keyword == "---") {
    // document.getElementById("District").src = "./images/arrow_up.png";
    return;
}
clearKeywordSearchResult();
mapObj.clearMap();
// document.getElementById("District").src = "./images/arrow_down.png";
district.setLevel('district'); //行政区级别
district.setSubdistrict(0);
//行政区查询
district.search(adcode, function (status, result_district) {
    if (status != 'complete') {
        alertAuto(status + keyword);
    }
    else {
        for (var i = 0; i < result_district.districtList.length; i++) {
            if (citycode == result_district.districtList[i].citycode) {
                drawDistrict(result_district);
                if (result_district.districtList[0].boundaries == undefined || result_district.districtList[0].boundaries.length == 0) {
                    mapObj.setCenter(result_district.districtList[0].center);
                }
                //mapObj.setCenter(result_district.districtList[i].center);
                break;
            }

        }

    }
})
});