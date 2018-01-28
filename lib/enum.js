'use strict';

const EnumType = {};
const CLASS_SYMBOL = Symbol('EnumType');

function createMap (def) {
  if (!(def instanceof Array) || (!def.length)) {
    throw new TypeError('Enum definition must be a non empty array');
  }
  let map = {};
  let valueIndex = def.map(name => {
    name = String(name);
    if (name in map) {
      throw new Error('Duplicate enum element: ' + name);
    }
    let value = Symbol(name);
    map[name] = value;
    map[value] = name;
    return value;
  });
  Object.freeze(valueIndex);
  map[CLASS_SYMBOL] = null;
  map[Symbol.iterator] = () => valueIndex[Symbol.iterator]();
  return Object.freeze(map);
}

EnumType.define = function (def) {
  const map = createMap(def);
  const defProxy = new Proxy(map, {
    get: (map, name, ...rest) => {
      if (name in map) {
        return Reflect.get(map, name, ...rest);
      }
      throw new Error('Undefined enum element: ' + JSON.stringify(name));
    }
  });
  return Object.freeze(defProxy);
};

EnumType.isEnum = function (enumVar) {
  return (typeof enumVar === 'object') && enumVar.hasOwnProperty(CLASS_SYMBOL);
};

EnumType.toJson = function (def) {
  let transient = {};
  Object.keys(def).forEach(name => {
    transient[name] = def[name].toString();
  });
  return JSON.stringify(transient);
};

module.exports = EnumType;
