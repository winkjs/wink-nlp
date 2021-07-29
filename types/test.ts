import winkNlp from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

// $ExpectType WinkMethods
winkNlp(model);

// $ExpectType WinkMethods
winkNlp(model, ["foo"]);

// $ExpectType ItsHelpers
winkNlp(model).its;

// $ExpectType AsHelpers
winkNlp(model).as;
