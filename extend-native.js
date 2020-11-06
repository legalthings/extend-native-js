// Add methods to native objects
+function() {
    var periodUnitNL = { 
        jaar: 'y', jaren: 'y', maand: 'M', maanden: 'M', week: 'w', weken: 'w', dag: 'd', dagen: 'd',
        uur: 'h', uren: 'h', minuut: 'm', minuten: 'm', seconde: 's', seconden: 's' 
    };

    //Extend String
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

        toDate: method(function() {
            if (this == "") return null;
            
            var date = moment(this + '');
            if (!date.isValid()) date = moment(this + '', 'L');
            date.defaultFormat = "L";
            return date;
        }),

        toDateTime: method(function() {
            if (this == "") return null;
        
            var date = moment(this + '');
            if (!date.isValid()) date = moment(this + '', 'L LT');
            date.defaultFormat = "L LT";
            return date.toString();
        }),

        toTime: method(function() {
            if (this == "") return null;
        
            var date = moment(this + '');
            if (!date.isValid()) date = moment(this + '', 'LT');
            date.defaultFormat = "LT";
            return date.toString();
        }),

        dateFormat: method(function(formatAs) {
            if (this == "") return null;

            var date = moment(this + '');
            if (!date.isValid()) date = moment(this + '', 'L');
            var locale = getDocumentLocale('momentjs');
            if (locale) date.locale(locale);
            
            return formatAs ? date.format(formatAs) : date.format('L');
        }),

        addPeriod: method(function(duration, unit) {
            if (typeof duration.amount !== 'undefined' && typeof duration.unit !== 'undefined') {
                unit = duration.unit;
                duration = duration.amount;
            }

            if (typeof periodUnitNL[unit] !== 'undefined') unit = periodUnitNL[unit];

            var date = this.toDate();
                        
            return date ? date.add(unit, duration).toString() : date;
        }),

        substractPeriod: method(function(duration, unit) {
            if (typeof duration.amount !== 'undefined' && typeof duration.unit !== 'undefined') {
                unit = duration.unit;
                duration = duration.amount;
            }
            
            if (typeof periodUnitNL[unit] !== 'undefined') unit = periodUnitNL[unit];

            var date = this.toDate();
            
            return date ? date.subtract(unit, duration).toString() : date;
        }),

        asList: method(function(listType) {
            var lines = this.split("\n");

            return lines.asList(listType);
        }),

        spelledOut: method(spelledOut),
        toFloat: method(toFloat),
        toNumber: method(toNumber),
        toCurrency: method(toCurrency),
        numberFormat: method(toNumberEn), //BC. Same as toNumber, but always use 'en' locale
        localeNumberFormat: method(toCurrency) //BC, replaced with toCurrency
    });

    //Extend Number
    Object.defineProperties(Number.prototype, {
        spelledOut: method(spelledOut),
        toFloat: method(toFloat),
        toNumber: method(toNumber),
        toCurrency: method(toCurrency),
        numberFormat: method(toNumberEn), //Same as toNumber, but always use 'en' locale
        localeNumberFormat: method(toCurrency) //BC, replaced with toCurrency
    });
    
    //Extend Array
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
        
        sumFields: method(function(fieldName){
            return this.reduce(function(acc, val) {
                if (val[fieldName]) {
                   return acc + parseInt(val[fieldName]);
                } else {
                   return acc;
               }
            }, 0);
        }),

        toString: method(function() {
            if (this.length && (this[0] === '' || this[0] === null)) this.shift();
            if (this.length === 0) return '';
            if (this.length === 1) return this[0] + '';
            
            return this.slice(0, -1).join(', ') + ' & ' + this[this.length -1];
        })
    });

    // minimal polyfill
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

    var fractionRegexp = /([,.])00$/;
    var euroRegexp = /(€)\s+/;
    
    //Format numbers as currency
    function toCurrency(currency, useLocale) {
        var locale = useLocale ? useLocale : getDocumentLocale('short');
        var number = parseNumber(this);
        if (!locale) return number;

        if (!currency) currency = 'EUR';
        var formater = new Intl.NumberFormat(locale, {style: 'currency', currency: currency});

        number = formater.format(number);
        number = number.replace(fractionRegexp, '$1-').replace(euroRegexp, '$1');

        return number;
    }

    //Cast number or string to float
    function toFloat() {
        return this == "" ? null : parseNumber(this); 
    }
    
    //Format numbers
    function toNumber(precision, useLocale) {
        if (typeof precision === 'undefined') precision = 0;
        if (typeof useLocale === 'undefined') useLocale = getDocumentLocale('short');

        var number = parseNumber(this);
        var options = {maximumFractionDigits: precision};
        var formater = new Intl.NumberFormat(useLocale, options);

        number = formater.format(number);

        return number;
    }

    //Format numbers in 'en' locale (BC)
    function toNumberEn(precision) {
        return toNumber.call(this, precision, 'en');
    }

    //Function for spelling numbers. For extending Number and String
    function spelledOut() {
        var number = parseInt(this);
        if (!(this instanceof Number) && (!this.length || number.toString().length !== this.length)) return this.toString();

        var locale = getDocumentLocale('short');
        if (!locale) return this.toString();

        if (['en','id','da','fr','in','nl'].indexOf(locale) === -1) return this.toString();
        return spellit(locale)(number);
    }


    //Return object representing property descriptors with given getter method
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
