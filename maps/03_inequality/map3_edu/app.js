window.onload = function() {
  var attributeStyleInfo = {
    "eduindex_10":{
      colorRamp: ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'],
      rangeText: ['<3','3-4','4-5','5-6','>=6']
    }
  }
  var starterChip = attributeStyleInfo.eduindex_10.colorRamp;
  var starterLabel = attributeStyleInfo.eduindex_10.rangeText;
  for (var i = 0; i < 5; i++){
    $('#legend-attribute-chip-' + (i+1).toString()).css('background-color', starterChip[i]);
    $('#legend-attribute-label-' + (i+1).toString()).html(starterLabel[i]);
  }

  var usCounties = 'adhp_counties_10';

  var layerSource = {
    user_name: 'true-cost-collaboratory',
    type: 'cartodb',
    sublayers: [{
      sql: "SELECT * FROM " + usCounties,
      cartocss: $('#eduindex_10').text(),
      interactivity: "cartodb_id, the_geom, county, state, eduindex_10"
    }]
  }

  var countyCoal = 'https://true-cost-collaboratory.cartodb.com/api/v2/viz/4e201a90-05db-11e6-823a-0e3ff518bd15/viz.json'

var sublayer;

var map = new L.Map('map', {
  center: [39.828328, -98.579416],
  zoom: 4,
  maxZoom:9,
  minZoom:3,
  zoomControl: false
});

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
map.attributionControl.addAttribution('<a href="http://www.measureofamerica.org/" target="_blank">Measure of America</a>');

// Add a basemap to the map object just created
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
}).addTo(map);

cartodb.createLayer(map, layerSource)
  .addTo(map, 0)
  .done(function(layer){
      sublayer = layer.getSubLayer(0);
      cartodb.vis.Vis.addInfowindow(
        map,
        sublayer,
        ['county','state','eduindex_10'], 
        {
          infowindowTemplate: $('#infowindow_template').html(),
          templateType: 'mustache'
        });

      layer.leafletMap.viz.addOverlay({
        type:'tooltip',
        layer: sublayer,
        template: '<div class="cartodb-tooltip-content-wrapper">{{county}} County, {{state}}</div>',
        postition: 'bottom|right',
        fields: [{county: 'county'}]
      });

      cartodb.createLayer(map, countyCoal)
        .addTo(map, 1)
        .done(function(layer){
          console.log('added countyCoal', countyCoal);
        })
        .error(function () {
          console.log('problem adding stateCoal')
        })
  })
  .error(function(err) {
    console.log("error: " + err);
  });
}



