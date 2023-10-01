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

// This is inspired by
// [NLTK implementation](https =//github.com/nltk/nltk_contrib/blob/master/nltk_contrib/readability/syllables_en.py).
//


/* --- enable caching --- */

const rgx = /[^aeiouy]+/;
const exceptions = Object.create( null );

exceptions.adobe = 3;
exceptions.anemone = 4;
exceptions.anyone = 3;
exceptions.apache = 3;
exceptions.aphrodite = 4;
exceptions.apostrophe = 4;
exceptions.ariadne = 4;
exceptions.chummed = 1;
exceptions.cafe = 2;
exceptions.calliope = 4;
exceptions.catastrophe = 4;
exceptions.chile = 2;
exceptions.chloe = 2;
exceptions.circe = 2;
exceptions.coyote = 3;
exceptions.daphne = 2;
exceptions.epitome = 4;
exceptions.eurydice = 4;
exceptions.euterpe = 3;
exceptions.every = 2;
exceptions.everywhere = 3;
exceptions.forever = 3;
exceptions.gethsemane = 4;
exceptions.guacamole = 4;
exceptions.hermione = 4;
exceptions.hyperbole = 4;
exceptions.jesse = 2;
exceptions.jukebox = 2;
exceptions.karate = 3;
exceptions.peeped = 1;
exceptions.moustaches = 2;
exceptions.shamefully = 3;
exceptions.messieurs = 2;
exceptions.satiated = 4;
exceptions.sailmaker = 4;
exceptions.sheered = 1;
exceptions.disinterred = 3;
exceptions.propitiatory = 6;
exceptions.bepatched = 2;
exceptions.particularized = 5;
exceptions.caressed = 2;
exceptions.trespassed = 2;
exceptions.sepulchre = 3;
exceptions.flapped = 1;
exceptions.hemispheres = 3;
exceptions.pencilled = 2;
exceptions.motioned = 2;
exceptions.machete = 3;
exceptions.maybe = 2;
exceptions.naive = 2;
exceptions.newlywed = 3;
exceptions.penelope = 4;
exceptions.people = 2;
exceptions.persephone = 4;
exceptions.phoebe = 2;
exceptions.pulse = 1;
exceptions.queue = 1;
exceptions.recipe = 3;
exceptions.riverbed = 3;
exceptions.sesame = 3;
exceptions.shoreline = 2;
exceptions.simile = 3;
exceptions.snuffleupagus = 5;
exceptions.sometimes = 2;
exceptions.syncope = 3;
exceptions.poleman = 2;
exceptions.slandered = 2;
exceptions.sombre = 2;
exceptions.etc = 4;
exceptions.sidespring = 2;
exceptions.mimes = 1;
exceptions.effaces = 2;
exceptions.mr = 2;
exceptions.mrs = 2;
exceptions.ms = 1;
exceptions.dr = 2;
exceptions.st = 1;
exceptions.sr = 2;
exceptions.jr = 2;
exceptions.truckle = 2;
exceptions.foamed = 1;
exceptions.fringed = 2;
exceptions.clattered = 2;
exceptions.capered = 2;
exceptions.mangroves = 2;
exceptions.suavely = 2;
exceptions.reclined = 2;
exceptions.brutes = 1;
exceptions.effaced = 2;
exceptions.quivered = 2;
exceptions.veriest = 3;
exceptions.sententiously = 4;
exceptions.deafened = 2;
exceptions.manoeuvred = 3;
exceptions.unstained = 2;
exceptions.gaped = 1;
exceptions.stammered = 2;
exceptions.shivered = 2;
exceptions.discoloured = 3;
exceptions.gravesend = 2;
exceptions.lb = 1;
exceptions.unexpressed = 3;
exceptions.greyish = 2;
exceptions.unostentatious = 5;
exceptions.tamale = 3;
exceptions.waterbed = 3;
exceptions.wednesday = 2;
exceptions.yosemite = 4;

const subtract = [
  /cial/, /tia/, /cius/, /cious/, /gui/, /ion/, /iou/, /sia$/, /.ely$/,
  /.[^aeiuoycgltdb]{2,}ed$/, /(?:s[chkls]|g[hn])ed$/,
  /(?:[aeiouy](?:[bdfklmnprstvy]|ch|dg|g[hn]|lch|s[cklst]))es$/,
  /(?:[aeiouy](?:[bcfgklmnprsvwxyz]|s[chkls]))ed$/
];

const add = [
  /ia/, /riet/, /dien/, /iu/, /io/, /ii/,
  /[aeiouy]bl$/, /mbl$/,
  /[aeiou]{3}/,
  /^mc/, /ism$/,
  /(.)(?!\\1)([aeiouy])\\2l$/,
  /[^l]llien/,
  /^coad./, /^coag./, /^coal./, /^coax./,
  /(.)(?!\\1)[gq]ua(.)(?!\\2)[aeiou]/,
  /dnt$/,
  /eings?$/, /react?$/, /[aeiouy]sh?e[rs]$/,
  /(?:eo|asm|dea|gean|oa|ua|uity|thm|ism|orbed|shred)$/
];

var syllables = function ( word ) {
  // Early return — needs no computaion!
  if ( word.length < 3 ) return 1;
  // If it is an exceptional words, use look up.
  if ( exceptions[ word ] ) return exceptions[ word ];

  // Now try to compute.
  const w = word.replace( /e$/, '' );
  let count = w.split( rgx ).filter( ( s ) => ( s ) ).length;

  for ( let k = 0; k < add.length; k += 1 ) {
    if ( add[ k ].test( w ) ) count += 1;
  }

  for ( let k = 0; k < subtract.length; k += 1 ) {
    if ( subtract[ k ].test( w ) ) count -= 1;
  }

  return ( count < 1 ) ? 1 : count;
}; // syllables()

module.exports = syllables;
