//delay function
/**
 * 
 * @param {number} ms 
 * @returns <Promise>
 */
const delay = ms => new Promise(res => setTimeout(res, ms));


const uniqueArrayOnObjectProperties = (array, key) => {
    return [...new Map(array.map(item =>
        [item[key], item])).values()];


}


module.exports = {
    delay,
    uniqueArrayOnObjectProperties,
    formatNumberForWhatsapp

}