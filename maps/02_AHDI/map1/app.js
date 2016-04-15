window.onload = function() {

  function createSelector(layer)  {
    var cartocss = "";
    var $options = $("#menu").find("ul li a");
    $options.click(function(e) {
      var $button = $(e.target);
      var selected = $button.attr('data');

      if($(this).hasClass('selectable')){
        $options.removeClass('selected');
        $button.addClass('selected');
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

var sublayer;

var map = new L.Map('map', {
  center: [39.828328, -98.579416],
  zoom: 4
});

map.attributionControl.addAttribution('<a href="http://www.measureofamerica.org/" target="_blank">Measure of America</a>');

// Add a basemap to the map object just created
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
}).addTo(map);

function getColor(d) {
    return d >= 6 ? '#2c7bb6' :
           d >= 5.5  ? '#abd9e9' :
           d >= 4.5  ? '#ffffdf' :
           d >= 4  ? '#fdae61' :
                      '#d7191c';
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 4, 4.5, 5.5, 6],
        colors = ['#d7191c','#fdae61','#ffffdf','#abd9e9','#2c7bb6']
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML = '<b>American Human Development Index (AHDI)'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div><i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</div>' : '+');
    }

    return div;
};

legend.addTo(map);


cartodb.createLayer(map, layerSource)
  .addTo(map)
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
  })
  .error(function(err) {
    console.log("error: " + err);
  });
}