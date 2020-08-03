# winkNLP

### [![Stability](https://img.shields.io/badge/stability-1--experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index) [![Build Status](https://api.travis-ci.org/winkjs/wink-nlp.svg?branch=master)](https://travis-ci.org/winkjs/wink-nlp) [![Coverage Status](https://coveralls.io/repos/github/winkjs/wink-nlp/badge.svg?branch=master)](https://coveralls.io/github/winkjs/wink-nlp?branch=master) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/winkjs/Lobby)

## A new way of doing NLP ✨
[<img align="right" src="https://decisively.github.io/wink-logos/logo-title.png" width="100px" >](http://winkjs.org/)

winkNLP is a JavaScript library for Natural Language Processing (NLP). Designed specifically to make development of NLP solutions **easier** and **faster**, winkNLP is optimized for the right balance of performance and accuracy.  The package can handle large amount of raw text at speeds over **500,000 tokens/second**. And with a test coverage of ~100%, winkNLP is a tool for building production grade systems with confidence.

## Features
It packs a rich feature set into a small foot print codebase of [under 1500 lines](https://coveralls.io/github/winkjs/wink-nlp?branch=master):

1. Lossless tokenizer
2. Developer friendly and intuitive API
3. Built-in API to aid text visualization
4. Easy information extraction from raw text
5. Extensive text pre-processing features
6. Pre-trained models with sizes starting from <3MB onwards
7. Word vector integration
8. Comprehensive NLP pipeline covering tokenization, sentence boundary detection, negation handling, sentiment analysis, part-of-speech tagging, named entity extraction, custom entities detection and pattern matching
9. No external dependencies.


## Installation

Use [npm](https://www.npmjs.com/package/wink-nlp) install:

```shell
npm install wink-nlp --save
```

In order to use winkNLP after its installation, you also need to install a language model. The following command installs the latest version of default language model — the light weight English language model called `wink-eng-lite-model`.

```shell
node -e "require( 'wink-nlp/models/install' )"
```
Any required model can be installed by specifying its name as the last parameter in the above command. For example:
```shell
node -e "require( 'wink-nlp/models/install' )" wink-eng-lite-model
```

## Getting Started
The "Hello World!" in winkNLP is given below. As the next step, we recommend a dive into [winkNLP's concepts](https://winkjs.org/wink-nlp/getting-started.html).

```javascript
// Boilerplate Code.
// Load wink-nlp package.
var winkNLP = require( 'wink-nlp' );
// Load "its" helper to extract item properties.
const its = require( 'wink-nlp/src/its.js' );
// Load english language model — light version.
var model = require( 'wink-eng-lite-model' );
// Instantiate winkNLP.
var nlp = winkNLP( model );

// NLP Code.
var text = 'Hello   World🌎! How are you?';
var doc = nlp.readDoc( text );
console.log( doc.out() );
// -> Hello   World🌎! How are you?
console.log( doc.sentences().out() );
// -> [ 'Hello   World🌎!', 'How are you?' ]
console.log( doc.entities().out( its.detail ) );
// -> [ { value: '🌎', type: 'EMOJI' } ]
console.log( doc.tokens().out() );
// -> [ 'Hello', 'World', '🌎', '!', 'How', 'are', 'you', '?' ]
```


## Documentation
- [Concepts](https://winkjs.org/wink-nlp/getting-started.html) — everything you need to know to get started.
- [API Reference](https://winkjs.org/wink-nlp/read-doc.html) — explains usage of APIs with examples.
- [Change log](https://github.com/winkjs/wink-nlp/blob/master/CHANGELOG.md) — version history along with the details of breaking changes, if any.

## Need Help?

### Usage query 👩🏽‍💻
Please ask at [Stack Overflow](https://stackoverflow.com/) or discuss it at [Wink JS Gitter Lobby](https://gitter.im/winkjs/Lobby).

### Bug report 🐛
If you spot a bug and the same has not yet been reported, raise a new [issue](https://github.com/winkjs/wink-nlp/issues) or consider fixing it and sending a PR.

### New feature ✨
Looking for a new feature, request it via a new [issue](https://github.com/winkjs/wink-nlp/issues) or consider becoming a [contributor](https://github.com/winkjs/wink-nlp/blob/master/CONTRIBUTING.md).


## About wink
[Wink](https://winkjs.org/) is a family of open source packages for **Natural Language Processing**, **Machine Learning**, and **Statistical Analysis** in NodeJS. The code is **thoroughly documented** for easy human comprehension and has a **test coverage of ~100%** for reliability to build production grade solutions.

## Copyright & License

**Wink NLP** is copyright 2017-20 [GRAYPE Systems Private Limited](https://graype.in/).

It is licensed under the terms of the MIT License.
