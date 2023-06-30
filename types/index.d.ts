// Minimum TypeScript Version: 4.0

declare module 'wink-nlp' {
  // turn off exporting by default since we don't want to expose internal details
  export { };

  // these types are internal details of the implementing model
  type StemAddon = unknown;
  type LemmatizeAddon = unknown;
  type ReadabilityStatsAddon = unknown;
  type WordVectorsAddon = unknown;

  // optional addons that some language models may have
  export interface ModelAddons {
    stem?: StemAddon;
    lemmatize?: LemmatizeAddon;
    readabilityStats?: ReadabilityStatsAddon;
    wordVectors?: WordVectorsAddon;
  }

  // these types are internal details of the implementing model
  type CoreModel = unknown;
  type SBDModel = unknown;
  type POSModel = unknown;
  type NERModel = unknown;
  type NEGATIONModel = unknown;
  type SAModel = unknown;
  type CERMetaModel = unknown;
  type FeatureFn = unknown;

  // A language model
  export interface Model {
    core: CoreModel;
    sbd: SBDModel;
    pos: POSModel;
    ner: NERModel;
    negation: NEGATIONModel;
    sa: SAModel;
    metaCER: CERMetaModel;
    featureFn: FeatureFn;
    addons: ModelAddons;
  }

  // its helpers

  export type Case =
    "other" |
    "lowerCase" |
    "upperCase" |
    "titleCase";

  export type PartOfSpeech =
    "ADJ" |
    "ADP" |
    "ADV" |
    "AUX" |
    "CCONJ" |
    "DET" |
    "INTJ" |
    "NOUN" |
    "NUM" |
    "PART" |
    "PRON" |
    "PROPN" |
    "PUNCT" |
    "SCONJ" |
    "SYM" |
    "VERB" |
    "X" |
    "SPACE";

  // Bag of words
  export interface Bow {
    [index: string]: number;
  }

  export interface ReadabilityStats {
    fres: number;
    sentiment: number;
    numOfTokens: number;
    numOfWords: number;
    numOfComplexWords: number;
    complexWords: Bow;
    numOfSentences: number;
    readingTimeMins: number;
    readingTimeSecs: number;
  }

  export interface Detail {
    value: string;
    type: string;
  }

  export interface SentenceImportance {
    index: number;
    importance: number;
  }

  export type ModelTermFrequencies = Bow;
  export type ModelInverseDocumentFrequencies = Bow;

  // internal types that will never be exposed directly to the user
  type Cache = unknown;
  type Token = unknown;
  type RawDocumentData = unknown;

  // Its
  export interface ItsHelpers {
    case(index: number, token: Token, cache: Cache): Case;
    uniqueId(index: number, token: Token): number;
    negationFlag(index: number, token: Token): boolean;
    normal(index: number, token: Token, cache: Cache): string;
    contractionFlag(index: number, token: Token): boolean;
    pos(index: number, token: Token, cache: Cache): PartOfSpeech;
    precedingSpaces(index: number, token: Token): string;
    prefix(index: number, token: Token, cache: Cache): string;
    shape(index: number, token: Token, cache: Cache): string;
    stopWordFlag(index: number, token: Token, cache: Cache): boolean;
    abbrevFlag(index: number, token: Token, cache: Cache): boolean;
    suffix(index: number, token: Token, cache: Cache): string;
    type(index: number, token: Token, cache: Cache): string;
    value(index: number, token: Token, cache: Cache): string;
    stem(index: number, token: Token, cache: Cache, addons: ModelAddons): string;
    lemma(index: number, token: Token, cache: Cache, addons: ModelAddons): string;
    vector(): number[];
    detail(): Detail;
    markedUpText(index: number, token: Token, cache: Cache): string;
    span(spanItem: number[]): number[];
    sentenceWiseImportance(rdd: RawDocumentData): SentenceImportance[];
    sentiment(spanItem: number[]): number;
    readabilityStats(rdd: RawDocumentData, addons: ModelAddons): ReadabilityStats;
    terms(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies, terms: string[]): string[];
    docTermMatrix(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies, terms: string[]): number[][];
    docBOWArray(tf: ModelTermFrequencies): Bow;
    bow(tf: ModelTermFrequencies): Bow;
    idf(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies): Array<[term: string, frequency: number]>;
    tf(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies): Array<[term: string, frequency: number]>;
    modelJSON(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies): string;
  }

  // As
  export interface AsHelpers {
    array<T>(tokens: T[]): T[];
    set<T>(tokens: T[]): Set<T>;
    bow(tokens: any[]): Bow;
    freqTable<T>(tokens: T[]): Array<[token: T, freq: number]>;
    bigrams<T>(tokens: T[]): Array<[T, T]>;
    unique<T>(tokens: T[]): T[];
  }

  // functions for use with document
  export type TokenItsFunction<OutType> = (index: number, token: Token, cache: Cache, addons: ModelAddons) => OutType;
  export type SpanItsFunction<OutType> = (spanItem: number[]) => OutType;
  export type VectorizerItsFunction<OutType> = (tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies) => OutType;
  export type ItsFunction<OutType> = TokenItsFunction<OutType> | SpanItsFunction<OutType> | VectorizerItsFunction<OutType>;

  export type AsFunction<InType, OutType> = (tokens: InType[]) => OutType;

  export interface ItemToken {
    parentDocument(): Document;
    parentEntity(): ItemEntity | undefined;
    parentCustomEntity(): ItemCustomEntity | undefined;
    markup(beginMarker?: string, endMarker?: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    parentSentence(): ItemSentence;
    index(): number;
  }

  export interface SelectedTokens {
    each(f: (token: ItemToken) => void): void;
    filter(f: (token: ItemToken) => boolean): SelectedTokens;
    itemAt(k: number): ItemToken | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface Tokens {
    each(f: (token: ItemToken) => void): void;
    filter(f: (token: ItemToken) => boolean): SelectedTokens;
    itemAt(k: number): ItemToken | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface ItemEntity {
    parentDocument(): Document;
    markup(beginMarker: string, endMarker: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    parentSentence(): ItemSentence;
    tokens(): Tokens;
    index(): number;
  }

  export interface SelectedEntities {
    each(f: (entity: ItemEntity) => void): void;
    filter(f: (entity: ItemEntity) => boolean): SelectedEntities;
    itemAt(k: number): ItemEntity | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface Entities {
    each(f: (entity: ItemEntity) => void): void;
    filter(f: (entity: ItemEntity) => boolean): SelectedEntities;
    itemAt(k: number): ItemEntity | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface ItemCustomEntity {
    parentDocument(): Document;
    markup(beginMarker: string, endMarker: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    parentSentence(): ItemSentence;
    tokens(): Tokens;
    index(): number;
  }

  export interface SelectedCustomEntities {
    each(f: (entity: ItemCustomEntity) => void): void;
    filter(f: (entity: ItemCustomEntity) => boolean): SelectedCustomEntities;
    itemAt(k: number): ItemCustomEntity | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface CustomEntities {
    each(f: (entity: ItemCustomEntity) => void): void;
    filter(f: (entity: ItemCustomEntity) => boolean): SelectedCustomEntities;
    itemAt(k: number): ItemCustomEntity | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface ItemSentence {
    parentDocument(): Document;
    markup(beginMarker: string, endMarker: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    entities(): Entities;
    customEntities(): CustomEntities;
    tokens(): Tokens;
    index(): number;
  }

  export interface Sentences {
    each(f: (entity: ItemSentence) => void): void;
    itemAt(k: number): ItemSentence | undefined;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface Document {
    entities(): Entities;
    customEntities(): CustomEntities;
    isLexeme(text: string): boolean;
    isOOV(text: string): boolean;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    sentences(): Sentences;
    tokens(): Tokens;
    printTokens(): void;
  }

  export interface CerExample {
    name: string;
    patterns: string[];
  }

  export interface CerConfig {
    matchValue?: boolean;
    usePOS?: boolean;
    useEntity?: boolean;
  }

  export interface CustomEntityExample {
    name: string;
    patterns: string[];
  }

  export interface WinkMethods {
    readDoc(text: string): Document;
    // returns number of learned entities
    learnCustomEntities(examples: CustomEntityExample[], config?: CerConfig): number;
    its: ItsHelpers;
    as: AsHelpers;
  }

  export default function WinkFn(theModel: Model, pipe?: string[]): WinkMethods;
}

declare module 'wink-nlp/utilities/bm25-vectorizer' {
  // turn off exporting by default since we don't want to expose internal details
  export { };

  import { Tokens, Document, ItsFunction, Bow } from 'wink-nlp';

  export type Norm = "l1" | "l2" | "none";

  export interface BM25VectorizerConfig {
    k: number;
    k1: number;
    b: number;
    norm: Norm;
  }

  export interface BM25Vectorizer {
    learn(tokens: Tokens): void;
    out<T>(f: ItsFunction<T>): T;
    doc(n: number): Document;
    vectorOf(tokens: Tokens): number[];
    bowOf(tokens: Tokens): Bow;
    config(): BM25VectorizerConfig;
    loadModel(json: string): void;
  }

  export default function bm25Vectorizer(config?: BM25VectorizerConfig): BM25Vectorizer;
}

declare module 'wink-nlp/utilities/similarity' {
  // turn off exporting by default since we don't want to expose internal details
  export { };

  import { Bow } from 'wink-nlp';

  export interface SimilarityHelper {
    bow: {
      cosine(bowA: Bow, bowB: Bow): number;
    };
    set: {
      tversky<T>(setA: Set<T>, setB: Set<T>, alpha?: number, beta?: number): number;
      oo<T>(setA: Set<T>, setB: Set<T>): number;
    };
  }

  const similarity: SimilarityHelper;
  export default similarity;
}
