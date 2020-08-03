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

/* eslint-disable no-console */

const childProcess = require( 'child_process' );
const languageModels = require( './language-models.json' );
// Model name with be at [ 1 ], as we are using "node -e" command.
const modelName = process.argv[ 1 ] || 'wink-eng-lite-model';
const modelDetails = languageModels.find( ( lm ) => lm.name === modelName );
if ( modelDetails === undefined ) {
  // Display error in red color.
  console.log( `\n\x1b[0m\x1b[31m"${modelName}" is an invalid model name.\x1b[0m` );
  // Corrective action in green color.
  console.log( '\n\x1b[32mUse one of the following models:\x1b[0m');
  console.table( languageModels );
  console.log();
  throw Error( 'Model installation failed!' );
}
var modelVersion = modelDetails.version;
var model = `https://github.com/winkjs/${modelName}/releases/download/${modelVersion}/${modelName}-${modelVersion}.tgz`;
// Display (un)installation commands in yellow color.
console.log( `\n\x1b[33mnpm uninstall ${model}\x1b[0m` );
childProcess.execSync( `npm uninstall ${model}`, { stdio: 'inherit' } ); // eslint-disable-line no-sync
console.log( `\n\x1b[33mnpm install ${model} --save\x1b[0m` );
childProcess.execSync( `npm install ${model} --save`, { stdio: 'inherit' } ); // eslint-disable-line no-sync
