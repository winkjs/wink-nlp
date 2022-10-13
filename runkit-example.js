// Load wink-nlp package.
const winkNLP = require( 'wink-nlp' );
// Load english language model — light version.
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
