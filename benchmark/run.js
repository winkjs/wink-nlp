var Benchmark = require( 'benchmark' );

var fs = require( 'fs' );

var winkNLP = require( '../src/wink-nlp.js' );
var model = require( '../test/test-model/model.js' );
var nlp = winkNLP( model );

var s1 = fs.readFileSync( './benchmark/jj-ch13.txt', 'utf8' ); // eslint-disable-line no-sync

if ( process.argv[ 2 ] ) {
  var examples = [
    { name: 'ADJ-NOUN', patterns: [ 'ADJ NOUN' ] }
  ];

  nlp.learnCustomEntities( examples );

  console.log( '\nAdding custom entities detection to the pipe.\n' );
}

var suite = new Benchmark.Suite();
console.log( '\nNLP Pipe in use: Tokenizer, SBD, Negation, NER, Sentiment, POS' ); // eslint-disable-line no-console
console.log( 'Processing Ch 13 of Ulysses by James Joyce:\n' ); // eslint-disable-line no-console
// add tests
suite.add('\n\t(i) James Joyce (20467 tokens)\t', function ( ) {
  nlp.readDoc( s1 );
})
// add listeners
.on( 'cycle', function ( event ) {
  console.log( String( event.target ) ); // eslint-disable-line no-console
})
.on( 'complete', function ( ) {
  console.log( '\nBenchmark completed!\n'); // eslint-disable-line no-console
})
// run async
.run( { 'async': false } );

const perf = Math.round( nlp.readDoc( s1 ).tokens().length() / suite[ 0 ].stats.mean );

console.log( `Performance: ${perf} tokens/second.\n` );
