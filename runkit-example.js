const winkNLP = require( 'wink-nlp' );
const its = require( 'wink-nlp/src/its.js' );
// Use web model for RunKit.
const model = require( 'wink-eng-lite-web-model' );
const nlp = winkNLP( model );

const text = 'Its quarterly profits jumped 76% to $1.13 billion for the three months to December, from $639million of previous year.';
const doc = nlp.readDoc( text );
// Print tokens.
console.log( doc.tokens().out() );
// Print each token's type.
console.log( doc.tokens().out( its.type ) );
// Print details of each entity.
console.log( doc.entities().out( its.detail ) );
// Markup entities along with their type for highlighting them in the text.
doc.entities().each( ( e ) => {
  e.markup( '<mark>', `<sub style="font-weight:900"> ${e.out(its.type)}</sub></mark>` );
} );
// Render them as HTML via RunKit
doc.out( its.markedUpText );
