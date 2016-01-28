#!/usr/bin/env node

var fs = require('fs')
var split = require('split2')
var argv = require('minimist')(process.argv.slice(2))
var stream = require('stream')

var coords = require('./index')

if (argv.h || (process.stdin.isTTY && !argv._.length)) {
  console.log('Usage: echo [file-name] | coordinates')
  console.log('Usage: coordinates [file-name]')
  process.exit()
}

if (argv.v) {
  console.log('Version: ' + require('../package.json').version)
  process.exit()
}

var transform = new stream.Transform({
  objectMode: true,
  transform: function (chunk, encoding, next) {
    this.push(coords(chunk) + '\n')
    next()
  }
})

var st
if (!process.stdin.isTTY) {
  st = process.stdin
} else if (argv._.length) {
  st = fs.createReadStream(argv._[0])
}

st.pipe(split()).pipe(transform).pipe(process.stdout)
