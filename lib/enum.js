'use strict';

class EnumType {}

function enumerate (def) {
  if (!(def instanceof Array) || (!def.length)) {
    throw new TypeError('EnumType definition must be a non empty array');
  }
  let enumObj = new EnumType();
  def.forEach(name => {
    name = String(name);
    if (name in enumObj) {
      throw new Error('Duplicate EnumType element name: ' + name);
    }
    let value = Symbol(name);
    enumObj[name] = value;
    enumObj[value] = name;
  });
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
  for (let name in def) {
    transient[name] = def[name].toString();
  }
  return JSON.stringify(transient);
};

module.exports = EnumType;
