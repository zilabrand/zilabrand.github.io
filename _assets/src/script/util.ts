interface List<T> {
  [index: number]: T;
  length: number;
}

interface Dictionary<T> {
  [key: string]: T;
}

type ListIterator<T, U> = (value: T, index: number, collection: List<T>) => U;
type DictionaryIterator<T, U> = (value: T, key: string, collection: Dictionary<T>) => U;

function mapDict<T, U>(collection: Dictionary<T>, iteratee: DictionaryIterator<T, U>): Dictionary<U> {
  let ret: Dictionary<U> = {};
  for (let key in collection) {
    if (collection.hasOwnProperty(key)) {
      ret[key] = iteratee(collection[key], key, collection);
    }
  }
  return ret;
}

function mapList<T, U>(collection: List<T>, iteratee: ListIterator<T, U>): U[] {
  collection = collection instanceof NodeList ? [].slice.call(collection) : collection;
  return (<Array<T>>collection).map(iteratee);
}

function eachDict<T>(collection: Dictionary<T>, iteratee: DictionaryIterator<T, void>): void {
  for (let key in collection) {
    if (collection.hasOwnProperty(key)) {
      iteratee(collection[key], key, collection);
    }
  }
}

function eachList<T>(collection: List<T>, iteratee: ListIterator<T, void>): void {
  collection = collection instanceof NodeList ? [].slice.call(collection) : collection;
  (<Array<T>>collection).forEach(iteratee);
}

function isDictionary<T>(collection: any): collection is Dictionary<T> {
  return typeof collection === 'object' && collection !== null;
}

export function map<T, U>(collection: List<T>, iteratee: ListIterator<T, U>): U[];
export function map<T, U>(collection: Dictionary<T>, iteratee: DictionaryIterator<T, U>): Dictionary<U>;
export function map<T, U>(collection: List<T> | Dictionary<T>, iteratee: ListIterator<T, U> | DictionaryIterator<T, U>): U[] | Dictionary<U> {
  if (isDictionary<T>(collection)) {
    return mapDict(collection, <DictionaryIterator<T, U>>iteratee);
  }
  else {
    return mapList(collection, <ListIterator<T, U>>iteratee);
  }
}

export function each<T>(collection: List<T>, iteratee: ListIterator<T, void>): void;
export function each<T>(collection: Dictionary<T>, iteratee: DictionaryIterator<T, void>): void;
export function each<T>(collection: List<T> | Dictionary<T>, iteratee: ListIterator<T, void> | DictionaryIterator<T, void>): void {
  if (isDictionary<T>(collection)) {
    eachDict(collection, <DictionaryIterator<T, void>>iteratee);
  }
  else {
    eachList(collection, <ListIterator<T, void>>iteratee);
  }
}
