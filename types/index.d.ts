// Minimum TypeScript Version: 4.0

declare module 'wink-nlp' {
  // turn off exporting by default since we don't want to expose internal details
  export { };

  // *** BEGIN Language Model Specific Declarations ***
  // These should be always in sync with the langauge model's type declarations.
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
  // *** END Language Model Specific Declarations ***

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
    case(index: number, rdd: RawDocumentData): Case;
    uniqueId(index: number, rdd: RawDocumentData): number;
    negationFlag(index: number, rdd: RawDocumentData): boolean;
    normal(index: number, rdd: RawDocumentData): string;
    contractionFlag(index: number, rdd: RawDocumentData): boolean;
    pos(index: number, rdd: RawDocumentData): PartOfSpeech;
    precedingSpaces(index: number, rdd: RawDocumentData): string;
    prefix(index: number, rdd: RawDocumentData): string;
    shape(index: number, rdd: RawDocumentData): string;
    stopWordFlag(index: number, rdd: RawDocumentData): boolean;
    abbrevFlag(index: number, rdd: RawDocumentData): boolean;
    suffix(index: number, rdd: RawDocumentData): string;
    type(index: number, rdd: RawDocumentData): string;
    value(index: number, rdd: RawDocumentData): string;
    stem(index: number, rdd: RawDocumentData, addons: ModelAddons): string;
    lemma(index: number, rdd: RawDocumentData, addons: ModelAddons): string;
    vector(): number[];
    detail(): Detail;
    markedUpText(index: number, rdd: RawDocumentData): string;
    span(spanItem: number[]): number[];
    sentenceWiseImportance(rdd: RawDocumentData): SentenceImportance[];
    sentiment(spanItem: number[]): number;
    readabilityStats(rdd: RawDocumentData, addons: ModelAddons): ReadabilityStats;
    terms(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies, terms: string[]): string[];
    docTermMatrix(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies, terms: string[]): number[][];
    docBOWArray(tf: ModelTermFrequencies): Bow;
    bow(tf: ModelTermFrequencies): Bow;
    idf(tf: ModelTermFrequencies, idf: ModelInverseDocumentFrequencies): Array<[term: string, frequency: number]>;
    tf(tf: ModelTermFrequencies): Array<[term: string, frequency: number]>;
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
    vector(token: string[]): number[];
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
    each(cb: ((item: ItemToken) => void) | ((item: ItemToken, index: number) => void)): void;
    filter(cb: (item: ItemToken) => boolean): SelectedTokens;
    itemAt(k: number): ItemToken;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface Tokens {
    each(cb: ((item: ItemToken) => void) | ((item: ItemToken, index: number) => void)): void;
    filter(cb: (item: ItemToken) => boolean): SelectedTokens;
    itemAt(k: number): ItemToken;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface ItemEntity {
    parentDocument(): Document;
    markup(beginMarker?: string, endMarker?: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    parentSentence(): ItemSentence;
    tokens(): Tokens;
    index(): number;
  }

  export interface SelectedEntities {
    each(cb: ((item: ItemEntity) => void) | ((item: ItemEntity, index: number) => void)): void;
    filter(cb: (item: ItemEntity) => boolean): SelectedEntities;
    itemAt(k: number): ItemEntity;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface Entities {
    each(cb: ((item: ItemEntity) => void) | ((item: ItemEntity, index: number) => void)): void;
    filter(cb: (item: ItemEntity) => boolean): SelectedEntities;
    itemAt(k: number): ItemEntity;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface ItemCustomEntity {
    parentDocument(): Document;
    markup(beginMarker?: string, endMarker?: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    parentSentence(): ItemSentence;
    tokens(): Tokens;
    index(): number;
  }

  export interface SelectedCustomEntities {
    each(cb: ((item: ItemCustomEntity) => void) | ((item: ItemCustomEntity, index: number) => void)): void;
    filter(cb: (item: ItemCustomEntity) => boolean): SelectedCustomEntities;
    itemAt(k: number): ItemCustomEntity;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface CustomEntities {
    each(cb: ((item: ItemCustomEntity) => void) | ((item: ItemCustomEntity, index: number) => void)): void;
    filter(cb: (item: ItemCustomEntity) => boolean): SelectedCustomEntities;
    itemAt(k: number): ItemCustomEntity;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface ItemSentence {
    parentDocument(): Document;
    markup(beginMarker?: string, endMarker?: string): void;
    out(): string;
    out<T>(itsf: ItsFunction<T>): T | string;
    entities(): Entities;
    customEntities(): CustomEntities;
    tokens(): Tokens;
    index(): number;
  }

  export interface Sentences {
    each(cb: ((item: ItemSentence) => void) | ((item: ItemSentence, index: number) => void)): void;
    itemAt(k: number): ItemSentence;
    length(): number;
    out(): string[];
    out<T>(itsf: ItsFunction<T>): T[] | string[];
    out<T, U>(itsf: ItsFunction<T>, asf: AsFunction<T, U>): U | T[] | string[];
  }

  export interface Include {
    lemma?: boolean;
    specificWordVectors?: string[];
    similarWordVectors?: boolean;
    wordVectorsLimit?: number;
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
    pipeConfig(): string[];
    contextualVectors(include: Include): string;
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

  // Wink word embeddings structure, should stay in sync with emdedding repo.
  interface WordEmbedding {
    precision: number;
    l2NormIndex: number;
    wordIndex: number;
    dimensions: number;
    unkVector: number[];
    size: number;
    words: string[];
    vectors: Record<string, number[]>;
  }

  export interface WinkMethods {
    readDoc(text: string): Document;
    // returns number of learned entities
    learnCustomEntities(examples: CustomEntityExample[], config?: CerConfig): number;
    vectorOf(word: string): number[];
    its: ItsHelpers;
    as: AsHelpers;
  }

  export default function WinkFn(theModel: Model, pipe?: string[], wordEmbeddings?: WordEmbedding): WinkMethods;
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
    learn(tokens: string[]): void;
    out<T>(f: ItsFunction<T>): T;
    doc(n: number): Document;
    vectorOf(tokens: string[]): number[];
    bowOf(tokens: string[]): Bow;
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
    vector: {
      cosine(vectorA: number[], vectorB: number[]): number;
    };
  }

  const similarity: SimilarityHelper;
  export default similarity;
}
