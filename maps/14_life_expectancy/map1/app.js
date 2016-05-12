window.onload = function() {

  function createSelector(layer)  {
    var cartocss = "";
    var $options = $("#menu").find("ul li a");
    $options.click(function(e) {
      var $button = $(e.target);
      var selected = $button.attr('data')
      var selectedYear = $button.attr('value');

      if($(this).hasClass('selectable')){
        $options.removeClass('selected');
        $button.addClass('selected');
        $('.title-year').html(selectedYear);
        cartocss = $('#' + selected).text();
        layer.setCartoCSS(cartocss);
      }
    })
  }
  
  var usStates = 'adhp_state_all';

  var layerSource = {
    user_name: 'true-cost-collaboratory',
    type: 'cartodb',
    sublayers: [{
      sql: "SELECT * FROM " + usStates,
      cartocss: $('#lifeexpect_10').text(),
      interactivity: "cartodb_id, the_geom, name, lifeexpect_00, lifeexpect_05, lifeexpect_08, lifeexpect_10"
    }]
  }

  var stateCoal = 'https://true-cost-collaboratory.cartodb.com/api/v2/viz/4542a672-051d-11e6-930c-0ecd1babdde5/viz.json'

var sublayer;

var southWest = L.latLng(-12,-240);
var northEast = L.latLng(72,-42);
var bounds = L.latLngBounds(southWest, northEast)

var map = new L.Map('map', {
  center: [39.828328, -98.579416],
  zoom: 4,
  minZoom: 3,
  maxZoom: 6,
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
        ['name','lifeexpect_10','lifeexpect_08','lifeexpect_05','lifeexpect_00'], 
        {
          infowindowTemplate: $('#infowindow_template').html(),
          templateType: 'mustache'
        });
      // sublayer.infowindow.set('template', $('#infowindow_template').html());
      createSelector(sublayer);

      cartodb.createLayer(map, stateCoal)
        .addTo(map, 1)
        .done(function(layer){
          console.log('added stateCoal', stateCoal);
        })
        .error(function () {
          console.log('problem adding stateCoal')
        })
  })
  .error(function(err) {
    console.log("error: " + err);
  });
}



