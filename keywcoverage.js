/*
 * keywcoverage.js
 * Copyright (C) 2018 
 *
 * Distributed under terms of the MIT license.
 */
'use strict';
const PCA = require('ml-pca'); 
var K= require('./src/K');
var S= require('./src/S');
var A= require('./src/A');
 
var kw= require('./src/kkeywords');
var sw= require('./src/skeywords');
var aw= require('./src/akeywords');


let kmap=K.map(k=>kw.map(w=>(k.desc.indexOf(w)!=-1?1:0)));
let smap=S.map(k=>sw.map(w=>(k.desc.indexOf(w)!=-1?1:0)));
let amap=A.map(k=>aw.map(w=>(k.desc.indexOf(w)!=-1?1:0)));

var kkw=aw;
var kkmap=amap;


const pca = new PCA(kkmap)
var v=pca.getExplainedVariance();
var mm=[];
for (let i=0;i<v.length;i++){
  mm.push({keyw:kkw[i],val:v[i]})
}

mm=mm.sort((a,b)=>a.val-b.val)
console.log(JSON.stringify(mm.map(e=>e.keyw)))
