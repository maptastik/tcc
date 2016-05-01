window.onload = function() {
  var attributeStyleInfo = {
    "medearnings_10":{
      colorRamp: ['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c'],
      rangeText: ['<20K','20K-25K','25K-30K','30K-35K','>=35K']
    }
  }
  var starterChip = attributeStyleInfo.medearnings_10.colorRamp;
  var starterLabel = attributeStyleInfo.medearnings_10.rangeText;
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
      cartocss: $('#medearnings_10').text(),
      interactivity: "cartodb_id, the_geom, county, state, under6povertyperc_10, over65povertyperc_10, medearnings_10"
    }]
  }

  var countyCoal = 'https://true-cost-collaboratory.cartodb.com/api/v2/viz/367f1ff4-0a85-11e6-84f6-0ea31932ec1d/viz.json'

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
        ['county','state','under6povertyperc_10','over65povertyperc_10','medearnings_10'], 
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



