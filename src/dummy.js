module.exports = {
    get: get, 
    getInner: getInner
}

function get() {
    // By defining my own module.exports at the begining of the file, and by mocking in the test, the mock would only override the "getInner" defined in the 
    // module.exports and NOT the function. By calling "module.exports" the mock covers both. 
    return module.exports.getInner()
}

function getInner() {
    return {data: 'bad'}
}
