var test = require('tape'),
    coords  = require('../index.js'),
    extract = coords.extract,
    pair    = coords.pair;

var strings = {
    /***
     DD-testing
    ***/
    'noise before 27.00N 87W and noise after': {
        'extract':'27.00N 87W;DD',
        'pair':'27.00N;87W;DD',
        'normalize': '27.00;-87'
    },
    '27.00N/87W': {
        'extract': '27.00N/87W;DD',
        'pair': '27.00N;87W;DD',
        'normalize': '27.00;-87'
    },
    '27.00N/87W': {
        'extract': '27.00N/87W;DD',
        'pair': '27.00N;87W;DD',
        'normalize': '27.00;-87'
    },
    '27.00S 087.00W': {
        'extract': '27.00S 087.00W;DD',
        'pair': '27.00S;087.00W;DD',
        'normalize': '-27.00;-87.00'
    },
    '27.0123n 087.002w': {
        'extract': '27.0123n 087.002w;DD',
        'pair': '27.0123n;087.002w;DD',
        'normalize': '27.0123;-87.002'
    },
    '27.0067N 087E': {
        'extract': '27.0067N 087E;DD',
        'pair': '27.0067N;087E;DD',
        'normalize': '27.0067;87'
    },
    '+27.00 087W': {
        'extract': '+27.00 087W;DD',
        'pair': '+27.00;087W;DD',
        'normalize': '27.00;-87'
    },
    '27N -87': {
        'extract': '27N -87;DD',
        'pair': '27N;-87;DD',
        'normalize': '27;-87'
    },
    'N27.00 W087': {
        'extract': 'N27.00 W087;DD',
        'pair': 'N27.00;W087;DD',
        'normalize': '27.00;-87'
    },
    '27.05N/87.123W': {
        'extract': '27.05N/87.123W;DD',
        'pair': '27.05N;87.123W;DD',
        'normalize': '27.05;-87.123'
    },
    '27.00°N 087.00°W': {
        'extract': '27.00°N 087.00°W;DD',
        'pair': '27.00°N;087.00°W;DD',
        'normalize': '27.00;-87.00'
    },
    'S27.05/87.123W': {
        'extract': 'S27.05/87.123W;DD',
        'pair': 'S27.05;87.123W;DD',
        'normalize': '-27.05;-87.123'
    },
    "63 7": {
      'extract': "63 7;DD",
      'pair': "63;7;DD",
      'normalize': '63;7'
    },
    "7 30": {
      'extract': "7 30;DD",
      'pair': "7;30;DD",
      'normalize': "7;30"
    },

    /***
        DDM testing
    **/

    '27 54.00N 087 59.00W': {
        'extract': '27 54.00N 087 59.00W;DDM',
        'pair': '27 54.00N;087 59.00W;DDM',
        'normalize': '27 54.00;-87 59.00'
    },
    '27 54.00n 087 59.00w': {
        'extract': '27 54.00n 087 59.00w;DDM',
        'pair': '27 54.00n;087 59.00w;DDM',
        'normalize': '27 54.00;-87 59.00'
    },
    '27 54N 087 0W': {
        'extract': '27 54N 087 0W;DDM',
        'pair': '27 54N;087 0W;DDM',
        'normalize': '27 54;-87 0'
    },
    '+27 54.00 087 59.00W': {
        'extract': '+27 54.00 087 59.00W;DDM',
        'pair': '+27 54.00;087 59.00W;DDM',
        'normalize': '27 54.00;-87 59.00'
    },
    'N27 54.00 W087 59.00': {
        'extract': 'N27 54.00 W087 59.00;DDM',
        'pair': 'N27 54.00;W087 59.00;DDM',
        'normalize': '27 54.00;-87 59.00'
    },
    '27 54.00N/87 59W': {
        'extract': '27 54.00N/87 59W;DDM',
        'pair': '27 54.00N;87 59W;DDM',
        'normalize': '27 54.00;-87 59'
    },
    "27° 54.00'N 087° 59.00'W": {
        'extract': "27° 54.00'N 087° 59.00'W;DDM",
        'pair': "27° 54.00'N;087° 59.00'W;DDM",
        'normalize': '27 54.00;-87 59.00'
    }

};


test('Testing extraction of coordinates from a bunch of different strings', function(t) {

    t.plan(Object.keys(strings).length*4);

    Object.keys(strings).forEach(function(str){
        var extract = coords.extract(str)
        t.deepEqual(extract, strings[str].extract, 'Extracting coords from '+str)

        var pair = coords.pair(extract);
        t.deepEqual(pair, strings[str].pair, 'Extracting coord pair from '+JSON.stringify(extract))

        var normalize = coords.normalize(pair.split(';').slice(0,2).join(';'))
        t.deepEqual(normalize, strings[str].normalize, "Normalizing pair from "+pair)

        t.deepEqual(coords(str), strings[str].pair, 'Extracting coord pair from '+str)


    });
});
