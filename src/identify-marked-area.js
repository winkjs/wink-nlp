const identifyMarkedArea = function ( mark, length ) {
  // Length Minus 1.
  const lm1 = length - 1;
  let [ firstIndex, lastIndex ] = mark;

  if ( firstIndex < 0 ) firstIndex += length;
  firstIndex = Math.max( firstIndex, 0 );
  if ( firstIndex > lm1 ) firstIndex = 0;

  if ( lastIndex < 0 ) lastIndex += length;
  lastIndex = Math.min( lastIndex, lm1 );
  if ( lastIndex < firstIndex ) lastIndex = lm1;

  return [ firstIndex, lastIndex ];
}; // identifyMarkedArea()

module.exports = identifyMarkedArea;
