//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp language models”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions =
//
//     The above copyright notice and this permission notice
//     shall be included in all copies or substantial
//     portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//     ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//     TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//     PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//     THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
//     CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//     CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//     DEALINGS IN THE SOFTWARE.

//

var loadCoreModel = require( './load-core-model.js' );
var loadNERModel = require( './load-ner-model.js' );
var loadSBDModel = require( './load-sbd-model.js' );
var loadPOSModel = require( './load-pos-model.js' );
var loadNEGATIONModel = require( './load-negation-model.js' );
var loadSAModel = require( './load-sa-model.js' );
var loadCERMetaModel = require( './load-cer-meta-model.js' );
var featureFn = require( './feature.js' );
var stem = require( './porter-stemmer.js' );
var lemmatize = require( './lemmatize.js' );
var readabilityStats = require( './readability-stats.js' );

var model = Object.create( null );

model.core = loadCoreModel;
model.sbd = loadSBDModel;
model.pos = loadPOSModel;
model.ner = loadNERModel;
model.negation = loadNEGATIONModel;
model.sa = loadSAModel;
model.metaCER = loadCERMetaModel;
model.featureFn = featureFn;

model.addons = Object.create( null );
model.addons.stem = stem;
model.addons.lemmatize = lemmatize;
model.addons.readabilityStats = readabilityStats;
model.addons.wordVectors = undefined;

module.exports = model;
