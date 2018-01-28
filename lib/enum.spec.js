const { expect } = require('chai');

const EnumType = require('../');

describe('Enum definition and access', function () {
  let e;

  it('Invalid definition should throw error', () => {
    expect(() => EnumType.define()).to.throw(Error);
    expect(() => EnumType.define(['a', 'a'])).to.throw(Error);
  });

  it('Duplicate element must be denied.', () => {
    expect(() => EnumType.define(['a', 'a'])).to.throw(Error);
  });

  it('Defining enum', () => {
    const instantiate = () => {
      e = EnumType.define([
        'one',
        'two'
      ]);
    };
    expect(instantiate).not.throw(Error);
  });

  it('Accessing nonexistent enum element throws error', () => {
    expect(() => e.nonexistent).throws(Error);
  });

  it('Can access defined element', () => {
    expect(e).to.have.property('one');
    expect(e).to.have.property('two');
    expect(() => e.one).not.to.throw(Error);
    expect(() => e.two).not.to.throw(Error);
  });

  it('Can validate if a value is of an enum', () => {
    expect(e.one in e).to.equal(true);
    expect(e.two in e).to.equal(true);
  });

  it('Can do for..in walk', () => {
    let check = {
      one: 0,
      two: 0
    };
    let unknown = 0;
    for (let i in e) {
      if (i in check) {
        check[i]++;
      } else {
        unknown++;
      }
    }
    expect(check.one).to.equal(1);
    expect(check.two).to.equal(1);
    expect(unknown).to.equal(0);
  });

  it('Can do for..of walk', () => {
    let check = {
      [e.one]: 0,
      [e.two]: 0
    };
    let unknown = 0;
    expect(e[Symbol.iterator]).is.a('function');
    const walk = () => {
      for (let i of e) {
        if (i in check) {
          check[i]++;
        } else {
          unknown++;
        }
      }
    };
    expect(walk).not.to.throw(Error);
    expect(check[e.one]).to.equal(1);
    expect(check[e.two]).to.equal(1);
    expect(unknown).to.equal(0);
  });
});

describe('EnumType utility methods', function () {
  it('EnumType.isEnum(var)', () => {
    const e = EnumType.define(['a']);
    expect(EnumType.isEnum(e)).to.equal(true);
    let randomObject = new Proxy({}, {});
    expect(EnumType.isEnum(randomObject)).to.equal(false);
  });

  it('EnumType.toJson(var)', () => {
    const enumVar = EnumType.define(['a', 'toJSON']);
    const correctJson = '{"a":"Symbol(a)","toJSON":"Symbol(toJSON)"}';
    const actualJson = EnumType.toJson(enumVar);
    expect(actualJson).to.equal(correctJson);
  });
});
