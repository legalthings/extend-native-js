# Extend native JavaScript objects

Add methods to native JavaScript object prototypes.

_Beware: Modifying the native JavaScript objects might lead to unexpected behaviour._

## String methods

### string capitalize()

Turn the first character of a string into uppercase.

### string camelCase()

Turn a sentense into CamelCase.

### float toInt()

Turn the string into an integer using `parseInt`.

### float toFloat()

Turn the string into an float using `parseFloat`.

### Date toDate()

Turn the string into a Date object with 'date' format, using [moment.js](https://momentjs.com/).

### Date toDateTime()

Turn the string into a Date object with 'date time' format, using [moment.js](https://momentjs.com/).

### Date toTime()

Turn the string into a Date object with 'time' format, using [moment.js](https://momentjs.com/).

### string dateFormat(string formatAs)

Turn the string into a Date object, than format that date.

### Date addPeriod(int duration, string unit) or Date addPeriod(object period)

Turn the string into a Date object, than add a period.

### Date substractPeriod(int duration, string unit) or Date substractPeriod(object period)

Turn the string into a Date object, than substract a period.

### string asList(string listType)

Split the string on a line break, than turn the lines into an unordered (`<ul>`) or ordered (`<ol>`) list.


## Array methods    

### string asList(string listType)

Create an unordered (`<ul>`) or ordered (`<ol>`) list with each item in the array.

### string toString()

Join the items of array with a komma.

### boolean includes(item)

Minimal polyfill of [Array.includes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/includes).


## Array functions

### boolean isArray

Polyfill of [Array.isArray](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).


## Number methods

### spelledOut()

Spell out the numbers using the [spell-it library](https://github.com/jmosbech/spell-it).

```js
window.spell = spellit('fr');

var number = 42;
console.log(number.spelledOut());
// fourty two
```

