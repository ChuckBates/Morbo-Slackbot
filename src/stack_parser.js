module.exports = {
    extract_first_statement: extract_first_statement,
    remove_first_statement: remove_first_statement
}

function extract_first_statement(stack, separator) {
    if (stack === undefined || stack === '' || !stack.includes(separator)) {
        return ''
    }

    return stack.substring(0, stack.indexOf(separator, 0))
}

function remove_first_statement(stack, separator) {
    if (stack === undefined || stack === '' || !stack.includes(separator)) {
        return ''
    }

    if (stack.includes(separator + separator)) {
        stack = stack.replace(separator + separator, separator)
    }

    stack = stack.replace(extract_first_statement(stack, separator), '')
    if (stack.startsWith(separator)) {
        stack = stack.substring(1)
    }

    return stack.trim()
}