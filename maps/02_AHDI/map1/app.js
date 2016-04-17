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
  
  var usStates = 'us_states_merge';

  var layerSource = {
    user_name: 'true-cost-collaboratory',
    type: 'cartodb',
    sublayers: [{
      sql: "SELECT * FROM " + usStates,
      cartocss: $('#hdi_10').text(),
      interactivity: "cartodb_id, the_geom, name, hdi_00, hdi_05, hdi_08, hdi_10"
    }]
  }

  var stateCoal = 'https://true-cost-collaboratory.cartodb.com/api/v2/viz/c468ebee-0407-11e6-be1b-0ecfd53eb7d3/viz.json'

var sublayer;

var map = new L.Map('map', {
  center: [39.828328, -98.579416],
  zoom: 4,
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
        ['name','hdi_10','hdi_08','hdi_05','hdi_00'], 
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