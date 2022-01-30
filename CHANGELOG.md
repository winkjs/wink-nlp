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
