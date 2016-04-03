#!/usr/bin/env node
var express = require('express');
var cors = require('cors');
var pg = require('pg');
var GoogleMapsAPI = require('googlemaps');

var app = express();

app.use(cors());

var PORT = 9999;
var API_KEY = 'AIzaSyAvxKwQPytvABv_gxCVNXY1DSqlqBG_-Do';
var gmAPI = new GoogleMapsAPI({ key: API_KEY });
var conString = 'postgres://kelvinabrokwa:@localhost/skytruth';

app.get('/:type/:lon/:lat', function(req, res) {
  fetch(req.params.lon, req.params.lat)
    .then(function(url) { res.send(url); });
});

app.listen(PORT, function() {
  console.log('Server listening on port:', PORT);
});

function fetch(lon, lat) {
  return new Promise(function(resolve, reject) {
    pg.connect(conString, function(err, client, done) {
      if (err) reject(err);
      client.query("select st_asgeojson(st_transform(way, 4236))" +
          "from planet_osm_point where leisure='stadium' " +
          "order by st_distance(" +
            "ST_setsrid(planet_osm_point.way, 4326), " +
            "st_setsrid(st_makepoint($1,$2), 4326)) " +
          "limit 1;", [lon, lat], function(error, result) {
            done();
            if (error) reject(error);
            var coords = JSON.parse(result.rows[0].st_asgeojson).coordinates;
            var params = {
              center: coords[1] + ',' + coords[0],
              zoom: 19,
              size: '500x500',
              maptype: 'satellite'
            };
            var url = gmAPI.staticMap(params);
            resolve(url);
          });
    });
  });
}

