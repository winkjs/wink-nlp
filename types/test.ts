import winkNlp, {
    Sentences,
    CustomEntities,
    SelectedCustomEntities,
    Entities,
    SelectedEntities,
    Tokens,
    SelectedTokens,
    ItsFunction,
    AsFunction,
} from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

// $ExpectType WinkMethods
winkNlp(model);

// $ExpectType WinkMethods
const nlp = winkNlp(model, ["foo"]);

// $ExpectType ItsHelpers
const its = nlp.its;

// $ExpectType AsHelpers
const as = winkNlp(model).as;

// $ExpectType Document
const doc = nlp.readDoc('test');

// $ExpectType CustomEntities
const customEntities = doc.customEntities();

// $ExpectType string[]
customEntities.out(its.value, as.array);

// $ExpectType string[]
customEntities.out(its.value, as.array);

type OutApplicable = Sentences | CustomEntities | SelectedCustomEntities | Entities | SelectedEntities | Tokens | SelectedTokens;

// $ExpectType <T, U>(toOut: OutApplicable, itsf: ItsFunction<T>, asf: AsFunction<T, U>) => U
function myOut<T, U>(toOut: OutApplicable, itsf: ItsFunction<T>, asf: AsFunction<T, U>): U {
  return (toOut.out(itsf, asf) as any) as U;
}
