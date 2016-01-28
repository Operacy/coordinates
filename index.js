/*jslint node: true */
'use strict'

/**
Parses GIS coordinate pairs from strings

Usage:
var coords  = require('coordinates'),
detect  = coords.detect,
extract = coords.extract,
pair    = coords.pair,
normalize = coords.normalize    ;

var string = 'noise before 27.00N 87W and noise after';
var extract = extract(string);
var pair = pair(extract);

Formats from:
http://resources.arcgis.com/en/help/main/10.1/index.html#//001700000186000000

*/

var ddm2dd = function (ddm) {
  // split into degrees and minutes
  var d = ddm.split(' ')
  if (d[0] >= 0) {
    return parseInt(d[0], 10) + (d[1] && d[1] / 60) || 0 + (d[2] && d[2] / 3600) || 0
  } else {
    return parseInt(d[0], 10) - ((d[1] && (d[1] / 60) || 0) - (d[2] && (d[2] / 3600) || 0))
  }
}

var detect = function (string) {
  // try to match all different formats. Return first match
  return coordinates.DDM(string)
  || coordinates.DD(string)
  || false
}

var extract = function (string) {
  // try to match all different formats. Return first match including format
  return coordinates.DDM(string)
  || coordinates.DD(string)
  || false
}

function pair (str) {
  // input string "coordinates;type"
  //  e.g. 60 10;DDD
  // output string "lat;lon;type"
  //  e.g. "60;10;DD"

  var latitude,
  separator,
  _coords = str.split(';')

  switch (_coords[1]) {
    case 'DD':
    latitude = new RegExp(/([N|n|S|s|+|\-]*(\d{1,3})(\.(\d)+)?[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*[N|n|S|s|+|\-]*[\s|\/|\\|\|,])/)
    separator = new RegExp(/[\s|\/|\\|\|,]$/)
    break
    case 'DDM':
    latitude = new RegExp(/([N|n|S|s|+|\-]*(\d{1,3})[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*(\s)(\d{1,2})*(\.(\d)+)*[\u2032|\u0027]*[N|n|S|s|+|\-]*[\s|\/])/)
    separator = new RegExp(/[\s|\/]$/)
    break
  } // switch

  var lat_inc = latitude.exec(_coords[0])    // latitude including seperator
  var lat = lat_inc[0].replace(separator, '')
  return ''+lat+';'+_coords[0].substr(lat_inc[0].length)+';'+_coords[1]

};

function normalize (dd_struct) {
  var d = dd_struct.split(';'),
  lat_prefix = '',
  lon_prefix = ''

  // Characters we wish to remove from misc notations
  var remove = new RegExp(/[N|n|S|s|E|e|W|w|+|\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A|\u2032|\u0027]/g)

  // Handle Souths and Wests. They make negative degrees.
  if (d[0].indexOf('S')>=0 || d[0].indexOf('s')>=0) lat_prefix = '-'  // Replace S and s with -
  if (d[1].indexOf('W')>=0 || d[1].indexOf('w')>=0) lon_prefix = '-'  // Replace W and w with -

  // Remove all direction indicators.
  d[0] = d[0].replace(remove,'')
  d[1] = d[1].replace(remove,'')

  // Remove leading zeroes
  if(d[0][0] == '0') d[0] = d[0].slice(1)
  if(d[1][0] == '0') d[1] = d[1].slice(1)

  // Add prefixes
  d[0] = lat_prefix + d[0]
  d[1] = lon_prefix + d[1]

  return d.join(';')              // Return the normalized string (without the type)
}

var coordinates = function (str) {
  return normalize(pair(extract(str)))
  //return pair(extract(str))
}

// DD (decimal degrees)
coordinates.DD = function (string) {
  var DD = new RegExp(/([N|n|S|s|+|\-]*(\d{1,3})(\.(\d)+)?[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*[N|n|S|s|+|\-]*[\s|\/|\\|\|,]+)[E|e|W|w|+|\-]*(\d{1,3})(\.(\d)+)?[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*[E|e|W|w|+|\-]*/);
  var x = DD.exec(string)
  return (x && x[0]) ? x[0]+';DD' : null
}

coordinates.DD.pair = function (dd_string) {
  var d = dd_string.split(';')
  var dd_latitude = new RegExp(/([N|n|S|s|+|\-]*(\d{1,3})(\.(\d)+)?[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*[N|n|S|s|+|\-]*[\s|\/|\\|\|,]+)/)
  var lat = dd_latitude.exec(d[0])
  return lat[0].substr(0, lat[0].length-1) + ';' + d[0].substr(lat[0].length) + ';' + d[1] // Todo: trim away all seperators from lat (may be multiple)
};

// DDM (degree minutes)
coordinates.DDM = function (string) {
  var DDM = new RegExp(/([N|n|S|s|+|\-]*(\d{1,3})[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*(\s)(\d{1,2})*(\.(\d)+)*[\u2032|\u0027]*[N|n|S|s|+|\-]*[\s|\/]+)[E|e|W|w|+|\-]*(\d{1,3})[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*(\s)(\d{1,2})*(\.(\d)+)*[\u2032|\u0027]*[E|e|W|w|+|\-]*/);
  var x = DDM.exec(string);
  return (x && x[0]) ? x[0]+';DDM' : null;
};

coordinates.DDM.pair = function (ddm_string) {
  var d = ddm_string.split(';');
  var ddm_latitude = new RegExp(/([N|n|S|s|+|\-]*(\d{1,3})[\u00B0|\u02DA|\u00BA|\u005E|\u007E|\u002A]*(\s)(\d{1,2})*(\.(\d)+)*[\u2032|\u0027]*[N|n|S|s|+|\-]*[\s|\/]+)/);
  var lat = ddm_latitude.exec(d[0]);
  return lat[0].substr(0, lat[0].length-1) + ';' + d[0].substr(lat[0].length) + ';' + d[1]; // Todo: trim away all seperators from lat (may be multiple)
};

coordinates.DMS = function (string) { return null }  // DMS (degree minute seconds)
coordinates.UTM = function (string) { return null }  // UTM (Universal Transverse Mercator)
coordinates.MGRS = function (string) { return null } // (MGRS) Military Grid Reference System
coordinates.extract = extract
coordinates.pair = pair
coordinates.normalize = normalize
coordinates.detect = detect
coordinates.ddm2dd = ddm2dd

module.exports = coordinates
