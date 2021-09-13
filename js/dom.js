(function (doc) {
  'use strict';

  function DOM(element) {
    if (!(this instanceof DOM)) {
      return new DOM(element);
    }

    this.element = doc.querySelectorAll(element);
  }

  DOM.prototype.on = function on(event, callbackFunction) {
    Array.prototype.forEach.call(this.element, (element) => {
      element.addEventListener(event, callbackFunction, false);
    });
  };

  DOM.prototype.off = function off(event, callbackFunction) {
    Array.prototype.forEach.call(this.element, (element) => {
      element.removeEventListener(event, callbackFunction);
    });
  };

  DOM.prototype.get = function get() {
    return this.element;
  }

  DOM.prototype.forEach = function forEach() {
    return Array.prototype.forEach.apply(this.element, arguments);
  }

  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  }

  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  }

  DOM.prototype.reduce = function reduce() {
    return Array.prototype.reduce.apply(this.element, arguments);
  }

  DOM.prototype.reduceRight = function reduceRight() {
    return Array.prototype.reduceRight.apply(this.element, arguments);
  }

  DOM.prototype.every = function every() {
    return Array.prototype.every.apply(this.element, arguments);
  }

  DOM.prototype.some = function some() {
    return Array.prototype.some.apply(this.element, arguments);
  }

  function is(obj) {
    return Object.prototype.toString.call(obj)
  }

  DOM.isArray = function isArray(obj) {
    return is(obj) == '[object Array]' ? true : false;
  }

  DOM.isObject = function isObject(obj) {
    return is(obj) == '[object Object]' ? true : false;
  }

  DOM.isFunction = function isFunction(obj) {
    return is(obj) == '[object Function]' ? true : false;
  }

  DOM.isNumber = function isNumber(obj) {
    return is(obj) == '[object Number]' ? true : false;
  }

  DOM.isString = function isString(obj) {
    return is(obj) == '[object String]' ? true : false;
  }

  DOM.isBoolean = function isBoolean(obj) {
    return is(obj) == '[object Boolean]' ? true : false;
  }

  DOM.isNull = function isNull(obj) {
    return is(obj) == '[object Null]' || is(obj) == '[object Undefined]' ? true : false;
  }

  window.DOM = DOM;
})(document)