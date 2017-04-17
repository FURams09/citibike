var map;
var hasMarkers = false;
function buildMapForStation(lng, lat, stations) {
    if (!map) {
        map = new google.maps.Map(document.getElementById('stationMap'),
            {
                zoom: 15,
                center: { lng: lng, lat: lat }
            });
        hasMarkers = false;
        
    } else {
        map.setCenter({
            lng: lng, lat: lat
        })
    };
    if (stations && !hasMarkers) {
        stations.forEach(function (station) {
            var marker = new google.maps.Marker({
                position: { lat: Number(station.gps[1]), lng: Number(station.gps[0]) },
                title: station.name,
                label: station.bikes.toString(),
                map: map
            });
            marker.addListener('click', function () {
                map.setCenter({ lat: station.gps[1], lng: station.gps[0] });

            });
            hasMarkers = true;
            //marker.addListener('mouseover', function () { setScreen($option.val()); $('#station').selectmenu('refresh'); $('#meter').progressbar({ value: getStationFullPct($option.data().bikes, $option.data().racks) }); })


        });
    }
    
}

function getStationFullPct(bikes, racks) {
    return Math.floor((bikes / (bikes + racks)) * 100)
}


