const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const saltRound = 10;

async function convertToHash(plainText) {
    if (typeof plainText === 'string') return await bcrypt.hash(plainText, saltRound);
}

function compareHash(plainText, hash) {
    const match = bcrypt.compareSync(plainText, hash);
    return match;
}

const computeHash = function (secret, payload) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return hmac.digest('base64');
};

const hashIsValid = function (secret, payload, verify) {
    return crypto.timingSafeEqual(Buffer.from(verify), Buffer.from(computeHash(secret, payload), 'base64'));
};

module.exports = {
    convertToHash,
    compareHash,
    computeHash,
    hashIsValid,
};
