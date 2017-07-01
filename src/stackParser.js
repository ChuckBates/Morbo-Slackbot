module.exports = {
    parse: parse,
    extractFirstStatement: extractFirstStatement,
    removeFirstStatement: removeFirstStatement,
    handleUncaughtOrInnerException: handleUncaughtOrInnerException,
    handleCorporateSubscription: handleCorporateSbscription,
    extractShortError: extractShortError,
    stackHasMoreSeparators: stackHasMoreSeparators
}

function parse(stack) {
    var firstStatement = extractFirstStatement(stack, ':')
    if (firstStatement.includes('has a corporate subscription')) {
        return handleCorporateSbscription(stack)
    }

    if (firstStatement.startsWith('Inner exception') || firstStatement.startsWith('Uncaught exception')) {
        return handleUncaughtOrInnerException(stack)
    }

    return firstStatement !== '' ? firstStatement : 'Unknown Error (Unable to parse)'
}

function extractFirstStatement(stack, separator) {
    if (stack === undefined || stack === '' || !stack.includes(separator)) {
        return ''
    }

    return stack.substring(0, stack.indexOf(separator, 0))
}

function removeFirstStatement(stack, separator) {
    if (stack === undefined || stack === '' || !stack.includes(separator)) {
        return ''
    }

    if (stack.includes(separator + separator)) {
        stack = stack.replace(separator + separator, separator)
    }

    stack = stack.replace(extractFirstStatement(stack, separator), '')
    if (stack.startsWith(separator)) {
        stack = stack.substring(1)
    }

    return stack.trim()
}

function handleUncaughtOrInnerException(stack) {
    if (stack === undefined || stack === '' || (!stack.startsWith('Uncaught exception') && !stack.startsWith('Inner exception'))) {
        return ''
    }

    stackMinusFirstBlock = removeFirstStatement(stack, ':')
    stackMinusSecondBlock = removeFirstStatement(stackMinusFirstBlock, ':')
    thirdBlock = extractFirstStatement(stackMinusSecondBlock, ';')
    return extractShortError(thirdBlock, ' ')
}

function handleCorporateSbscription(stack) {
    if (stack === undefined || stack === '' || !extractFirstStatement(stack, ':').includes('has a corporate subscription')) {
        return ''
    }

    return 'User has a corporate subscription'
}

function extractShortError(stack, space) {
    if (stack === undefined || stack === '') {
        return ''
    }

    var index = stack.length > 100 ? 100 : stack.length

    if (stack.substring(0, index).includes('.' + space)) {
        stack = extractFirstStatement(stack, '.' + space)
    }

    if (stack.substring(0, index).includes(':' + space)) {
        stack = extractFirstStatement(stack, ':' + space)
    }

    if (stack.substring(0, index).includes(';' + space)) {
        stack = extractFirstStatement(stack, ';' + space)
    }

    if (stack.substring(0, index).includes(',' + space)) {
        stack = extractFirstStatement(stack, ',' + space)
    }

    if (stack.length > 75 && stackHasMoreSeparators(stack, '')) {
        stack = extractShortError(stack, '')
    }

    if (stack.length > 75) {
        stack = stack.slice(0, 60) + '...'
    }
    return stack
}

function stackHasMoreSeparators(stack, space) {
    if (stack === undefined || stack === '') {
        return false
    }

    if (stack.includes(':' + space) || stack.includes(',' + space) || stack.includes(';' + space) || stack.includes('.' + space)) {
        return true
    }

    return false
}
