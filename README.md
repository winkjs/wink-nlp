# winkNLP

A new way of doing NLP ✨

### [![Stability](https://img.shields.io/badge/stability-1--experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index) [![Build Status](https://api.travis-ci.org/winkjs/wink-nlp.svg?branch=master)](https://travis-ci.org/winkjs/wink-nlp) [![Coverage Status](https://coveralls.io/repos/github/winkjs/wink-nlp/badge.svg?branch=master)](https://coveralls.io/github/winkjs/wink-nlp?branch=master) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/winkjs/Lobby)

[<img align="right" src="https://decisively.github.io/wink-logos/logo-title.png" width="100px" >](http://winkjs.org/)

winkNLP is a JavaScript library for Natural Language Processing (NLP). Designed specifically to make development of NLP solutions **easier** and **faster**, winkNLP is optimized for the right balance of performance and accuracy.  The package can handle large amount of raw text at speeds over **500,000 tokens/second**. And with a test coverage of ~100%, winkNLP is a tool for building production grade systems with confidence.

#### Features
It packs a rich feature set into a small foot print codebase of [under 1500 lines](https://coveralls.io/github/winkjs/wink-nlp?branch=master):

1. Lossless tokenizer
2. Developer friendly and intuitive API
3. Built-in API to aid text visualization
4. Easy information exrtaction from raw text
5. Extensive text pre-processing features
6. Pre-trained models with sizes starting from <3MB onwards
7. Word vector integration
8. Comprehensive NLP pipeline covering tokenization, sentence boundary detection, negation handling, sentiment analysis, part-of-speech tagging, named entity extraction, custom entities detection and pattern matching.


### Installation

Use [npm](https://www.npmjs.com/package/wink-nlp) install:

    npm install wink-nlp --save

You will also need the English lite model:

    npm install https://github.com/winkjs/wink-eng-lite-model/releases/download/0.2.0/wink-eng-lite-model-0.2.0.tgz --save

### Documentation
- [Concepts](https://winkjs.org/wink-nlp/getting-started.html) — everything you need to know to get started.
- [API Reference](https://winkjs.org/wink-nlp/read-doc.html) — explains usage of APIs with examples.
- [Change log](https://github.com/winkjs/wink-nlp/blob/master/CHANGELOG.md) — version history along with the details of breaking changes, if any.

### Need Help?
If you spot a bug and the same has not yet been reported, raise a new [issue](https://github.com/winkjs/wink-nlp/issues) or consider fixing it and sending a pull request.


### About wink
[Wink](http://winkjs.org/) is a family of open source packages for **Natural Language Processing**, **Machine Learning**, and **Statistical Analysis** in NodeJS. The code is **thoroughly documented** for easy human comprehension and has a **test coverage of ~100%** for reliability to build production grade solutions.

### Copyright & License

**Wink NLP** is copyright 2017-20 [GRAYPE Systems Private Limited](http://graype.in/).

It is licensed under the terms of the MIT License.
