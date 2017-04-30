type Dictionary = {
  [key: string]: any
};

function nodeListToArray(o: any): Array<any> | Dictionary {
  return o instanceof NodeList ? [].slice.call(o) : o;
}

export function each(o: Array<any> | NodeList | Dictionary, fn: (v: any, k: number | string, o: Dictionary | Array<any>) => void): void {
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

export function map(o: Array<any> | NodeList | Dictionary, fn: (v: any, k: number | string, o: Dictionary | Array<any>) => any): any {
  o = nodeListToArray(o);
  if (Array.isArray(o)) {
    return o.map(fn);
  }
  else {
    let r: Dictionary = {};
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        r[k] = fn(k, o[k], o);
      }
    }
    return r;
  }
}
