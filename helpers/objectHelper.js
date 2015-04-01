/* ******************************************************************
 *   Object functions
 * ****************************************************************** */
 
/**
 * Gets an object's field value.
 * 
 * @param object
 * @param field
 */
function project(object, field) {
    return object[field]
}
 
/**
 * Clones an object.
 * 
 * @param object
 */
function clone(object) {
    var newObject = {}
    forEach(keys(object), function(key) {        
        newObject[key] = object[key]        
    })
    return newObject
}
 
/**
 * Clones an object with only a subset of keys.
 * 
 * @param object
 * @param keys Array of strings.
 */
function cloneSubset(object, keys) {    
    var newObject = {}
    forEach(keys, function(key) {
        newObject[key] = object[key]
    })
    return newObject
}
 
/**
 * Clones an object excluding some keys.
 * 
 * @param object
 * @param excluding Array of strings.
 */
function cloneExcluding(object, excluding) {
    var newObject = {}
    forEach(keys(object), function(key) {
        if (!include(key, excluding)) {
            newObject[key] = object[key]
        }
    })
    return newObject
}


/**
 * Clones an object replacing a key name with another.
 * 
 * @param object
 * @param keyReplacements An object where it's keys represent the keys to be replaced and it's values the replacement.
 */
function cloneReplacing(object, keyReplacements) {
    var newObject = {}
    forEach(keys(object), function(key) {
        if (!(key in keyReplacements)) {
            newObject[key] = object[key]
        } else {
            newObject[keyReplacements[key]] = object[key]
        }
    })
    return newObject
}
 
/**
 * Clones an object applying formattings by key.
 * 
 * @param object
 * @param keyFormattings An object where key values are functions (value -> newValue).
 */
function cloneFormatting(object, keyFormattings) {
    var newObject = {}
    forEach(keys(object), function(key) {
        if (key in keyFormattings) {
            newObject[key] = keyFormattings[key](object[key])
        } else {
            newObject[key] = object[key]
        }
    })
    return newObject    
}
 
/**
 * Clones an object mapping object's values. 
 * 
 * @param object
 * @param f (key, value) -> newValue
 */
function cloneMapping(object, f) {
    var newObject = {}
    forEach(keys(object), function(key) {
        newObject[key] = f(key, object[key])        
    })
    return newObject
}
 
/**
 * Clones an object discarding (key, value) where
 * predicate evaluates "true".
 * 
 * @param object
 * @param predicate A function receiving (key, value) arguments.
 */
function cloneDiscarding(object, predicate) {
    var newObject = {}
    forEach(keys(object), function(key) {
        if (!predicate(key, object[key])) {
            newObject[key] = object[key]        
        }
    })
    return newObject    
}
 
/**
 * Indicates presence of attribute in an object.
 * 
 * @param object
 * @param attribute
 */
function hasAttr(object, attribute) { 
    return isDefined(object[attribute]); 
}
 
/**
 * Object's keys array.
 * 
 * @param obj
 */
function keys(obj) { return Object.keys(obj) }
 
/**
 * Array of alphabetically sorted object's keys.
 * 
 * @param obj
 */
function sortedKeys(obj) {
    return keys(obj).sort()
}
 
/**
 * Denotes if the value is an object.
 * 
 * @param val
 */
function isObject(val) {
    if (val === null) { 
        return false
    }
    return ((typeof val === 'function') || (typeof val === 'object'))
}
 
/**
 * Object fields of type 'object' are turned into json strings.
 * 
 * @param obj
 * @return newObj
 */
function stringifyObjectFields(obj) {
    newObj = {}
    keys(obj).forEach(
        function(key) {            
            if (isObject(obj[key])) {
                newObj[key] = JSON.stringify(obj[key])
            } else {
                newObj[key] = obj[key]
            }
        }
    )
    return newObj
}