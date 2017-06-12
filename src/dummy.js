module.exports = {
    get: get, 
    getInner: getInner
}

function get() {
    return getInner()
}

function getInner() {
    return {data: 'bad'}
}
