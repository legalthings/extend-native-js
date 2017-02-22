/*
 * Add methods to native objects
 */

+function() {
    var periodUnitNL = { 
        jaar: 'y', jaren: 'y', maand: 'M', maanden: 'M', week: 'w', weken: 'w', dag: 'd', dagen: 'd',
        uur: 'h', uren: 'h', minuut: 'm', minuten: 'm', seconde: 's', seconden: 's' 
    };

    // Extend String
    Object.defineProperties(String.prototype, {
        capitalize: method(function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }),

        camelCase: method(function() {
            return this.replace(/(^|\s)([a-z])/g , function(m, p1, p2) { return p1 + p2.toUpperCase(); });
        }),

        toInt: method(function() {
            return this == "" ? null : parseInt(this);
        }),

        toFloat: method(function() {
            return this == "" ? null : parseFloat(this); 
        }),

        toDate: method(function() {
            if (this == "") return null;
            
            var date = moment(this + '', "L");
            date.defaultFormat = "L";
            return date;
        }),

        toDateTime: method(function() {
            if (this == "") return null;
        
            var date = moment(this + '', "L LT");
            date.defaultFormat = "L LT";
            return date;
        }),

        toTime: method(function() {
            if (this == "") return null;
        
            var date = moment(this + '', "LT");
            date.defaultFormat = "LT";
            return date;
        }),

        dateFormat: method(function(formatAs) {
            if (this == "") return null;

            var format = 'L';
            var date = moment(this + '', format);
            var locale = getDocumentLocale('momentjs');
            if (locale) date.locale(locale);
            
            return formatAs ? date.format(formatAs) : date.format(format);
        }),

        addPeriod: method(function(duration, unit) {
            if (typeof duration.amount !== 'undefined' && typeof duration.unit !== 'undefined') {
                unit = duration.unit;
                duration = duration.amount;
            }

            if (typeof periodUnitNL[unit] !== 'undefined') unit = periodUnitNL[unit];
            
            return this.toDate().add(unit, duration);
        }),

        substractPeriod: method(function(duration, unit) {
            if (typeof duration.amount !== 'undefined' && typeof duration.unit !== 'undefined') {
                unit = duration.unit;
                duration = duration.amount;
            }
            
            if (typeof periodUnitNL[unit] !== 'undefined') unit = periodUnitNL[unit];
            
            return this.toDate().substract(unit, duration);
        }),

        asList: method(function(listType) {
            var lines = this.split("\n");

            return lines.asList(listType);
        })
    });
    
    // Extend Array
    Object.defineProperties(Array.prototype, {
        asList: method(function(listType) {
            if (!listType) listType = 'ul';
            if (['ol','ul'].indexOf(listType) === -1) {
                throw 'When representing as list, list type should be one of "ul" or "ol"';
            }

            var list = document.createElement(listType);
            for (var i = 0; i < this.length; i++) {
                if (this[i] === null || !this[i].toString().trim()) continue;

                var item = document.createElement('li');
                item.appendChild(document.createTextNode(this[i]));
                list.appendChild(item);
            };

            return list.children.length ? list.outerHTML: null;
        }),

        toString: method(function() {
            if (this.length === 0) return '';
            if (this.length === 1) return this[0];
            
            return this.slice(0, -1).join(', ') + ' & ' + this[this.length -1];
        })
    });

    // Minimal polyfill
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', method(function(item) {
            return this.indexOf(item) >= 0;
        }));
    }

    // Polyfill
    if (!Array.isArray) {
        Object.defineProperty(Array, 'isArray', method(function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        }));
    }

    // Extend Number
    Object.defineProperties(Number.prototype, {
        spelledOut: method(function() {
            return typeof window.spell === 'undefined' ? this.toString() : window.spell(this);
        })
    });

    // Return object representing property descriptors with given getter method
    function method(getter) {
        if (!getter instanceof Function) {
            throw 'Getter should be a function';
        }

        return {
            enumerable: false,
            configurable: false,
            get: function() {
                return getter;
            }
        };
    }
}();

