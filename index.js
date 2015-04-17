/**
    Parses GIS coordinate pairs from strings

    Usage:
var coords  = require('coordinates'),
    extract = coords.extract,
    pair    = coords.pair;

    var string = 'noise before 27.00N 87W and noise after';
    var extract = extract(string);
    var pair = pair(extract);

    Formats from:
    http://resources.arcgis.com/en/help/main/10.1/index.html#//001700000186000000

    Degree-based formats:
    ----------------------------------
    DD (Decimal Degrees):

    <latitude> <separator> <longitude>
    latitude: [ + | - | N | S ] <DD.dd> [ + | - | N | S ]	DD = 00 - 90, dd = 00 - 99
    longitude: [ + | - | E | W ] <DDD.dd> [ + | - | E | W ]	DDD = 0 til 180 & 0 til -180
    separator: [space | / | \ | | | , ]

    Latitude <DD.dd> and longitude <DDD.dd> values can be formatted as:
    <degrees> [<decimal>] <fraction of degree> [<degree-mark>]

    [+|-]*[N|n|S|s]*(\d{2,3})+(\.)*(\d)*[\u00B0]*[N|n|S|s]*([\s/])*[+|-]*[W|w|E|e]*(\d{2,3})*((\.)*(\d{2}))*[\u00B0]*[W|w|E|e]*
*/
var degrees = /-?(\d{2,3})+/;
var decimal = /(\.)*/;
var fraction_of_degree = /(\d)*/;
var degree_mark = /[\u00B0]*/;
var north_south = /[N|n|S|s]*/;
var east_west = /[E|e|W|w]*/;
var separator = /[\s|\/|\\|\||,]+/;

var latitude = north_south.source + degrees.source + decimal.source + fraction_of_degree.source + degree_mark.source + north_south.source;
var longitude = east_west.source + degrees.source + decimal.source + fraction_of_degree.source + degree_mark.source + east_west.source;

var DD = new RegExp(latitude + separator.source + longitude);
var number = new RegExp(/-?[1-9]+(\d)*(\.)*(\d)*/);

function extract (string) {
    // try to match all different formats
    return coordinates.DDM(string)
        || coordinates.DMS(string)
        || coordinates.UTM(string)
        || coordinates.MGRS(string)
        || coordinates.DD(string);  // Add other formats when needed
}

function pair (str) {
    // input string with coordinates
    // output object with lat and lon
    var pair = str && str.coords && str.coords.split(coordinates.patterns.separator);
    lat = pair && number.exec(pair[0]) || undefined;
    lon = pair && number.exec(pair[1]) || undefined;

    return (lat && lon)
        ? { lat: lat && Number(lat[0]), lon: lon && Number(lon[0]), format: str.format }
        : undefined;
}

function coordinates(str) { return pair(extract(str)); }

coordinates.DD = function (string) {
  var x = DD.exec(string);
  return (x && x[0]) ? {coords: x[0], format: 'DDD'} : null;
};
coordinates.DDM = function (string) { return null; };  // DDM (degree minutes)
coordinates.DMS = function (string) { return null; };  // DMS (degree minute seconds)
coordinates.UTM = function (string) { return null; };  // UTM (Universal Transverse Mercator)
coordinates.MGRS = function (string) { return null; }; // (MGRS) Military Grid Reference System
coordinates.extract = extract;
coordinates.pair = pair;
coordinates.patterns = { separator: separator };

module.exports = coordinates;
