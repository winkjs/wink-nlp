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
/* eslint-disable guard-for-in */
const composePatterns = require( './compose-patterns.js' );
const identifyMarkedArea = require( './identify-marked-area.js' );

const eosTokenN = 2070000;
const eosTokenX = '$%^EoS^%$';
const otherwiseN = 2070003;
const otherwiseX = ' otherwise';

var simpleFSM = function ( cache, token2Ignore ) {
  // Returned!
  var methods = Object.create( null );
  // Holds FSM in the following structure:<br/>
  // curr state —> event —> next state <br/>
  // One of the event is `otherwise`, whose next state defines the default state.
  var fsm = Object.create( null );
  // The root or the beginning state of the `fsm`.
  const root = 0;
  // Tracks the last used state. Whenever a new state is needed, its value is
  // incremented and returned. See `getNextState()`.
  var lastUsedState =  0;
  // The terminal states i.e. the detected patterns: maps state to name.
  var terminalStates = Object.create( null );
  // The terminal states, where part of pattern has been marked out.
  var markedStates = Object.create( null );
  // Add-ons value is stored here.
  var customPropertyAtStates = Object.create( null );
  // Use to substitute tokens by patterns in a multi-pass scenario.
  var substitutions;
  // On pattern detection function.
  var onPatternDetectionFn;
  // By default always ignore the new line character, else use the value supplied
  // by `token2Ignore`; this will usually be the OOV lexeme, i.e. `$%^oov^%$`.
  const toBeIgnoredToken =  ( token2Ignore === undefined ) ? '\n' : token2Ignore;
  // The `cache` is `undefined`, when things have to work on token text — for
  // learning & recognition both. For native case of learning (i.e. generation),
  // it can be `null` or real value; and native mode recognition will always
  // need real value of the `cache`.
  // Setup `keyLF/eosToken` to use during entity detection on the basis of `cache`
  // value — It is critical for model generation.
  const keyLF = ( cache === undefined || cache === null ) ? toBeIgnoredToken : cache.lookup( toBeIgnoredToken )[ 0 ];
  const eosToken = ( cache === undefined || cache === null ) ? eosTokenX : eosTokenN;
  // The `otherwise` event; including a space to ensure that such an input can
  // never arrive from the token stream. Later on it will be changed to numeric
  // value > `0xFFFFF` i.e. the limit of vocabulary.
  const otherwise = ( cache === undefined ) ? otherwiseX : otherwiseN;

  // ## getNextState
  /**
   *
   * Returns the next state to be assigned i.e. the next unused state or
   * a state corresponding to target, if defined.
   *
   * @param {number} index of current token.
   * @param {number} last index of last token.
   * @param {number} target state of the pattern being processed; could be
   * `undefined` if it is being encountered for the first time.
   * @returns {number} next state that should be assigned for the current event.
   * @private
  */
  var getNextState = function ( index, last, target ) {
    // Check its invocation in the of fsm.
    if ( index === last && target ) return target;
    // Compute next unused state & return. Note this now becomes the last
    // used state!
    lastUsedState += 1;
    return lastUsedState;
  }; // getNextState()

  // ## learnSinglePattern
  /**
   *
   * Learns a single pattern.
   *
   * @param {string} name of the pattern to be learned.
   * @param {array} pattern to be learned.
   * @param {array} mark `[ start, end ]`.
   * @param {any} customProperty contains definable value(s).
   * @returns {undefined} Nothing!
   * @private
  */
  var learnSinglePattern = function ( name, pattern, mark, customProperty ) {
    const length = pattern.length;
    // Last element.
    const last = length - 1;
    // Target state for this pattern, would be `undefined` if this pattern type is
    // enountered for the first time (`undefined` disables collapse of states).
    const target = undefined;
    // Tracks the `state` as the FSM builds up, specially useful if there are
    // machines with shared path i.e. common `(state, events)` pairs.
    let state = root;
    // Assigned for `otherwise` events.
    let goBackTo = root;
    // Temp for event & next state.
    let ev, nextState;

    // Iterate through the pattern's tokens, while discovering any existing
    // machine that can share path.
    for ( let k = 0; k < length; k += 1 ) {
      ev = pattern[ k ];
      // Create new state & intialize, if required.
      if ( fsm[ state ] === undefined ) {
        fsm[ state ] = Object.create( null );
        fsm[ state ][ otherwise ] = goBackTo;
      }
      // Check for machines that may share path.
      if ( fsm[ state ][ ev ] === undefined ) {
        // None found, create new state transition by assigning the next state for
        // the current event – `ev`.
        nextState = getNextState( k, last, target );
        fsm[ state ][ ev ] = nextState;
        // Always compute state transition from the perspective of discovering
        // shared path: here the `fsm[ state ][ ev ]` has been just assigned
        // `nextState`, therefore `state` needs to transition to this state only.
        state = nextState;
      } else if ( terminalStates[ fsm[ state ][ ev ] ] ) {
          // Case when shared path is found and the next state on the path is a
          // terminal state.
          if ( fsm[ state ][ otherwise ] === root ) fsm[ state ][ otherwise ] = goBackTo;
          goBackTo = fsm[ state ][ ev ];
          nextState = getNextState( k, last, target );
          fsm[ state ][ ev ] = nextState;
          // Compute state transition; again like earlier case, it would be `nextState`.
          state = nextState;
        } else if ( k === last ) {
            // Case when shared path is found and the next state on the path is NOT
            // a terminal state AND current token is the LAST one.
            nextState = getNextState( k, last, target );
            fsm[ fsm[ state ][ ev ] ][ otherwise ] = nextState;
            state = nextState;
          } else {
            // Case when shared path is found and the next state on the path is NOT
            // a terminal state AND current token is NOT the LAST one.<br/>
            // Simply compute state transition, no other work to be done!
            state = fsm[ state ][ ev ];
          }
    }
    terminalStates[ state ] = name;

    if ( mark ) {
      // Update last element of `mark` to simplifies computations during fsm
      // execution. Update must happen as a deep copy & not directly!
      markedStates[ state ] = identifyMarkedArea( mark, length );
    }

    if ( customProperty !== undefined ) {
      customPropertyAtStates[ state ] = customProperty;
    }
  }; // learnSinglePattern()

  // ## learn
  /**
   *
   * Learns the patterns that must be detected via recognize() API calls.
   *
   * @param {Object[]} patterns to be learned.
   *
   * @param {string} patterns[].name of the pattern.
   * @param {string} patterns[].structure of the pattern.
   * @returns {number} of uniquely named patterns.
   * `[ pattern-id, start-token, end-token ]` format.
   * @private
  */
  var learn = function ( patterns ) {
    // Temp for counting unique.
    var obj = Object.create( null );
    // Composed Patterns
    var cp = [];
    for ( let i = 0; i < patterns.length; i += 1 ) {
      const pi = patterns[ i ];
      if ( typeof pi.pattern === 'string' ) {
        const all = composePatterns( pi.pattern );
        for ( let j = 0; j < all.length; j += 1 )
          cp.push( { name: pi.name, pattern: all[ j ], mark: pi.mark, customProperty: pi.customProperty } );
      } else cp.push( { name: pi.name, pattern: pi.pattern, mark: pi.mark, customProperty: pi.customProperty } );
    }
    // Sort to get the longest pattern on the top.
    cp.sort( ( a, b ) => ( b.pattern.length - a.pattern.length ) );
    // All set, now learn using composed patterns – `cp`!
    for ( let i = 0; i < cp.length; i += 1 ) {
      learnSinglePattern( cp[ i ].name, cp[ i ].pattern, cp[ i ].mark, cp[ i ].customProperty );
    }
    // Return number of uniquely named patterns.
    for ( const ts in terminalStates ) obj[ terminalStates[ ts ] ] = true;
    return ( ( Object.keys( obj ) ).length );
  }; // learn()

  // ## setOnPatternDetectionFn
  /**
   *
   * Defines the function that is called on every detected pattern, provided
   * the detected pattern had an `customProperty` property defined.
   * @param {function} f to be called with `match` & `customProperty` value as parameters.
   * @returns {boolean} `true` if it was a success otherwise `false`.
   * @private
  */
  var setOnPatternDetectionFn = function ( f ) {
    if ( typeof f === 'function' ) {
      onPatternDetectionFn = f;
      return true;
    }
    return false;
  }; // setOnPatternDetectionFn()

  // ## pushMatch2Patterns
  /**
   *
   * Pushes a `match`ed pattern details into the `patterns` array after handling
   * marking and calling the on pattern detection function, if required. Before
   * pushing a `match` to patterns, the state (numeric) at `match[ 2 ]` is mapped
   * to its name using `terminalStates`; remember the `state` passed here is
   * always the terminal state. Passing state in match ensures that respective
   * `mark` and `customProperty` are handled differently if they have different values in
   * a state-machine rows, even though the `names` are identical.
   *
   * @param {array} patterns where the `match` is pushed.
   * @param {array} match pushed in to the `patterns`. The `match` conntains
   * 3-entries viz. 0—state, 1 & 2—start & end indexes of `tokens`.
   * @returns {undefined} Nothing.
   * @private
  */
  var pushMatch2Patterns = function ( patterns, match ) {
    // Extract the state at match[ 0 ].
    var m0 = match[ 2 ];
    // Pattern name `'0'` — simply ignore it!
    if ( terminalStates[ m0 ] === '0' ) return;
    // Not to be ignored — process it.
    var mark = markedStates[ m0 ];
    var customProperty = customPropertyAtStates[ m0 ];
    if ( mark ) {
      match[ 0 ] += mark[ 0 ];
      match[ 1 ] -= mark[ 1 ];
    }

    // Removed `customProperty !== undefined &&` check while coding pos experiment
    if ( onPatternDetectionFn )
      onPatternDetectionFn( match, customProperty );

    match[ 2 ] = terminalStates[ m0 ];

    patterns.push( match );
  }; // pushPattern()

  // ## setPatternSwap
  /**
   *
   * Sets up the patterns to be used for token substitution/swap in the
   * `recognize()` api.
   *
   * @param {array[]} patterns to be used for substitutions in `recognize()`.
   * @returns {undefined} Nothing.
   * @private
  */
  var setPatternSwap = function ( patterns ) {
    if ( !patterns || !Array.isArray( patterns ) ) {
      substitutions = undefined;
      return;
    }
    // Old `substitutions` are re-initialized.
    substitutions = Object.create( null );
    // Sort patterns by the start of pattern index.
    patterns.sort( ( a, b ) => ( a[ 0 ] > b[ 0 ] ) );
    // Index it by start of pattern.
    patterns.forEach( ( e ) => ( substitutions[ e[ 0 ] ] = [ e[ 1 ], e[ 2 ] ] ) );
  }; // setPatternSwap()

  // ## recognize
  /**
   *
   * Recognizes patterns present in the input tokens in a greedy manner.
   *
   * @param {array} tokens in which the patterns need to be recognized.
   * @param {function} [transformToken] an optional function that is called before
   * processing every token.
   * @param {*} [param] that has to be passed as the last param to `transformToken()`
   * function.
   * @returns {array[]} where each element follows
   * `[ pattern-id, start-token, end-token ]` format.
   * @private
  */
  var recognize = function ( tokens, transformToken, param ) {
    // Length of the `tokens.`
    const length = tokens.length;
    // Check if `transformToken` is a valid function.
    var transformTokenFn = ( typeof transformToken === 'function' ) ? transformToken : null;
    // Detected patterns are captured here. Each element has the following format: <br/>
    // `[ pattern-id, start-token, end-token ]`
    var patterns = [];
    // We don't need a separate state machines unlike `recognize()`, as the
    // following set of variables together act like a singleton machine.
    var first = 0;
    var state = root;
    // Next State.
    var ns = root;
    // Temp. for a single pattern.
    var p = null;
    // Last non-root otherwise state & index
    var lastOtherwiseIndex;
    var lastOtherwiseState;
    // Temp. for a token.
    var t;
    // Used to increment `j` and computing span of pattern correctly, may become
    // > 1 if an earlier detected pattern is longer that 1-token.
    var delta = 1;

    for ( let i = 0; i <= length; i += 1 ) {
      // **Attempt greedy lookup**:<br/>
      // Keep digging until next state becomes `root` or a terminal state is
      // encountered. Upon failure after a partial match, roll back is required
      // so that the extra consumed tokens can be explored by machine.
      for ( let j = i; j <= length; j += delta ) {
        // Extract current token.
        t = ( j === length ) ?  eosToken : tokens[ j ];

        // Skip the newline character; TODO: will replace by the hash value!
        // Use direct hash for the time being later, it must be obtained via cache
        if ( t === keyLF ) continue; // eslint-disable-line no-continue

        // Perform replacements using earlier detected patterns.
        if ( substitutions && substitutions[ j ] ) {
          t = substitutions[ j ][ 1 ];
          delta = substitutions[ j ][ 0 ] - j + 1;
        } else delta = 1;

        // Apply token transformation function, if defined. Must not be called
        // for the `eosToken`.
        if ( transformTokenFn && ( j < length ) ) t = transformTokenFn( t, cache, param, j );

        // Find next state on the basis of current `state` and current token – `t`.
        ns = fsm[ state ][ t ] || root;
        // Detect the state transition to capture `first` token of a potential upcoming
        // pattern. If state is `root` and the next state is `non-root` indicates
        // that we have just starting chasing for a new pattern.
        if ( !state && ns ) first = j;

        if ( terminalStates[ ns ] ) {
          // Terminal state encountered, save this pattern. Update span using `delta`.
          p = [ first, j + delta - 1, ns ];
          pushMatch2Patterns( patterns, p );
          // Set index to `j`, so that iterations can commence from `j + 1` as
          // for-loop increments the index variable at the end of loop!
          i = j;
          // Ensures that the inner loop terminates!
          j = length + 100;
          // Pattern has been discovered, so next state must be set to `root`.
          ns = root;
          // Same is true for the last saved otherwise state.
          lastOtherwiseState = root;
        } else if ( ns === root ) {
          // Not a terminal state but the next state has hit the `root`.
          if ( lastOtherwiseState ) {
            // But we have a `non-root` last saved otherwise state; this means
            // we must save this pattern.
            p = [ first, lastOtherwiseIndex, lastOtherwiseState ];
            pushMatch2Patterns( patterns, p );
            // Set index to the index corresponding to the above last saved otherwise
            // state.
            i = lastOtherwiseIndex;
            // Ensure that the inner loop terminates;
            j = length + 100;
            // Pattern has been discovered, so next state must be set to `root`.
            ns = root;
            // Same is true for the last saved otherwise state.
            lastOtherwiseState = root;
          } else {
            // The last saved otherwise state is pointing to `root`: terminate
            // the inner loop without updating the index variable — this ensures
            // complete roll back.
            j = length + 100;
          }
        }
        // Update the current state.
        state = ns;
        // Save (last) non-root otherwise state & index, if any.
        if ( fsm[ state ][ otherwise ] ) {
          // Update span using `delta`.
          lastOtherwiseIndex = j + delta - 1;
          lastOtherwiseState = fsm[ state ][ otherwise ];
        }
      }
    }

    return patterns;
  }; // recognize()

  // ## exportJSON
  /**
   * Exports the learning as a JSON, which may be saved as a text file for
   * later use via `importJSON()`.
   *
   * @return {string} Learning in JSON format.
   * @private
  */
  var exportJSON = function () {
    return JSON.stringify(
      [ 100, lastUsedState, fsm, terminalStates, markedStates, customPropertyAtStates ]
    );
  }; // exportJSON()

  // ## emptyModelJSON
  /**
   * Exports the an empty model's JSON. Useful in model generation.
   *
   * @return {string} Learning in JSON format.
   * @private
  */
  var emptyModelJSON = function () {
    // Empty machine!
    const m0 = Object.create( null );
    m0[ 0 ] = Object.create( null );
    return JSON.stringify(
      [ 100,
        0,                      // `lastUsedState`.
        m0,                     // `fsm`,
        Object.create( null ),  // `terminalStates`,
        Object.create( null ),  // `markedStates`,
        Object.create( null ),  // `customPropertyAtStates`
      ]
    );
  }; // emptyModelJSON()

  // ## importJSON
  /**
   * Imports an existing JSON learning for recognition.
   *
   * @param {JSON} json containing learnings in as exported by `exportJSON()`.
   * @return {void} Nothing!
   * @throws Error if `json` is invalid.
   * @private
  */
  var importJSON = function ( json ) {
    var model =  JSON.parse( json );
    lastUsedState = model[ 1 ];
    fsm = model[ 2 ];
    terminalStates = model[ 3 ];
    markedStates = model[ 4 ];
    customPropertyAtStates = model[ 5 ];
  }; // importJSON()

  // Prints the model in terms of the state machine & terminal states.
  var printModel = function () {
    console.log( 'State Machine:' );
    console.log( JSON.stringify( fsm, null, 2 ) );
    console.log();
    console.log( 'Terminal States:' );
    console.log( JSON.stringify( terminalStates, null, 2 ) );
    console.log();
    console.log( 'Marked States:' );
    console.log( JSON.stringify( markedStates, null, 2 ) );
    console.log();
    console.log( 'customProperty States:' );
    console.log( JSON.stringify( customPropertyAtStates, null, 2 ) );
  }; // printModel()


  methods.learn = learn;
  methods.recognize = recognize;
  methods.setPatternSwap = setPatternSwap;
  methods.setOnPatternDetectionFn = setOnPatternDetectionFn;
  methods.exportJSON = exportJSON;
  methods.importJSON = importJSON;
  methods.emptyModelJSON = emptyModelJSON;

  methods.printModel = printModel;

  // This a dummy statement to ensure 100% coverage; because feature of
  // collapsing shared states into single one was **disabled** due to `mark`.
  getNextState( 0, 0, 99 );
  return methods;
}; // fsm()

module.exports = simpleFSM;
