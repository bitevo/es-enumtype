# Enum Type for ECMAScript

This enum type implementation focuses on elegance of code, avoids unnecessary features and ambiguity. Thus things like nested enum will never be implemented.

## Installation

```
npm i -S enumtype
```

## Usage

### Enum definition and access

```javascript

const EnumType = require('enumtype');

const MyAccessType = EnumType.define([
    'READ',
    'WRITE',
    'READWRITE'
]);

let accessType = MyAccessType.READ;
let invalidAccessType = MyAccessType.EXECUTE; // This will throw RangeError

// Print all element names
for (let name in MyAccessType) {
    console.log(name);
}
```

### Validation

```javascript
const EnumType = require('enumtype');
const MyEnum = EnumType.define(['ONE', 'TWO']);

// Verify if an object is an enum
console.log('The right way to verify enum object: ', MyEnum instanceof EnumType);

// Use in operator to validate both enum labels and values
console.log('Label check:', 'ONE' in MyEnum); // true
let oneValue = MyEnum.ONE;
console.log('Value check:', oneValue in MyEnum); // true

// Elements from different definitions are not equal
const MyEnum2 = EnumType.define(['ONE', 'TWO']);
console.log('Are two similar enum definitions equal?', MyEnum.ONE === MyEnum2.ONE); // false
```

### Serialization

```javascript
// Don't use JSON.stringify to get JSON representation of enum
console.log('JSON of MyEnum', EnumType.toJson(MyEnum));
```

### Caveats

```enumtype``` uses ```Proxy``` to enforce valid element access by throwing error when an undefined element is accessed. On the other hand ```JSON.stringify``` implementation of current NodeJS (last checked on v8.x) seems to check the existence of ```toJSON``` method by actually accessing it, not using something like ```in``` operator. Therefore calling ```JSON.stringify```directly on ```enumtype``` object will throw an error.
