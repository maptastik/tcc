window.onload = function() {
  var attributeStyleInfo = {
    "gini_10":{
      colorRamp: ['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c'],
      rangeText: ['<0.35','0.35-0.4','0.4-0.45','0.45-0.5','>=0.5']
    },
    "eduindex_10":{
      colorRamp: ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'],
      rangeText: ['<3','3-4','4-5','5-6','>=6']
    },
    "incomeindex_10":{
      colorRamp: ['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15'],
      rangeText: ['<2','2-4','4-6','6-8','>=8']
    }
  }
  var starterChip = attributeStyleInfo.gini_10.colorRamp;
  var starterLabel = attributeStyleInfo.gini_10.rangeText;
  for (var i = 0; i < 5; i++){
    $('#legend-attribute-chip-' + (i+1).toString()).css('background-color', starterChip[i]);
    $('#legend-attribute-label-' + (i+1).toString()).html(starterLabel[i]);
  }

  function createSelector(layer)  {
    var cartocss = "";
    var $options = $("#menu").find("ul li a");
    $options.click(function(e) {
      var $button = $(e.target);
      var selected = $button.attr('data')
      var selectedVar = $button.attr('value');

       
      var chip = attributeStyleInfo[selected].colorRamp;
      var label = attributeStyleInfo[selected].rangeText;
      $('.legend-attribute-label').html('');
      for (var i = 0; i < 5; i++){
        $('#legend-attribute-chip-' + (i+1).toString()).css('background-color', chip[i]);
        $('#legend-attribute-label-' + (i+1).toString()).html(label[i]);
      }

      if($(this).hasClass('selectable')){
        $options.removeClass('selected');
        $button.addClass('selected');
        $('.title-variable').html(selectedVar);
        $('.legend-attribute-title').html(selectedVar);
        cartocss = $('#' + selected).text();
        layer.setCartoCSS(cartocss);
      }
    })
  }
  
  var usCounties = 'adhp_counties_10';

  var layerSource = {
    user_name: 'true-cost-collaboratory',
    type: 'cartodb',
    sublayers: [{
      sql: "SELECT * FROM " + usCounties,
      cartocss: $('#gini_10').text(),
      interactivity: "cartodb_id, the_geom, county, state, gini_10, eduindex_10, incomeindex_10"
    }]
  }

  var countyCoal = 'https://true-cost-collaboratory.cartodb.com/api/v2/viz/4e201a90-05db-11e6-823a-0e3ff518bd15/viz.json'

var sublayer;

var southWest = L.latLng(-12,-240);
var northEast = L.latLng(72,-42);
var bounds = L.latLngBounds(southWest, northEast)

var map = new L.Map('map', {
  center: [39.828328, -98.579416],
  zoom: 4,
  minZoom: 3,
  maxZoom: 9,
  maxBounds: bounds,
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
        ['county','state','gini_10','eduindex_10','incomeindex_10'], 
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
      // sublayer.infowindow.set('template', $('#infowindow_template').html());
      createSelector(sublayer);

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



