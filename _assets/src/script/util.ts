function nodeListToArray(o: any): Array<any> | object {
  return o instanceof NodeList ? [].slice.call(o) : o;
}

export function each(o: Array<any> | NodeList | object, fn: (v: any, k: number | string, o: object | Array<any>) => void): void {
  o = nodeListToArray(o);
  if (Array.isArray(o)) {
    o.forEach(fn);
  }
  else {
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        fn(k, o[k], o);
      }
    }
  }
}

export function map(o: Array<any> | NodeList | object, fn: (v: any, k: number | string, o: object | Array<any>) => any): any {
  o = nodeListToArray(o);
  if (Array.isArray(o)) {
    return o.map(fn);
  }
  else {
    let r = {};
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        r[k] = fn(k, o[k], o);
      }
    }
    return r;
  }
}
