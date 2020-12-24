/**
 * Stable sort function for frequency table i.e. `[ [ term, frequency ] ... ]`.
 * It first sorts on the frequency and then an alpha-numeric sort on term.
 *
 * @param  {array}  a first term-frequency pair element sent by sort.
 * @param  {array}  b second term-frequency pair element sent by sort.
 * @return {number}   number: -1 or 0 or +1.
 */
module.exports = ( a, b ) => {
  if ( b[ 1 ] > a[ 1 ] ) {
    return 1;
  } else if ( b[ 1 ] < a[ 1 ] ) {
           return -1;
         } else if ( a[ 0 ] > b[ 0 ] ) return 1;
  return -1;
};
