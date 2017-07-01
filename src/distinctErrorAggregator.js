module.exports = {
    aggregateDistinctErrors: aggregateDistinctErrors,
    incrementErrorCount: incrementErrorCount,
    isErrorInList: isErrorInList
}

function aggregateDistinctErrors(headersAndStackList) {
    if (headersAndStackList === undefined || JSON.stringify(headersAndStackList) === JSON.stringify([])) {
        return []
    }

    var distinctList = []
    for (var i = 0; i < headersAndStackList.length; i++) {
        var error = headersAndStackList[i].stack
        if (!isErrorInList(distinctList, error)) {
            distinctList.push({
                headerAndStack: headersAndStackList[i], 
                count: 1
            })
        } else {
            distinctList = incrementErrorCount(distinctList, error)
        }
    }

    return distinctList.sort(compareCount)
}

function incrementErrorCount(distinctList, error) {
    if (error === undefined || error === '') {
        return distinctList
    }

    distinctList.find(function(distinct) {
        if (distinct.headerAndStack.stack === error) {
            distinct.count++;
        }
    })   

    return distinctList
}

function isErrorInList(distinctList, error) {
    if (error === undefined || error === '') {
        return false
    }

    if (JSON.stringify(distinctList) === JSON.stringify([])) {
        return false
    }

    for (var i = 0; i < distinctList.length; i++) {
        if (distinctList[i].headerAndStack.stack === error) {
            return true
        }
    }

    return false
}

function compareCount(a, b) {
  return b.count - a.count
}
