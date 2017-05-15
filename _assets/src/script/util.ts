type List<T> = T[] | NodeList;

interface Dictionary<T> {
  [key: string]: T;
}

type ListIteratee<T, U> = (value: T, index: number, collection: List<T>) => U;
type DictionaryIteratee<T, U> = (value: T, key: string, collection: Dictionary<T>) => U;

function isList<T>(collection: List<T> | Dictionary<T>): collection is List<T> {
  return Array.isArray(collection) || collection instanceof NodeList;
}

function listToArray<T>(list: List<T>): T[] {
  return list instanceof NodeList ? [].slice.call(list) : list;
}

export function map<T, U>(collection: List<T>, iteratee: ListIteratee<T, U>): U[];
export function map<T, U>(collection: Dictionary<T>, iteratee: DictionaryIteratee<T, U>): Dictionary<U>;
export function map<T, U>(collection: List<T> | Dictionary<T>, iteratee: ListIteratee<T, U> | DictionaryIteratee<T, U>): U[] | Dictionary<U> {
  if (isList(collection)) {
    return listToArray(collection).map(<ListIteratee<T, U>>iteratee);
  }
  else {
    let ret: Dictionary<U> = {};
    for (let key in collection) {
      if (collection.hasOwnProperty(key)) {
        ret[key] = (<DictionaryIteratee<T, U>>iteratee)(collection[key], key, collection);
      }
    }
    return ret;
  }
}

export function each<T>(collection: List<T>, iteratee: ListIteratee<T, void>): void;
export function each<T>(collection: Dictionary<T>, iteratee: DictionaryIteratee<T, void>): void;
export function each<T>(collection: List<T> | Dictionary<T>, iteratee: ListIteratee<T, void> | DictionaryIteratee<T, void>): void {
  if (isList(collection)) {
    listToArray(collection).forEach(<ListIteratee<T, void>>iteratee);
  }
  else {
    for (let key in collection) {
      if (collection.hasOwnProperty(key)) {
        (<DictionaryIteratee<T, void>>iteratee)(collection[key], key, collection);
      }
    }
  }
}
