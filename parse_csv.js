#!/usr/bin/env node
var fs = require('fs');
var pg = require('pg');
var GoogleMapsAPI = require('googlemaps');
var parse = require('csv-parse');
var parser = parse();

var API_KEY = 'AIzaSyAvxKwQPytvABv_gxCVNXY1DSqlqBG_-Do';
var gmAPI = new GoogleMapsAPI({ key: API_KEY});
var conString = 'postgres://kelvinabrokwa:@localhost/skytruth';
var fname = process.argv[2];

var data = [];
var header = false;

parser.on('readable', function() {
  var record;
  while (record = parser.read()) {
    if (!header) {
      header = true;
      return;
    }
    data.push(record);
  }
});

var requests = 0;

parser.on('finish', function() {
  pg.connect(conString, function(err, client, done) {
    if (err) throw err;
    for (var i = 0; i < data.length; i++) {
      var lat = data[i][0];
      var lon = data[i][1];
      client.query("select st_asgeojson(st_transform(way, 4236))" +
          "from planet_osm_point where leisure='stadium' " +
          "order by st_distance(" +
            "ST_setsrid(planet_osm_point.way, 4326), " +
            "st_setsrid(st_makepoint($1,$2), 4326)) " +
          "limit 1;", [lon, lat], function(error, result) {
            if (++requests === data.length) done();
            if (error) throw error;
            var coords = JSON.parse(result.rows[0].st_asgeojson).coordinates;
            var params = {
              center: coords[1] + ',' + coords[0],
              zoom: 19,
              size: '500x400',
              maptype: 'satellite'
            };
            var url = gmAPI.staticMap(params);
            console.log(url);
          });
    }
  });
});

parser.write(fs.readFileSync(fname));
parser.end();
