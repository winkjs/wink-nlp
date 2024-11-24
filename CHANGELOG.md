# [Fixed some type definitions](https://github.com/winkjs/wink-nlp/releases/tag/2.3.1)
## Version 2.3.1 Nov 24, 2024

### 🐛 Fixes
- Updated some BM25Vectorizer methods types according to implementation — thanks to @pavloDeshko ✅

# [Enabled more special space characters handling](https://github.com/winkjs/wink-nlp/releases/tag/2.3.0)
## Version 2.3.0 May 19, 2024

### ✨ Features
- Detokenization now restores em/en, third/quarter, thin/hair, medium math space characters & narrow non breaking space characters besides the regular nbsp. 👏 🙌 🛰️

# [Improved error handling in contextual vectors](https://github.com/winkjs/wink-nlp/releases/tag/2.2.2)
## Version 2.2.2 May 08, 2024

### ✨ Features
- `.contextualVectors()` now throws error if (a) word vectors are not loaded and (b) with `lemma: true`, "pos" is missing in the NLP pipe. 🤓

### 🐛 Fixes
- Refined typescript definitions further. ✅


# [Added missing typescript definitions](https://github.com/winkjs/wink-nlp/releases/tag/2.2.1)
## Version 2.2.1 May 06, 2024

### 🐛 Fixes
- Added missing typescript definitions for word embeddings besides few other typescript fixes. ✅

# [Added non-breaking space handling capabilities](https://github.com/winkjs/wink-nlp/releases/tag/2.2.0)
## Version 2.2.0 April 03, 2024


### ✨ Features
- Detokenization restores both regular and non-breaking spaces to their original positions. 🤓

# [Introducing cosine similarity for word vectors](https://github.com/winkjs/wink-nlp/releases/tag/2.1.0)
## Version 2.1.0 March 24, 2024

### ✨ Features
- You can now use `similarity.vector.cosine( vectorA, vectorB )` to compute similarity between two vectors on a scale of 0 to 1. 🤓


# [Word embeddings have arrived!](https://github.com/winkjs/wink-nlp/releases/tag/2.0.0)
## Version 2.0.0 March 24, 2024

### ✨ Features
- Seamless word embedding integration enhances winkNLP's semantic capabilities. 🎉 👏 🙌
- Pre-trained 100-dimensional word embeddings for over 350,000 English words released: [wink-embeddings-sg-100d](https://github.com/winkjs/wink-embeddings-sg-100d). 💯
- API remains unchanged — no code updates needed for existing projects. The new APIs include: 🤩
	- **Obtain vector for a token:** Use the `.vectorOf( token )` API.
	- **Compute sentence/document embeddings:** Employ the `as.vector` helper: use `.out( its.lemma, as.vector )` on tokens of a sentence or document. You can also use `its.value` or `its.normal`. Tokens can be pre-processed to remove stop words etc using the `.filter()` API. Note, the `as.vector` helper uses averaging technique.
	- **Generate contextual vectors:** Leverage the `.contextualVectors()` method on a document. Useful for pure browser-side applications! Generate custom vectors contextually relevant to your corpus and use them in place of larger pre-trained wink embeddings.
- Comprehensive documentation along with interesting examples is coming up shortly. Stay tuned for updates! 😎


# [Added Deno example](https://github.com/winkjs/wink-nlp/releases/tag/1.14.3)
## Version 1.14.3 July 21, 2023

### ✨ Features
- Added a live example for how to run winkNLP on Deno. 👍

# [Fixed a bug](https://github.com/winkjs/wink-nlp/releases/tag/1.14.2)
## Version 1.14.2 July 1, 2023

### 🐛 Fixes
- Paramteters in `markup()` are optional now in TS code — squashed a [typescript declaration bug](https://github.com/winkjs/wink-nlp/commit/e6314658766cfa4d40f96b89c211d2d98358cfae). 🙌

# [Squashed a bug](https://github.com/winkjs/wink-nlp/releases/tag/1.14.1)
## Version 1.14.1 June 11, 2023

### 🐛 Fixes
- Fixed a [typescript declaration](https://github.com/winkjs/wink-nlp/commit/0ad0690e93f59397dbdde7b876f60c2e5875215b). ✅

# [Introducing helper for extracting important sentences from a document](https://github.com/winkjs/wink-nlp/releases/tag/1.14.0)
## Version 1.14.0 May 20, 2023

### ✨ Features
- You can now use `its.sentenceWiseImprotance` helper to obtain sentence wise importance (on a scale of 0 to 1) of a document, if it is supported by language model. 📚📊🤓
- Checkout live example [How to visualize key sentences in a document?](https://observablehq.com/@winkjs/how-to-visualize-key-sentences-in-a-document) 👀

# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.13.1)
## Version 1.13.1 March 27, 2023

### ⚙️ Updates
- Some behind the scene model improvements. 😎 🤓
- Add clarity on typescript configuration in README. ✅

# [Improving mark's functionality in custom entities](https://github.com/winkjs/wink-nlp/releases/tag/1.13.0)
## Version 1.13.0 December 09, 2022

### ✨ Features
- Mark allows marking w.r.t. the last element of the pattern. For example if a pattern matches `a fluffy cat` then `mark: [-2, -1]` will extract `fluffy cat` — especially useful when the match length is unknown. 💃
- Improved error handling while processing mark's arguments.  🙌


# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.12.3)
## Version 1.12.3 November 18, 2022

### ⚙️ Updates
- README is now more informative and links to examples and benchmarks 👍
- Benchmarked on latest machine, browser versions 🖥


# [Ready for Node.js version 18](https://github.com/winkjs/wink-nlp/releases/tag/1.12.2)
## Version 1.12.2 October 13, 2022

### 🐛 Fixes
- Fixed incorrect install command in README ✅

# [Ready for Node.js version 18](https://github.com/winkjs/wink-nlp/releases/tag/1.12.1)
## Version 1.12.1 October 13, 2022

### ⚙️ Updates
- Ready for future — we have tested winkNLP on Node.js version 18 including its models. 🙌 🎉

# [Some enhancements plus earned OpenSSF best practices passing badge](https://github.com/winkjs/wink-nlp/releases/tag/1.12.0)
## Version 1.12.0 May 13, 2022

### ✨ Features
- winkNLP earned [Open Source Security Foundation (OpenSSF) Best Practices passing badge](https://bestpractices.coreinfrastructure.org/en/projects/6035). 🎉 👏 🙌
- `.bowOf()` api of [BM25Vectorizer](https://winkjs.org/wink-nlp/bm25-vectorizer.html) now supports processing of OOV tokens — useful for cosine similarity computation. 😎
- [Document](https://winkjs.org/wink-nlp/document.html) has a new API — `.pipeConfig()` to inquire the active processing pipeline.

# [Enhancing custom entities & BM25Vectorizer](https://github.com/winkjs/wink-nlp/releases/tag/1.11.0)
## Version 1.11.0 January 30, 2022

### ✨ Features
- Obtain bag-of-words for a tokenized text from BM25Vectorizer using `.bowOf()` api — useful for bow based [similarity](https://winkjs.org/wink-nlp/similarity.html) computation. 👍
- [`learnCustomEntities()`](https://winkjs.org/wink-nlp/learn-custom-entities.html) displays a console warning, if a complex [short hand pattern](https://winkjs.org/wink-nlp/custom-entities.html) is likely to cause learning/execution slow down.🤞❗️


# [Enabling loading of BM25Vectorizer model](https://github.com/winkjs/wink-nlp/releases/tag/1.10.0)
## Version 1.10.0 November 18, 2021

### ✨ Features
- Easily load BM25Vectorizer's model using newly introduced `.loadModel()` api. 🎉


# [Enhancing Typescript support](https://github.com/winkjs/wink-nlp/releases/tag/1.9.0)
## Version 1.9.0 November 06, 2021

### ✨ Features
- We have enhanced typescript support to allow easy addition of new typescript enabled language models. 👏

### ⚙️ Updates
- Added naive wikification showcase in README. 😎

# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.8.1)
## Version 1.8.1 September 22, 2021

### ⚙️ Updates
- Included NLP Pipe details in the README file. 🤓

# [Introducing Typescript support](https://github.com/winkjs/wink-nlp/releases/tag/1.8.0)
## Version 1.8.0 July 31, 2021

### ✨ Features
- We have added support for Typescript. 🙌🎉


# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.7.2)
## Version 1.7.2 July 15, 2021

### ⚙️ Updates
- Some behind the scene updates & fixes. 😎🤓


# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.7.1)
## Version 1.7.1 July 09, 2021

### ⚙️ Updates
- Improved documentation. 📚🤓


# [Adding more similarity methods & an as helper](https://github.com/winkjs/wink-nlp/releases/tag/1.7.0)
## Version 1.7.0 July 01, 2021

### ✨ Features
- Now supported similarity methods are cosine for bag of words, tversky & Otsuka-Ochiai (oo) for set. 🙌
- Obtain JS set via `as.set` helper. 😇


# [Enabling configurable annotation pipeline](https://github.com/winkjs/wink-nlp/releases/tag/1.6.0)
## Version 1.6.0 June 27, 2021

### ✨ Features
- No need to run the entire annotation pipeline, now you can select whatever you want or just even run tokenization by specifying an empty pipe. 🤩🎉


# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.5.0)
## Version 1.5.0 June 22, 2021

### ⚙️ Updates
- Exposed `its` and `as` helpers via the instance of winkNLP as well. 🤓


# [Introducing cosine similarity & readability stats helper](https://github.com/winkjs/wink-nlp/releases/tag/1.4.0)
## Version 1.4.0 June 15, 2021

### ✨ Features
- Cosine similarity is available on Bag of Words. 🛍🔡🎉
- You can now use `its.readabilityStats` helper to obtain document's readability statistics, if it is supported by language model. 📚📊🤓


# [Adding long pending lemmatizer support](https://github.com/winkjs/wink-nlp/releases/tag/1.3.0)
## Version 1.3.0 May 22, 2021

### ✨ Features
- Now use `its.lemma` helper to obtain lemma of words. 👏 🎉


# [Introducing support for browser ready language model](https://github.com/winkjs/wink-nlp/releases/tag/1.2.0)
## Version 1.2.0 December 24, 2020

### ✨ Features
- We have added support for browser ready language model. 🤩 🎉
- Now easily vectorize text using bm25-based vectroizer. 🤓 👏

#
### ⚙️ Updates
- Examples in README now runs on [RunKit](https://npm.runkit.com/wink-nlp) using web model! ✅

# [Enabling add-ons to support new language model ](https://github.com/winkjs/wink-nlp/releases/tag/1.1.0)
## Version 1.1.0 September 18, 2020

### ✨ Features
- We have enabled add-ons to support enhanced language models, paving way for new `its` helpers. 🎉
- Now use [`its.stem`](https://winkjs.org/wink-nlp/its-as-helper.html) helper to obtain stems of the words using Porter Stemmer Algorithm V2. 👏

# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/1.0.1)
## Version 1.0.1 August 24, 2020

### ⚙️ Updates
- Benchmarked on Node.js v12 & v14 also and updated the speed to minimum observed. 🏃‍♀️

# [Announcing the stable version 1.0.0](https://github.com/winkjs/wink-nlp/releases/tag/1.0.0)
## Version 1.0.0 August 21, 2020

### ⚙️ Updates
- Happy to release version 1.0.0 for you! 💫👏
- You can optionally include custom entity detection while running speed benchmark. 😇

# [Operational update](https://github.com/winkjs/wink-nlp/releases/tag/0.4.0)
## Version 0.4.0 August 9, 2020

### ⚙️ Updates
- Getting ready to move to version 1.0.0 — almost there! 💫

# [Operational updates](https://github.com/winkjs/wink-nlp/releases/tag/0.3.1)
## Version 0.3.1 August 3, 2020

### ⚙️ Updates
- Some behind the scene updates to test cases. 😎
- Updated the version of English light language model to the latest — 0.3.0. 🙌

# [Simplified language model installation](https://github.com/winkjs/wink-nlp/releases/tag/0.3.0)
## Version 0.3.0 July 29, 2020

### ✨ Features
- No need to remember or copy/paste long Github url for language model installation. The new script installs the latest version for you automatically. 🎉


# [Improved custom entities](https://github.com/winkjs/wink-nlp/releases/tag/0.2.0)
## Version 0.2.0 July 21, 2020

### ✨ Features
- We have added `.parentCustomEntity()` API to `.tokens()` API. 👏

#
### 🐛 Fixes
- Accessing custom entities was failing whenever there were no custom entities. Now things are as they should be — it tells you that there are none! ✅



# [Improved interface with language model](https://github.com/winkjs/wink-nlp/releases/tag/0.1.0)
## Version 0.1.0 June 24, 2020

### ✨ Features
- We have improved interface with the language model — now supports the new format. 👍
