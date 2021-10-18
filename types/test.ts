import winkNlp, {
  Model,
  Sentences,
  CustomEntities,
  SelectedCustomEntities,
  Entities,
  SelectedEntities,
  Tokens,
  SelectedTokens,
  ItemCustomEntity,
  ItemEntity,
  ItemSentence,
  ItemToken,
  Document,
  ItsFunction,
  AsFunction,
} from 'wink-nlp';

// dummy model to test with
const model = ({} as any) as Model;

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

type ColOutApplicable = Sentences | CustomEntities | SelectedCustomEntities | Entities | SelectedEntities | Tokens | SelectedTokens;

// collection out
// $ExpectType <T, U>(toOut: ColOutApplicable, itsf: ItsFunction<T>, asf: AsFunction<T, U>) => U
function myColOut<T, U>(toOut: ColOutApplicable, itsf: ItsFunction<T>, asf: AsFunction<T, U>): U {
  return (toOut.out(itsf, asf) as any) as U;
}

// $ExpectType string[] | boolean[] | [token: boolean, freq: number][]
customEntities.out(its.contractionFlag, as.freqTable);

// $ExpectType [token: boolean, freq: number][]
myColOut(customEntities, its.contractionFlag, as.freqTable);

// $ExpectType string[]
doc.tokens().out();

// $ExpectType string[] | boolean[]
doc.tokens().out(its.abbrevFlag);

// run out on item types
type ItemOutApplicable = ItemCustomEntity | ItemEntity | ItemSentence | ItemToken | Document;

// item out
// $ExpectType <T>(toOut: ItemOutApplicable, itsf: ItsFunction<T>) => T
function myItemOut<T>(toOut: ItemOutApplicable, itsf: ItsFunction<T>): T {
  return (toOut.out(itsf) as any) as T;
}

// $ExpectType string | number[]
doc.out(its.span);

// $ExpectType number[]
myItemOut(doc, its.span);
