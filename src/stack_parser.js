module.exports = {
    extract_first_statement: extract_first_statement
}

function extract_first_statement(stack, separator) {
    if (stack === undefined || stack === '' || !stack.includes(separator)) {
        return ''
    }

    return stack.substring(0, stack.indexOf(separator, 0))
}