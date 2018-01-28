'use strict';

const VALUE_INDEX_SYMBOL = Symbol('EnumTypeValuesIndex');

class EnumType {
  [Symbol.iterator] () {
    return this[VALUE_INDEX_SYMBOL][Symbol.iterator]();
  }
}

function enumerate (def) {
  if (!(def instanceof Array) || (!def.length)) {
    throw new TypeError('EnumType definition must be a non empty array');
  }
  let enumObj = new EnumType();
  let valueIndex = def.map(name => {
    name = String(name);
    if (name in enumObj) {
      throw new Error('Duplicate EnumType element name: ' + name);
    }
    let value = Symbol(name);
    enumObj[name] = value;
    enumObj[value] = name;
    return value;
  });
  Object.freeze(valueIndex);
  enumObj[VALUE_INDEX_SYMBOL] = valueIndex;
  return Object.freeze(enumObj);
}

EnumType.define = function (def) {
  const enumObj = enumerate(def);
  const enumProxy = new Proxy(enumObj, {
    get: (obj, name, ...rest) => {
      if (name in obj) {
        return Reflect.get(obj, name, ...rest);
      }
      throw new RangeError('Not a valid EnumType element name: ' + JSON.stringify(name));
    }
  });
  return Object.freeze(enumProxy);
};

EnumType.toJson = function (def) {
  let transient = {};
  Object.keys(def).forEach(name => {
    transient[name] = def[name].toString();
  });
  return JSON.stringify(transient);
};

module.exports = EnumType;
