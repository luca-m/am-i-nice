/*
 * extract-keyword.js
 * Copyright (C) 2018 
 *
 * Distributed under terms of the MIT license.
 */
'use strict';
//var vfile = require('to-vfile');
var retext = require('retext');
var keywords = require('retext-keywords');
var nlcstToString = require('nlcst-to-string');


var K= require('./src/K');
var S= require('./src/S');
var A= require('./src/A');

var kk=A.map(k=>k.desc).join('\n').toLowerCase()
	.replace(/knowledge/gi,'')
	.replace(/skills?/gi,'')
	.replace(/ability/gi,'')
	.replace(/abilities/gi,'')
	.replace(/theof/gi,'')
	.replace(/system/gi,'')
	.replace(/processes/gi,'')
	.replace(/collection/gi,'')
	.replace(/cyber/gi,'')
	.replace(/security/gi,'')
	.replace(/capabilities/gi,'')
	.replace(/Objectives/gi,'')
	.replace(/object/gi,'')
	.replace(/ type /gi,'')
	.replace(/ use /gi,'')
	.replace(/limit/gi,'')
;

retext()
  .use(keywords,{maximum:60})
  .process(kk, function (err, file) {
    if (err) throw err;
    console.log('Keywords:');
    file.data.keywords.forEach(function (keyword) {
      console.log(nlcstToString(keyword.matches[0].node));
    });
    //console.log('Key-phrases:');
    //file.data.keyphrases.forEach(function (phrase) {
    //  console.log(phrase.matches[0].nodes.map(nlcstToString).join(''));
    //});
  }
);
