//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp language models”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions =
//
//     The above copyright notice and this permission notice
//     shall be included in all copies or substantial
//     portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//     ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//     TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//     PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//     THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
//     CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//     CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//     DEALINGS IN THE SOFTWARE.

//

/* eslint complexity: ["error", 24] */
const hintDelta = 1080000;
const transformers = new Array( 3 );
// NER Hint constants
const $numeric_year = 45; // eslint-disable-line camelcase
const $numeric_value = 46; // eslint-disable-line camelcase
const $ordinal_value = 47; // eslint-disable-line camelcase
const $time = 48; // eslint-disable-line camelcase
const $date = 49; // eslint-disable-line camelcase
const $tab_crlf = 50; // eslint-disable-line camelcase
const $time_hh_mm = 51; // eslint-disable-line camelcase
const $email = 52; // eslint-disable-line camelcase
const $emoji = 53; // eslint-disable-line camelcase
const $emoticon = 54; // eslint-disable-line camelcase
const $hashtag = 55; // eslint-disable-line camelcase
const $mention = 56; // eslint-disable-line camelcase
const $url = 57; // eslint-disable-line camelcase
// Numeric date regexes.
var rgxDDMMYY = /^(?:0?[1-9]|[12]\d|30|31)[/.-](?:0?[1-9]|1[0-2])(?:[/.-]([12]\d)?\d\d)$/;
var rgxMMDDYY = /^(?:0?[1-9]|1[0-2])[/.-](?:0?[1-9]|[12]\d|30|31)(?:[/.-]([12]\d)?\d\d)$/;
var rgxISODate = /^(?:[12]\d\d\d)[/.-](?:0?[1-9]|1[0-2])[/.-](?:0?[1-9]|[12]\d|30|31)$/;
// Numeric time regexes.
var rgxHHMM = /^(?:\d|[01]\d|2[0-3]):(?:\d|[0-5][0-9])$/;
// To avoid number false positives inn a token due to period/comma.
var rgxPeriodComma = /[,.]/g;
// To allow comma in a number before decimal sign.
var rgxCommaB4Period = /,(?=.*?\.)/g;
var rgxComma = /,/g;
var rgxPeriod = /\./;

var transformNumber = function ( tv, token ) {
  // Replace all commas by nothing before the period sign.
  var num = +( ( rgxPeriod.test( tv ) ) ? tv.replace( rgxCommaB4Period, '' ) : tv.replace( rgxComma, '') );
  if ( isNaN( num ) ) {
    // Check for fractions i.e. `1/2` — numerator and denominator both should numbers with any commas.
    const splitTV = tv.split( '/' );
    if ( ( splitTV.length === 2 ) &&  !isNaN( splitTV[ 0 ] ) && !isNaN( splitTV[ 1 ] ) ) return hintDelta + $numeric_value; // eslint-disable-line camelcase
    // Otherwise look for possible date/time.
    if ( rgxDDMMYY.test( tv ) ) return hintDelta + $date;
    if ( rgxMMDDYY.test( tv ) ) return hintDelta + $date;
    if ( rgxISODate.test( tv ) ) return hintDelta + $date;
    if ( rgxHHMM.test( tv ) ) return hintDelta + $time_hh_mm; // eslint-disable-line camelcase
    return token;
  }

  // Note tv equals (but not exactly!) means it des not contain comma and therefore it is possibly a year.
  if ( num >= 1200 && num <= 2100 && tv == num ) return hintDelta + $numeric_year; // eslint-disable-line camelcase
  return hintDelta + $numeric_value; // eslint-disable-line camelcase
}; // processNumber()


// First Pass
transformers[ 0 ] = function ( token, cache ) {
  const tv = cache.value(token);
  // NOTE: `tv` can be undefined if the incoming `token` has been swapped by
  // an intermediate entity detected in the previous pass. Therefore if it is
  // `undefined` let it passthru.
  if ( tv === undefined ) return token;
  // Means `tv` has a defined value implying that it is a true token.
  if ( tv === '\n' || tv === '\n\n' || tv.replace( rgxPeriodComma, '' ) === '' ) return token;
  var mapped = cache.property( token, 'nerHint' );
  if ( mapped ) return mapped + hintDelta;
  var tokenType = cache.property( token, 'tokenType' );
  switch ( tokenType ) {
    case 'number':
      return transformNumber( tv, token );

    case 'ordinal':
      return hintDelta + $ordinal_value; // eslint-disable-line camelcase

    case 'time':
      return hintDelta + $time; // eslint-disable-line camelcase

    case 'tabCRLF':
      return hintDelta + $tab_crlf; // eslint-disable-line camelcase

    case 'email':
      return hintDelta + $email; // eslint-disable-line camelcase

    case 'emoji':
      return hintDelta + $emoji; // eslint-disable-line camelcase

    case 'emoticon':
      return hintDelta + $emoticon; // eslint-disable-line camelcase

    case 'hashtag':
      return hintDelta + $hashtag; // eslint-disable-line camelcase

    case 'mention':
      return hintDelta + $mention; // eslint-disable-line camelcase

    case 'url':
      return hintDelta + $url; // eslint-disable-line camelcase

    default:
      return token;
  }
};

transformers[ 1 ] = undefined;
transformers[ 2 ] = undefined;
// transformers[ 2 ] = ( token, cache ) => ( console.log( cache.value( token ) ) );

module.exports = transformers;
