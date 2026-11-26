/* Required by the client runtime on Safari versions older than 15.4. */
(function () {
  if (!Object.hasOwn) {
    Object.defineProperty(Object, 'hasOwn', { configurable: true, writable: true,
      value: function (object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
    });
  }
  function at(index) {
    if (this == null) throw new TypeError('Invalid receiver');
    var value = Object(this), length = value.length >>> 0;
    var number = Number(index) || 0;
    var integer = number < 0 ? Math.ceil(number) : Math.floor(number);
    var position = integer < 0 ? length + integer : integer;
    return position < 0 || position >= length ? undefined : value[position];
  }
  [Array.prototype, String.prototype].forEach(function (prototype) {
    if (!prototype.at) Object.defineProperty(prototype, 'at', { value: at, configurable: true, writable: true });
  });
}());
