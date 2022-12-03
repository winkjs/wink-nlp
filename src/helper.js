//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions:
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

var helper = Object.create( null );

/**
 * Tests if argument `v` is a JS object.
 *
 * @param {*} v       is tested for a valid JS object.
 * @returns {boolean} ture if `v` is a valid JS object, otherwise false.
 */
helper.isObject = function ( v ) {
  return ( Object.prototype.toString.call( v ) === '[object Object]' );
}; // isObject()

/**
 * Tests if argument `v` is a JS array.
 *
 * @param {*} v       is tested for a valid JS array.
 * @returns {boolean} ture if `v` is a valid JS array, otherwise false.
 */
helper.isArray = function ( v ) {
  return ( Object.prototype.toString.call( v ) === '[object Array]' );
}; // isArray()

/**
 * Tests if argument `n` is a finite integer.
 *
 * @param {*} n       is tested for a finite integer.
 * @returns {boolean} ture if `n` is a finite integer, otherwise false.
 */
helper.isFiniteInteger = function ( n ) {
  return (
    ( typeof n === 'number' ) &&
    !isNaN( n ) &&
    isFinite( n ) &&
    ( n === Math.round( n ) )
  );
}; // isFiniteInteger()

module.exports = helper;
