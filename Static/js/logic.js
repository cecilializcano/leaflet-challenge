//Read data
var path = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(path).then(function(data){
    createFeatures(data.features);
});

function qColor(qColor) {
    const colorRanges = [
        { min: 0, max: 10, color: "#DAF7A6" }, 
        { min: 10, max: 20, color: "#FFC300" }, 
        { min: 20, max: 30, color: "#FF5733" },   
        { min: 30, max: 40, color: "#C70039" }, 
        { min: 40, max: 50, color: "#900C3F" }, 
        { min: 50, max: 60, color: "#581845" } 
    ];

    for (const range of colorRanges) {
        if (range.min <= qColor && qColor <= range.max) {
            return range.color;
        }
    }

    return "#311432";
}
function pointMaker(features, latlng){
    var circleOptions = {
        radius: features.properties.mag * 8, 
        fillColor: qColor(features.geometry.coordinates[2]),
        color: qColor(features.geometry.coordinates[2]),
        opacity: 1, 
        fillOpacity: 0.5 
    }
    return L.circleMarker(latlng, circleOptions)
}

function createFeatures(earthquakeData){

    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>${new Date(feature.properties.time)}</p><hr>
        <p> mag:${feature.properties.mag}</p><hr>
        <p>depth:${feature.geometry.coordinates[2]}</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, 
        pointToLayer: pointMaker
    });

    createMap(earthquakes);
}

function createMap(earthquakes){
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
