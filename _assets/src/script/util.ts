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
  return Array.isArray(list) ? list : [].slice.call(list);
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

function assign(to: Dictionary<any>, ...froms: Dictionary<any>[]): Dictionary<any> {
  each(froms, from => each(from, (v, k) => to[k] = v));
  return to;
}

type Attrs<TagInterface> = {
  [K in keyof TagInterface]?: TagInterface[K]
}

type PartialCSSStyleDeclaration = {
  [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K]
}

type EventListenerDictionary = {
  [K in keyof DocumentEventMap]?: EventListenerOrEventListenerObject
}

interface CreateElementOptions<Tag extends keyof HTMLElementTagNameMap> {
  attrs?: Attrs<HTMLElementTagNameMap[Tag]>
  css?: PartialCSSStyleDeclaration
  listeners?: EventListenerDictionary
}

export function createElement<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  { attrs, css, listeners }: CreateElementOptions<Tag>,
  ...children: Node[],
): HTMLElementTagNameMap[Tag] {
  // Create the element
  let el = document.createElement(tag)
  // Attributes
  assign(el, attrs || {})
  // CSS
  each(css || {}, (val, prop) => el.style.setProperty(prop, val))
  // Event listeners
  each(listeners || {}, (listener, type) => el.addEventListener(type, listener))
  // Children
  each(children, child => el.appendChild(child))
  // All done
  return el;
}

// Useful shorthands
export const div = (opts?: CreateElementOptions<'div'>, ...children: Node[]) => createElement('div', opts, ...children);
