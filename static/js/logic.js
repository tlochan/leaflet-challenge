// url link to USGS website for last 7days - earthquakes 4.5+
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// D3 data pull
d3.json(link).then(function(data){
    for(i=0;i<data.features.length;i++){
        let point = data.features[i].geometry.coordinates;
        let magnitude = data.features[i].properties.mag;
        let name = data.features[i].properties.place;
        let depth = point[2];

        //circle markers for each point
        L.circle([point[1],point[0]],{
        radius:magnitude * 50000,//radius dependent on magnitude
        draggable:false,
        color:'brown',
        fillColor:markerColor(depth), //fill color dendent on EQ depth
        fillOpacity: .75,
        title: data.features[i].properties.place}) //popup title from json
        .bindPopup(`<h2>Event: ${name}</h2>
        <hr>
        <h3> magnitude:  ${magnitude} </h3>
        <hr>
        <h3> depth: ${depth}</h3>`)
        .addTo(myMap);
        
        }

});

//function for determining color of markers based on EQ depth
function markerColor(depth){
    if (depth > 90) {return 'darkgreen';} 
    else if (depth > 70) {return 'green';} 
    else if (depth > 50) {return 'lightgreen';} 
    else if (depth > 30) {return 'yellowgreen';} 
    else if (depth > 10) {return 'yellow';} 
    else {return 'lightyellow';}
};

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//base maps layer group
let baseMaps = {
    Street: street,
    Topography: topo
};

//create map with layers initalized
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers:[topo]
  });
  
  //layer control
  L.control.layers(baseMaps).addTo(myMap);
  
  //legend for marker colors
  let legend = L.control({position:'bottomright'});
  legend.onAdd = function(myMap) {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 60, 90],
        labels = [],
        legendInfo = "<h5>Depths</h5>";

        for (let i = 0; i < depths.length; i++) {
            let color = markerColor(depths[i]); // Get color for current depth
            console.log("Depth:", depths[i], "Color:", color); // 
            div.innerHTML +=
                '<h6 style=background:red></h6> ' +
                depths[i] + (depths[i + 1] ? '->' + depths[i + 1] + " - " + color + '<br>' : '+');
        }    

        return div;
        
        };

// Add legend to map
legend.addTo(myMap);
    
