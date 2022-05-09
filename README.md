# winkNLP

### [![Build Status](https://travis-ci.com/winkjs/wink-nlp.svg?branch=master)](https://travis-ci.com/github/winkjs/wink-nlp) [![Coverage Status](https://coveralls.io/repos/github/winkjs/wink-nlp/badge.svg?branch=master)](https://coveralls.io/github/winkjs/wink-nlp?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/winkjs/wink-nlp/badge.svg)](https://snyk.io/test/github/winkjs/wink-nlp) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6035/badge)](https://bestpractices.coreinfrastructure.org/projects/6035) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/winkjs/Lobby) [![Follow on Twitter](https://img.shields.io/twitter/follow/winkjs_org?style=social)](https://twitter.com/winkjs_org)

## Developer friendly Natural Language Processing ✨
[<img align="right" src="https://decisively.github.io/wink-logos/logo-title.png" width="100px" >](https://winkjs.org/)

winkNLP is a JavaScript library for Natural Language Processing (NLP). Designed specifically to make development of NLP solutions **easier** and **faster**, winkNLP is optimized for the right balance of performance and accuracy.  The package can handle large amount of raw text at speeds over **525,000 tokens/second**. And with a test coverage of ~100%, winkNLP is a tool for building production grade systems with confidence.

[<img src="https://user-images.githubusercontent.com/9491/100614781-ad17bb00-333c-11eb-87ab-2ae41aa21285.png" alt="Wink Wizard Showcase">](https://winkjs.org/showcase-wiz/)


## Features
WinkNLP has a comprehensive natural language processing (NLP) pipeline covering tokenization, sentence boundary detection (sbd), negation handling, sentiment analysis, part-of-speech (pos) tagging, named entity recognition (ner), custom entities recognition (cer):

<img src="https://winkjs.org/images/wink-nlp-processing-pipeline.png" alt="Processing pipeline: text, tokenization, SBD, negation, sentiment, NER, POS, CER" title="WinkNLP processing pipeline">

At every stage a range of properties become accessible for tokens, sentences, and entities. Read more about the processing pipeline and how to configure it in the [winkNLP documentation](https://winkjs.org/wink-nlp/processing-pipeline.html).


It packs a rich feature set into a small foot print codebase of [under 1500 lines](https://coveralls.io/github/winkjs/wink-nlp?branch=master):

1. Fast, lossless & multilingual [tokenizer](https://winkjs.org/wink-nlp/processing-pipeline.html)

2. Developer friendly and intuitive [API](https://winkjs.org/wink-nlp/getting-started.html)

3. Built-in [API](https://winkjs.org/wink-nlp/visualizing-markup.html) to aid [text visualization](https://observablehq.com/@winkjs/how-to-perform-sentiment-analysis?collection=@winkjs/winknlp-recipes)

4. Extensive [text processing features](https://winkjs.org/wink-nlp/its-as-helper.html) such as bag-of-words, frequency table, stop word removal, readability statistics computation and many more.

5. Pre-trained [language models](https://winkjs.org/wink-nlp/language-models.html) with sizes starting from <3MB onwards

6. [BM25-based vectorizer](https://winkjs.org/wink-nlp/bm25-vectorizer.html)

7. Multiple [similarity](https://winkjs.org/wink-nlp/similarity.html) methods

8. Word vector integration

9. No external dependencies

10. [Runs on web browsers](https://winkjs.org/wink-nlp/wink-nlp-in-browsers.html)

11. [Typescript support](https://github.com/winkjs/wink-nlp/blob/master/types/index.d.ts).


## Installation

Use [npm](https://www.npmjs.com/package/wink-nlp) install:

```shell
npm install wink-nlp --save
```

In order to use winkNLP after its installation, you also need to install a language model. The following command installs the latest version of default language model — the light weight English language model called [wink-eng-lite-model](https://github.com/winkjs/wink-eng-lite-model).

```shell
node -e "require( 'wink-nlp/models/install' )"
```
Any required model can be installed by specifying its name as the last parameter in the above command. For example:
```shell
node -e "require( 'wink-nlp/models/install' )" wink-eng-lite-model
```

### How to install for Web Browser
If you’re using winkNLP in the browser use the [wink-eng-lite-web-model](https://www.npmjs.com/package/wink-eng-lite-web-model) instead. Learn about its installation and usage in our [guide to using winkNLP in the browser](https://winkjs.org/wink-nlp/wink-nlp-in-browsers.html).

## Getting Started
The "Hello World!" in winkNLP is given below:

```javascript
// Load wink-nlp package  & helpers.
const winkNLP = require( 'wink-nlp' );
// Load "its" helper to extract item properties.
const its = require( 'wink-nlp/src/its.js' );
// Load "as" reducer helper to reduce a collection.
const as = require( 'wink-nlp/src/as.js' );
// Load english language model — light version.
const model = require( 'wink-eng-lite-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );

// NLP Code.
const text = 'Hello   World🌎! How are you?';
const doc = nlp.readDoc( text );

console.log( doc.out() );
// -> Hello   World🌎! How are you?

console.log( doc.sentences().out() );
// -> [ 'Hello   World🌎!', 'How are you?' ]

console.log( doc.entities().out( its.detail ) );
// -> [ { value: '🌎', type: 'EMOJI' } ]

console.log( doc.tokens().out() );
// -> [ 'Hello', 'World', '🌎', '!', 'How', 'are', 'you', '?' ]

console.log( doc.tokens().out( its.type, as.freqTable ) );
// -> [ [ 'word', 5 ], [ 'punctuation', 2 ], [ 'emoji', 1 ] ]
```
Experiment with the above code on [RunKit](https://npm.runkit.com/wink-nlp).

### Explore Further
Dive into [winkNLP's concepts](https://winkjs.org/wink-nlp/getting-started.html)  or head to **[winkNLP recipes](https://observablehq.com/collection/@winkjs/winknlp-recipes)** for common NLP tasks or just explore live [showcases](https://winkjs.org/showcase.html) to learn:

#### [Wikipedia Timeline](https://winkjs.org/showcase-timeline/) ⏳
Reads any wikipedia article and generates a visual timeline of all its events.

#### [NLP Wizard](https://winkjs.org/showcase-wiz/) 🧙
Performs tokenization, sentence boundary detection, pos tagging, named entity detection and sentiment analysis of user input text in real time.

#### [Naive Wikification Tool](https://observablehq.com/@winkjs/how-to-build-a-naive-wikification-tool) 🔗
Links entities such as famous persons, locations or objects to the relevant Wikipedia pages.


## Speed & Accuracy
The [winkNLP](https://winkjs.org/wink-nlp/) processes raw text at **~525,000 tokens per second** with its default language model — [wink-eng-lite-model](https://github.com/winkjs/wink-eng-lite-model), when [benchmarked](https://github.com/bestiejs/benchmark.js) using "Ch 13 of Ulysses by James Joyce" on a 2.2 GHz Intel Core i7 machine with 16GB RAM. The processing included the entire NLP pipeline — tokenization, sentence boundary detection, negation handling, sentiment analysis, part-of-speech tagging, and named entity extraction. This speed is way ahead of the prevailing speed benchmarks.

The benchmark was conducted on [Node.js versions 14.8.0, and 12.18.3](https://nodejs.org/en/about/releases/).

The [winkNLP](https://winkjs.org/wink-nlp/) delivers similar performance on browsers; its performance on a specific machine/browser combination can be measured using the Observable notebook — [How to measure winkNLP's speed on browsers?](https://observablehq.com/@winkjs/how-to-measure-winknlps-speed-on-browsers?collection=@winkjs/winknlp-recipes).

It pos tags a subset of WSJ corpus with an accuracy of **~94.7%** — this includes *tokenization of raw text prior to pos tagging*. The current state-of-the-art is at ~97% accuracy but at lower speeds and is generally computed using gold standard pre-tokenized corpus.

Its general purpose sentiment analysis delivers a [f-score](https://en.wikipedia.org/wiki/F1_score) of **~84.5%**, when validated using Amazon Product Review [Sentiment Labelled Sentences Data Set](https://archive.ics.uci.edu/ml/machine-learning-databases/00331/) at [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php). The current benchmark accuracy for **specifically trained** models can range around 95%.

## Memory Requirement
Wink NLP delivers this performance with the minimal load on RAM. For example, it processes the entire [History of India Volume I](https://en.wikisource.org/wiki/History_of_India/Volume_1) with a total peak memory requirement of under **80MB**. The book has around 350 pages which translates to over 125,000 tokens.

## Documentation
- [Concepts](https://winkjs.org/wink-nlp/getting-started.html) — everything you need to know to get started.
- [API Reference](https://winkjs.org/wink-nlp/read-doc.html) — explains usage of APIs with examples.
- [Change log](https://github.com/winkjs/wink-nlp/blob/master/CHANGELOG.md) — version history along with the details of breaking changes, if any.
- [Showcases](https://winkjs.org/showcase.html) — live examples with code to give you a head start.

## Need Help?

### Usage query 👩🏽‍💻
Please ask at [Stack Overflow](https://stackoverflow.com/) or discuss at [Wink JS GitHub Discussions](https://github.com/winkjs/wink-nlp/discussions) or chat with us at [Wink JS Gitter Lobby](https://gitter.im/winkjs/Lobby).

### Bug report 🐛
If you spot a bug and the same has not yet been reported, raise a new [issue](https://github.com/winkjs/wink-nlp/issues) or consider fixing it and sending a PR.

### New feature ✨
Looking for a new feature, request it via the [new features & ideas](https://github.com/winkjs/wink-nlp/discussions/categories/new-features-ideas) discussion forum  or consider becoming a [contributor](https://github.com/winkjs/wink-nlp/blob/master/CONTRIBUTING.md).


## About wink
[Wink](https://winkjs.org/) is a family of open source packages for **Natural Language Processing**, **Machine Learning**, and **Statistical Analysis** in NodeJS. The code is **thoroughly documented** for easy human comprehension and has a **test coverage of ~100%** for reliability to build production grade solutions.

## Copyright & License

**Wink NLP** is copyright 2017-21 [GRAYPE Systems Private Limited](https://graype.in/).

It is licensed under the terms of the MIT License.
