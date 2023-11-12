//Read data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(url).then(function(earthquake)
{
createMarker(earthquake.features)
});

// Create a map object.
let myMap = L.map("map", {
  center: [29.7604, -95.3698],
  zoom: 5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Define a createMarker() function 
function createMarker(earthquakeFeatures) {
  console.log(earthquakeFeatures);

for (i=0;i<earthquakeFeatures.length;i++){

  let location = earthquakeFeatures[i].geometry.coordinates;
  let magnitude = earthquakeFeatures[i].properties.mag * 5000;
  L.circle([location[1],location[0]], {
    fillOpacity: 0.75,
    color: markerColor(location[2]),
    fillColor: markerColor(location[2]),
    // Setting our circle's radius to equal the output of our markerSize() function:
    // This will make our marker's size proportionate to its population.
    radius: magnitude
  }).bindPopup(`<h1>Magnitude = ${earthquakeFeatures[i].properties.mag}</h1> <hr> <h3>Place = ${earthquakeFeatures[i].properties.place} </h3>`).addTo(myMap);
};
}
// Define a markerSize() function that will give each earthquake size and depth
function markerColor(depth) {
  if (depth < 10) return "#04FC14";
  else if (depth < 30) return "#B7FC04";
  else if (depth < 50) return "#EEFC04";
  else if (depth < 70) return "#FCB304";
  else if (depth < 90) return "#FC8504";
  else return "#FC0904"
};

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let categories = ['-10','10','30','50','70','90'];
    let colors =["#04FC14","#B7FC04","#EEFC04","#FCB304","#FC8504","#FC0904"]
    let labels = [];

    // Add the minimum and maximum.
    let legendInfo = "<h1>Depth</h1>"

    div.innerHTML = legendInfo;

    categories.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"+ categories[index] + (categories[index + 1] ? '&ndash;' + categories[index + 1] + '<br>' : '+'));
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);