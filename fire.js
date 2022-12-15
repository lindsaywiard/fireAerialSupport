// Make map
var map = L.map('map').setView([46.5, -109], 6.2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var linear = [5, 10, 15, 20];
var log = [0.33, 1, 3, 9];
var densScale = linear;
//Density
function getDensColor(d) {
    return d > densScale[3]  ? '#64469e' :
           d > densScale[2]  ? '#796db2' :
           d > densScale[1]   ? '#928ec3' :
           d > densScale[0]   ? '#aeadd3' : '#C9CAE3';
}
function densStyle(feature) {
    return {
        fillColor: getDensColor(feature.properties.B01001_calc_PopDensity),
        weight: 1,
        opacity: 1,
        color: "#f5f3f1",
        dashArray: '3',
        fillOpacity: 0.7
    };
}



//Interaction
var geojson;
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({weight: 5, color: '#f5f3f1', dashArray: '', fillOpacity: 0.9});
    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
geojson = L.geoJson(density, {style: densStyle, onEachFeature: onEachFeature})
            .addTo(map);

//Hover Info
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>MT County Population Density</h4>' +  (props ?
        '<b>' + props.NAME + '</b><br />' + props.B01001_calc_PopDensity.toFixed(2) + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};
info.addTo(map);

// Density Legend
var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, densScale[0], densScale[1], densScale[2], densScale[3]],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getDensColor(grades[i] + 0.1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);


//Fires
function getFireColor(d) {
    return d == true ? '#56B870' : 
                '#CF4648 ';
}
function fireStyle(feature) {
    return {
        fillColor: getFireColor(feature.properties.Air_Support),
        weight: 6,
        opacity: 0.9,
        color: getFireColor(feature.properties.Air_Support),
        dashArray: '3', 
        fillOpacity: 0.8
    };
}
L.geoJSON(firePerims, {style: fireStyle}).addTo(map);

// Fire Legend
var fireLegend = L.control({position: 'bottomleft'});
fireLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<h4>Fire Air Support</h4> ';    
        div.innerHTML += '<i style="background:' + getFireColor(true) + '"></i> ' +
            ' Received' + '<br>';
        div.innerHTML += '<i style="background:' + getFireColor(false) + '"></i> ' +
            ' Not Received' + '<br>';
    return div;
};
fireLegend.addTo(map);
