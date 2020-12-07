var myMap;
var directionsRenderer;
var directionsService = new google.maps.DirectionsService();
var myMarkers = [];

function reRender() {
if (myMarkers.length == 1) {
 return;
}
    
//HTMLから移動手段を取得
var myTravelMode =
 (document.getElementById('TravelMode').value == 'DRIVING')
 ? google.maps.DirectionsTravelMode.DRIVING :
 google.maps.DirectionsTravelMode.WALKING;
    
//ルートサービスを開始
directionsService.route({
 origin: myMarkers[0].getPosition(),  //ルート計算の開始位置
 destination: myMarkers[1].getPosition(),　//ルートの計算の終了位置
 travelMode: myTravelMode　//移動手段
}, function(result, status) {
 if (status == google.maps.DirectionsStatus.OK) {
 directionsRenderer.setDirections(result);　//DirectionsRendererオブジェクトを使用して結果をレンダリング
//移動距離の計算
 document.getElementById("journey").value =
  (result.routes[0].legs[0].distance.value >= 1000)
 ? (result.routes[0].legs[0].distance.value / 1000)
 + 'km' : result.routes[0].legs[0].distance.value + 'm';
 } else {
 alert('ルート検索できませんでした');
 }
})
    
//直線距離の計算
var d = Math.round
 (google.maps.geometry.spherical.computeDistanceBetween
 (myMarkers[0].getPosition(), myMarkers[1].getPosition()));
 document.getElementById("distance").value = (d >= 1000)
 ? (d / 1000) + 'km' : d + 'm';
}

function putMarker() {
var neoMarker = new google.maps.Marker({
 position: arguments[0],
 map: myMap,
 draggable: true
})

neoMarker.setMap(myMap);
google.maps.event.addListener(neoMarker,'dragend',
function(mouseEvent) {
 reRender();
})
myMarkers.push(neoMarker);

if (myMarkers.length == 1) {
 return;
} else if (myMarkers.length == 3) {
 myMarkers.shift().setMap(null);
}
reRender();
}

$(document).ready(function() {
var param = new Array();
var a = window.location.search.substring(1);
var b = a.split('&');
var mm = new Array();
    
for (var i in b) {
 var vals  = new Array(2);
 vals = b[i].split('=', 2);
 if (vals[0] == 'm'){
  if (vals[1].match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)) {
  mm.push(new google.maps.LatLng(RegExp.$1,RegExp.$2,true));
 }
}
    
param[vals[0]] = vals[1];
}
delete b;
delete a;

var opts = {
 zoom: (('z' in param) && (parseInt(param['z']) >= 0))
 ? parseInt(param['z']) : 11,
 center: (('c' in param) && 
 (param['c'].match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)))
 ? mapCenter = new google.maps.LatLng
 (RegExp.$1, RegExp.$2, true):
 new google.maps.LatLng(35.68,139.7),
 mapTypeId: google.maps.MapTypeId.ROADMAP,
 mapTypeControl: true,
 scaleControl: true,
 navigationControlOptions: true,
 disableDoubleClickZoom: true,
 scrollwheel: false,
 zIndex: 0
 }

 myMap = new google.maps.Map
 (document.getElementById("map_canvas"),opts);
 for (var i in mm) {
  putMarker(mm[i]);
 }

 delete mm;
// クリックでマーカー設置
google.maps.event.addListener(myMap, 'click',
function(mouseEvent) {
	putMarker(mouseEvent.latLng)
})

directionsRenderer = new google.maps.DirectionsRenderer	({
map: myMap, suppressMarkers: true });
document.getElementById("journey").disabled = true;
document.getElementById("distance").disabled = true;
})

document.getElementById('search').addEventListener('click', function() {

          var place = document.getElementById('keyword').value;
          var geocoder = new google.maps.Geocoder();      // geocoderのコンストラクタ

          geocoder.geocode({
            address: place
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

              var bounds = new google.maps.LatLngBounds();

              for (var i in results) {
                if (results[0].geometry) {
                  // 緯度経度を取得
                  var latlng = results[0].geometry.location;
                  // 住所を取得
                  var address = results[0].formatted_address;
                  // 検索結果地が含まれるように範囲を拡大
                  bounds.extend(latlng);
                  // マーカーのセット
                  setMarker(latlng);
                  // マーカーへの吹き出しの追加
                  setInfoW(place, latlng, address);
                  // マーカーにクリックイベントを追加
                  markerEvent();
                }
              }
            } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
              alert("見つかりません");
            } else {
              console.log(status);
              alert("エラー発生");
            }
          });

        });

        // 結果クリアーボタン押下時
        document.getElementById('clear').addEventListener('click', function() {
          deleteMakers();
        });

      