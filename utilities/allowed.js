var its = require( '../src/its.js' );

var allowed = Object.create( null );

allowed.its4BM25 = new Set( [
  its.terms,
  its.idf,
  its.docTermMatrix,
  its.docBOWArray,
  its.modelJSON
] );

allowed.its4BM25Doc = new Set( [
  its.tf,
  its.vector,
  its.bow
] );

module.exports = allowed;
