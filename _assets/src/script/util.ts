interface List<T> {
  [index: number]: T;
  length: number;
}

interface Dictionary<T> {
  [key: string]: T;
}

type ListIterator<T, U> = (value: T, index: number, collection: List<T>) => U;
type DictionaryIterator<T, U> = (value: T, key: string, collection: Dictionary<T>) => U;

export function mapDict<T, U>(collection: Dictionary<T>, iteratee: DictionaryIterator<T, U>): Dictionary<U> {
  let ret: Dictionary<U> = {};
  for (let key in collection) {
    if (collection.hasOwnProperty(key)) {
      ret[key] = iteratee(collection[key], key, collection);
    }
  }
  return ret;
}

export function map<T, U>(collection: List<T>, iteratee: ListIterator<T, U>): U[] {
  collection = collection instanceof NodeList ? [].slice.call(collection) : collection;
  return (<Array<T>>collection).map(iteratee);
}

export function eachDict<T>(collection: Dictionary<T>, iteratee: DictionaryIterator<T, void>): void {
  for (let key in collection) {
    if (collection.hasOwnProperty(key)) {
      iteratee(collection[key], key, collection);
    }
  }
}

export function each<T>(collection: List<T>, iteratee: ListIterator<T, void>): void {
  collection = collection instanceof NodeList ? [].slice.call(collection) : collection;
  (<Array<T>>collection).forEach(iteratee);
}
