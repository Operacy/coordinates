var test = require('tape'),
    coords  = require('../index.js'),
    extract = coords.extract,
    split   = coords.split,
    pair    = coords.pair;

var strings = {
    'noise before 27.00N 87W and noise after': {
        'extract': { coords: '27.00N 87W', format: 'DDD' },
        'pair': { lat: 27, lon: -87, format: 'DDD' }
    },
    '27.00N/87W': {
        'extract': { coords: '27.00N/87W', format: 'DDD' },
        'pair': { lat: 27, lon: -87, format: 'DDD' }
    },
    '27.00S 087.00W': {
        'extract': { coords: '27.00S 087.00W', format: 'DDD' },
        'pair': { lat: -27, lon: -87, format: 'DDD' }
    },
    '27.0123n 087.002w': {
        'extract': { coords: '27.0123n 087.002w', format: 'DDD' },
        'pair': { lat: 27.0123, lon: -87.002, format: 'DDD' }
    },
    '27.0067N 087E': {
        'extract': { coords: '27.0067N 087E', format: 'DDD' },
        'pair': { lat: 27.0067, lon: 87, format: 'DDD' }
    },
    '+27.00 087W': {
        'extract': { coords: '27.00 087W', format: 'DDD' },
        'pair': { lat: 27, lon: -87, format: 'DDD' }
    },
    '27N -87': {
        'extract': { coords: '27N -87', format: 'DDD' },
        'pair': { lat: 27, lon: -87, format: 'DDD' }
    },
    'N27.00 W087': {
        'extract': { coords: 'N27.00 W087', format: 'DDD' },
        'pair': { lat: 27, lon: -87, format: 'DDD' }
    },
    '27.05N/87.123W': {
        'extract': { coords: '27.05N/87.123W', format: 'DDD' },
        'pair': { lat: 27.05, lon: -87.123, format: 'DDD' }
    },
    '27.00°N 087.00°W': {
        'extract': { coords: '27.00°N 087.00°W', format: 'DDD' },
        'pair': { lat: 27, lon: -87, format: 'DDD' }
    },
    'S27.05/87.123W': {
        'extract': { coords: 'S27.05/87.123W', format: 'DDD' },
        'pair': { lat: -27.05, lon: -87.123, format: 'DDD' }
    },
};


test('Testing extraction of coordinates from a bunch of different strings', function(t) {

    t.plan(Object.keys(strings).length*3);

    Object.keys(strings).forEach(function(str){
        var extract = coords.extract(str);
        t.deepEqual(extract, strings[str].extract, 'Extracting coords from '+str);

        var pair = coords.pair(extract);
        t.deepEqual(pair, strings[str].pair, 'Extracting coord pair from '+JSON.stringify(extract));

        t.deepEqual(coords(str), strings[str].pair, 'Extracting coord pair from '+str);
    });
});
