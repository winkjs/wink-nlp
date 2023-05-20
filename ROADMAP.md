# Roadmap 🧭
With winkNLP's production ready release in late 2020, the core is already in place. Apart from sustainment, our goal is to continuously improve it by adding new features and capabilities. We have listed some of the features that should be added to winkNLP:

|S. No.| Feature | Complexity |Status|
|---|---|---|---|
|01.|**Extractive Summarization**:<br/> Add `its.sentenceWiseImprotance` helper to extract sentence wise impotance from a document. This may be used for extractive summarization apart from other usage. While it should be language agnostic, but it should leverage loaded language model's capability to improve summarization.| Simple | [Completed](https://observablehq.com/@winkjs/how-to-visualize-key-sentences-in-a-document) |
|02.|**Text Pre-processor**:<br/>Add a text preprocessing utility that provides options to (a) filter specific tokens based on their properties such as `pos`, `isStopWordFlag`, and `type`; (b) map entity type with a definable keyword; (c) add bigrams & trigrams and (d) inject sentiment. The API should follow winkNLP style and standards.|Medium|YTS|
|03.|**Word Vectors Integration**:<br/>Add integration with various word vectors starting with GloVe. This should include compression/decompression for fast loading, helpers for token, sentence and document vector computation. |High|WIP|
|04.|**Sub-word Tokenizer**:<br/>Add sub-word tokenization feature using techniques like Byte Pair Encoding (BPE) and/or WordPiece. The processing pipeline should allow choice of tokenizer.|Very High|YTS|
|05.|**Compose Corpus**:<br/>Add a utility to produce training corpus using patterns and cartesian product.|Simple|YTS|
|06.|**Keywords Extraction**:<br/>Add `its.keywords` helper to extract keywords/keyphrases from the text via `doc.out( its.keywords )`. While it should be language agnostic, but it should leverage loaded language model's capability to improve extraction.| Simple | YTS |
|07.|**BM25 Vectorizer**:<br/>Add a utility to train and also vectorize text based on an already trained BM25 model. It will follow wink-nlp styled API. |Medium|[Completed](https://github.com/winkjs/wink-nlp/discussions/22)|
|08.|**Constituency/Dependency Parser**:<br/>Add a constituency and/or dependency parser — details have to be worked out.|Very High|YTS|

The above is intended to serve as a guideline for users and [contributors](https://github.com/winkjs/wink-nlp/blob/master/CONTRIBUTING.md) for information, feedback and possible [participation & discussion](https://github.com/winkjs/wink-nlp/discussions/categories/new-features-ideas).
