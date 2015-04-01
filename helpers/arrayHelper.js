/* ******************************************************************
 *   Array functions
 * ****************************************************************** */
 
function range(from, to) {    
    if (!isDefined(to)) {
        to = from
        from = 0
    }    
    return Array.apply(null, Array(to)).map(function (_, i) {return from + i})
}
 
/**
 * Executes a function over each element of an array.
 * 
 * @param array
 * @param f
 */
function forEach (array, f) {
    for (var i = 0; i < array.length; i++) {
        f(array[i], i)    
    }   
}
 
/**
 * Tests if element is inside the given array with '==' equality.
 * 
 * @param element
 * @param array
 */
function includes(array, element) {
    return filter(array, function(x) { return element == x }).length > 0;
}

function filter(array, p) {
  var filtered = [];
  forEach(array, function (x) {
    if (!p(x)) {
      filtered.push(x);
    }
  });
  return filtered;
}

function find(array, p) {
  var result = null;
  for (var i = 0; i < array.length; i++) {
      if (p(array[i])) {
        result = array[i];
        break; // :(
      }
  }
  return result;
}
 
/**
 * Group array element in subarrays of n elements.
 * 
 * @param array
 * @param n 
 * @return grouped
 */
function groupN(array, n) {
    var grouped = []
    var temp = []
    var i = 0
    array.forEach(function(element) {        
        i++
        temp.push(element)
        if (i == n) { 
            i = 0 
            grouped.push(temp)
            temp = []
        }
    })
    if (temp.length > 0) {grouped.push(temp)}
    return grouped
}
 
/**
 * Group array in n subarrays which represents columns of a mxn matrix
 * represented by the given array.
 * 
 * @param array
 * @param n
 * @return grouped
 */
function groupInColumns(array, n) {
    var grouped = []
     
    for (var i = 0; i < n; i++) {
        var column = []
        for (var j = i; j < array.length; j + n) {
            column.push(array[j])
        }
        grouped.push(column)
    }
    return grouped
}