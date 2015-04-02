/*
    This file is part of Euler's Graph Editor.

    Euler's Graph Editor is free software: you can redistribute it and/or 
    modify it under the terms of the GNU General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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

function dummy() {}