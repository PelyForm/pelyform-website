const isObject = (input) => {
    if (Array.isArray(input) || input === null || typeof input === 'function') return false;
    else if (typeof input === 'object') return true;
    return false;
};

const isPropertiesInObject = (Obj, ObjPropertiesArray) => {
    return ObjPropertiesArray.every((prop) => prop in Obj);
};

const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

const isRealPositiveNumber = (number) => {
    return Math.sign(number) === 1 ? true : false;
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const isString = (input) => {
    if (!(typeof input === 'string') || !input.trim().length) return false;
    return true;
};

const isArrayString = (input) => {
    if (!Array.isArray(input)) return { e: 'invalid data type', r: null };

    const validate = [];
    for (let i = 0; input.length > i; i++) {
        validate.push(isString(input[i]) ? true : false);
    }
    return validate;
};
function getUnwantedProperties(obj, props) {
    const extra = [];
    Object.keys(obj).forEach((prop) => {
        if (!props.includes(prop)) extra.push(prop);
    });
    return extra;
}

const isArrayOfObjectsWithProperties = (arr, props) => {
    return arr.every((obj) => props.every((prop) => prop in obj));
};

const isObjectWithProperties = (obj, props) => {
    return props.every((prop) => prop in obj);
};

const isArrayOfObjectsWithSomeProperties = (arr, props) => {
    return arr.every((obj) => props.some((prop) => prop in obj));
};

const isObjectWithSomeProperties = (obj, props) => {
    return props.some((prop) => prop in obj);
};

const isArrayOfObjectsWithoutProperties = (arr, props) => {
    return arr.every((obj) => props.every((prop) => !(prop in obj)));
};

const isObjectWithoutProperties = (obj, props) => {
    return props.every((prop) => !(prop in obj));
};

const isArrayOfObjectsWithPropertyValue = (arr, prop, value) => {
    return arr.every((obj) => obj[prop] === value);
};

const isObjectWithPropertyValue = (obj, prop, value) => {
    return obj[prop] === value;
};
const findIndexByPropertyValue = (arr, prop, value) => {
    return arr.findIndex((obj) => obj[prop] === value);
};

const deepClone = (input) => {
    if (input === null || typeof input !== 'object') {
        return input;
    }

    let output = Array.isArray(input) ? [] : {};
    for (let key in input) {
        if (input.hasOwnProperty(key)) {
            output[key] = deepClone(input[key]);
        }
    }

    return output;
};

function beautifyString(input, capitalizeFirstLetter = false) {
    let result = input
        .replace(/(_|-)/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();

    if (capitalizeFirstLetter) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return result;
}
function convertCentsToUSD(cents) {
    if (typeof cents !== 'number' || cents < 0) {
        throw new Error('Invalid input: cents must be a non-negative number');
    }
    return (cents / 100).toFixed(2);
}
module.exports = {
    isObject,
    isString,
    isArrayString,
    isPropertiesInObject,
    isRealPositiveNumber,
    isObjectWithProperties,
    isObjectWithoutProperties,
    isObjectWithPropertyValue,
    isObjectWithSomeProperties,

    isArrayOfObjectsWithPropertyValue,
    isArrayOfObjectsWithoutProperties,
    isArrayOfObjectsWithSomeProperties,
    isArrayOfObjectsWithProperties,
    findIndexByPropertyValue,

    getUnwantedProperties,
    capitalizeFirstLetter,
    isValidEmail,
    deepClone,
    beautifyString,
    convertCentsToUSD,
};
