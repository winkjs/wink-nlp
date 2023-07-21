# winkNLP

### [![Build Status](https://travis-ci.com/winkjs/wink-nlp.svg?branch=master)](https://travis-ci.com/github/winkjs/wink-nlp) [![Coverage Status](https://coveralls.io/repos/github/winkjs/wink-nlp/badge.svg?branch=master)](https://coveralls.io/github/winkjs/wink-nlp?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/winkjs/wink-nlp/badge.svg)](https://snyk.io/test/github/winkjs/wink-nlp) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6035/badge)](https://bestpractices.coreinfrastructure.org/projects/6035) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/winkjs/Lobby) [![Follow on Twitter](https://img.shields.io/twitter/follow/winkjs_org?style=social)](https://twitter.com/winkjs_org)

## Developer friendly Natural Language Processing ✨
[<img align="right" src="https://decisively.github.io/wink-logos/logo-title.png" width="100px" >](https://winkjs.org/)

WinkNLP is a JavaScript library for Natural Language Processing (NLP). Designed specifically to make development of NLP applications **easier** and **faster**, winkNLP is optimized for the right balance of performance and accuracy. 

It is built ground up with [no external dependency](https://snyk.io/test/github/winkjs/wink-nlp?tab=dependencies) and has a [lean code base of ~10Kb minified & gzipped](https://bundlephobia.com/package/wink-nlp). A test coverage of [~100%](https://coveralls.io/github/winkjs/wink-nlp?branch=master) and compliance with the [Open Source Security Foundation best practices](https://bestpractices.coreinfrastructure.org/en/projects/6035) make winkNLP the ideal tool for building production grade systems with confidence.

WinkNLP with full [Typescript support](https://github.com/winkjs/wink-nlp/blob/master/types/index.d.ts), runs on Node.js, [web browsers](https://github.com/winkjs/wink-nlp#how-to-install-for-web-browser) and [Deno](https://github.com/winkjs/wink-nlp#how-to-run-on-deno).

## Build amazing apps quickly
| [Wikipedia article timeline](https://observablehq.com/@winkjs/how-to-visualize-timeline-of-a-wiki-article) | [Context aware word cloud](https://observablehq.com/@winkjs/how-to-create-a-context-aware-word-cloud) | [Key sentences detection](https://observablehq.com/@winkjs/how-to-visualize-key-sentences-in-a-document) |
| --- | --- | --- |
| [<img src="https://user-images.githubusercontent.com/29990/202497363-19c30578-8146-4f36-9c4b-4de613610837.png">](https://observablehq.com/@winkjs/how-to-visualize-timeline-of-a-wiki-article)| [<img src="https://user-images.githubusercontent.com/29990/202506181-1a926ee0-788f-4aa1-aeac-a097f09fe747.png">](https://observablehq.com/@winkjs/how-to-create-a-context-aware-word-cloud)|[<img src="https://user-images.githubusercontent.com/29990/202506490-7f999d12-8319-4969-b92b-0649559ffbe6.png">](https://observablehq.com/@winkjs/how-to-visualize-key-sentences-in-a-document)|

Head to  [live examples](https://winkjs.org/examples.html) to explore further.

## Blazing fast
WinkNLP can easily process large amount of raw text at speeds over **650,000 tokens/second**&nbsp; on a M1 Macbook Pro in both browser and Node.js environments. It even runs smoothly on a low-end smartphone's browser.

| Environment | Benchmarking Command |
|--- | --- |
| Node.js | [node benchmark/run](https://github.com/winkjs/wink-nlp/tree/master/benchmark) |
| Browser | [How to measure winkNLP's speed on browsers?](https://observablehq.com/@winkjs/how-to-measure-winknlps-speed-on-browsers) |

## Features
WinkNLP has a [comprehensive natural language processing (NLP) pipeline](https://winkjs.org/wink-nlp/processing-pipeline.html) covering tokenization, sentence boundary detection (sbd), negation handling, sentiment analysis, part-of-speech (pos) tagging, named entity recognition (ner), custom entities recognition (cer). It offers a rich feature set:

<table>
<tr><td width="330px;">🐎 Fast, lossless & multilingual tokenizer </td><td>For example, the multilingual text string <b><code style="font-size: 0.9em">"¡Hola! नमस्कार! Hi! Bonjour chéri"</code></b>  is tokenized as <code style="font-size: 0.9em">["¡", "Hola", "!", "नमस्कार", "!", "Hi", "!", "Bonjour", "chéri"]</code>.  The tokenizer processes text at a speed close to <b>4 million</b> tokens/second on a M1 MBP's browser.</td></tr>
<tr><td>✨ Developer friendly and intuitive <a href="https://winkjs.org/wink-nlp/getting-started.html">API</a></td><td>With winkNLP, process any text using a simple, declarative syntax; most <a href="https://observablehq.com/@winkjs/how-to-build-a-naive-wikification-tool?collection=@winkjs/winknlp-recipes">live examples</a> have <b>30-40</b> lines of code.</td></tr>
<tr><td>🖼 Best-in-class <a href="https://winkjs.org/wink-nlp/visualizing-markup.html">text visualization</a></td><td>Programmatically <b><a href="https://winkjs.org/wink-nlp/markup.html">mark</a></b> tokens, sentences, entities, etc. using HTML mark or any other tag of your choice.</td></tr>
<tr><td>♻️ Extensive text processing features</td><td>Remove and/or retain tokens with specific attributes such as part-of-speech, named entity type, token type, stop word, shape and many more; compute Flesch reading ease score; generate n-grams; normalize, lemmatise or stem. Checkout how with the right kind of text preprocessing, even <a href="https://github.com/winkjs/wink-naive-bayes-text-classifier#readme">Naive Bayes classifier</a> achieves <b>impressive (≥90%)</b> accuracy in sentiment analysis and chatbot intent classification tasks.</td></tr>
<tr><td>🔠 Pre-trained <a href="https://winkjs.org/wink-nlp/language-models.html">language models</a></td><td>Compact sizes starting from <a href="https://bundlephobia.com/package/wink-eng-lite-web-model">~1MB (minified & gzipped)</a> – reduce model loading time drastically down to ~1 second on a 4G network.</td></tr>
<tr><td>💼 Host of <a href="https://winkjs.org/wink-nlp/its-as-helper.html">utilities & tools</a></td><td>BM25 vectorizer; Several similarity methods – Cosine, Tversky, Sørensen-Dice, Otsuka-Ochiai; Helpers to get bag of words, frequency table, lemma/stem, stop word removal and many more.</td></tr>
</table>


> WinkJS also has packages like [Naive Bayes classifier](https://github.com/winkjs/wink-naive-bayes-text-classifier), [multi-class averaged perceptron](https://github.com/winkjs/wink-perceptron) and [popular token and string distance methods](https://github.com/winkjs/wink-distance), which complement winkNLP.


## Documentation
- [Concepts](https://winkjs.org/wink-nlp/getting-started.html) — everything you need to know to get started.
- [API Reference](https://winkjs.org/wink-nlp/read-doc.html) — explains usage of APIs with examples.
- [Change log](https://github.com/winkjs/wink-nlp/blob/master/CHANGELOG.md) — version history along with the details of breaking changes, if any.
- [Examples](https://winkjs.org/examples.html) — live examples with code to give you a head start.

## Installation

Use [npm](https://www.npmjs.com/package/wink-nlp) install:

```shell
npm install wink-nlp --save
```

In order to use winkNLP after its installation, you also need to install a language model according to the node version used. The table below outlines the version specific installation command:

| Node.js Version |Installation |
| --- | --- |
| 16 or 18 | `npm install wink-eng-lite-web-model --save` |
| 14 or 12 | `node -e "require('wink-nlp/models/install')"` |

The [wink-eng-lite-web-model](https://github.com/winkjs/wink-eng-lite-web-model) is designed to work with Node.js version 16 or 18. It can also work on browsers as described in the next section. This is the **recommended** model.

The second command installs the [wink-eng-lite-model](https://github.com/winkjs/wink-eng-lite-model), which works with Node.js version 14 or 12. 

### How to configure TypeScript project

Enable [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) and [`allowSyntheticDefaultImports`](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) in the `tsconfig.json` file:

```
"compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    ...
}
```

### How to install for Web Browser
If you’re using winkNLP in the browser use the [wink-eng-lite-web-model](https://www.npmjs.com/package/wink-eng-lite-web-model). Learn about its installation and usage in our [guide to using winkNLP in the browser](https://winkjs.org/wink-nlp/wink-nlp-in-browsers.html). Explore **[winkNLP recipes](https://observablehq.com/collection/@winkjs/winknlp-recipes)** on [Observable](https://observablehq.com/) for live browser based examples.

### How to run on [Deno](https://deno.land/)
Follow the [example on replit](https://replit.com/@sanjayaksaxena/wink-nlp-deno-example#index.ts).

### Get started
Here is the "Hello World!" of winkNLP:

```javascript
// Load wink-nlp package.
const winkNLP = require( 'wink-nlp' );
// Load english language model.
const model = require( 'wink-eng-lite-web-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );
// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;
 
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
Experiment with winkNLP on [RunKit](https://npm.runkit.com/wink-nlp).

## Speed & Accuracy
The [winkNLP](https://winkjs.org/wink-nlp/) processes raw text at **~650,000 tokens per second** with its [wink-eng-lite-web-model](https://github.com/winkjs/wink-eng-lite-web-model), when [benchmarked](https://github.com/bestiejs/benchmark.js) using "Ch 13 of Ulysses by James Joyce" on a M1 Macbook Pro machine with 16GB RAM. The processing included the entire NLP pipeline — tokenization, sentence boundary detection, negation handling, sentiment analysis, part-of-speech tagging, and named entity extraction. This speed is way ahead of the prevailing speed benchmarks.

The benchmark was conducted on [Node.js versions 16, and 18](https://nodejs.org/en/about/releases/).

It pos tags a subset of WSJ corpus with an accuracy of **~95%** — this includes *tokenization of raw text prior to pos tagging*. The present state-of-the-art is at ~97% accuracy but at lower speeds and is generally computed using gold standard pre-tokenized corpus.

Its general purpose sentiment analysis delivers a [f-score](https://en.wikipedia.org/wiki/F1_score) of **~84.5%**, when validated using Amazon Product Review [Sentiment Labelled Sentences Data Set](https://archive.ics.uci.edu/ml/machine-learning-databases/00331/) at [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php). The current benchmark accuracy for **specifically trained** models can range around 95%.

## Memory Requirement
Wink NLP delivers this performance with the minimal load on RAM. For example, it processes the entire [History of India Volume I](https://en.wikisource.org/wiki/History_of_India/Volume_1) with a total peak memory requirement of under **80MB**. The book has around 350 pages which translates to over 125,000 tokens.


## Need Help?

### Usage query 👩🏽‍💻
Please ask at [Stack Overflow](https://stackoverflow.com/) or discuss at [Wink JS GitHub Discussions](https://github.com/winkjs/wink-nlp/discussions) or chat with us at [Wink JS Gitter Lobby](https://gitter.im/winkjs/Lobby).

### Bug report 🐛
If you spot a bug and the same has not yet been reported, raise a new [issue](https://github.com/winkjs/wink-nlp/issues) or consider fixing it and sending a PR.

### New feature 🌟
Looking for a new feature, request it via the [new features & ideas](https://github.com/winkjs/wink-nlp/discussions/categories/new-features-ideas) discussion forum  or consider becoming a [contributor](https://github.com/winkjs/wink-nlp/blob/master/CONTRIBUTING.md).


## About winkJS
[WinkJS](https://winkjs.org/) is a family of open source packages for **Natural Language Processing**, **Machine Learning**, and **Statistical Analysis** in NodeJS. The code is **thoroughly documented** for easy human comprehension and has a **test coverage of ~100%** for reliability to build production grade solutions.

## Copyright & License

**Wink NLP** is copyright 2017-23 [GRAYPE Systems Private Limited](https://graype.in/).

It is licensed under the terms of the MIT License.
