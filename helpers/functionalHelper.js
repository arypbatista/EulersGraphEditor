/*
 * Source: http://benalman.com/news/2012/09/partial-application-in-javascript/#partial-application-from-the-left
 */
Function.prototype.partial = function (/*, args...*/) {
    // A reference to the Array#slice method.
    var slice = Array.prototype.slice;

    // Convert arguments object to an array, removing the first argument.
    var args = slice.call(arguments, 1);
    
    var fn = this;
    
    return function() {
        // Invoke the originally-specified function, passing in all originally-
        // specified arguments, followed by any just-specified arguments.
        return fn.apply(this, args.concat(slice.call(arguments, 0)));
    };

};

Function.prototype.callback = function (self) {
    var func = this;    
    return function() {        
        return func.apply(iff(self === undefined, this, self), arguments);
    };

}

function iff(b, v1, v2) {
    var result = v2;
    if (b) {
        result = v1;
    }
    return result;
}

/**
 * Tests if a given value is defined.
 * 
 * @param value
 */
function isDefined(value) { return !(value === undefined); }