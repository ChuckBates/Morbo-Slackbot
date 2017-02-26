module.exports = {
    parse: parse,
    extract_first_statement: extract_first_statement,
    remove_first_statement: remove_first_statement,
    handle_uncaught_or_inner_exception: handle_uncaught_or_inner_exception,
    handle_corporate_subscription: handle_corporate_subscription,
    extract_short_error: extract_short_error
}

function parse(stack) {
    var first_statement = extract_first_statement(stack, ':')
    if (first_statement.includes('has a corporate subscription')) {
        return handle_corporate_subscription(stack)
    }

    if (first_statement.startsWith('Inner exception') || first_statement.startsWith('Uncaught exception')) {
        return handle_uncaught_or_inner_exception(stack)
    }
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

function handle_uncaught_or_inner_exception(stack) {
    if (stack === undefined || stack === '' || (!stack.startsWith('Uncaught exception') && !stack.startsWith('Inner exception'))) {
        return ''
    }

    stack_minus_first_block = remove_first_statement(stack, ':')
    stack_minus_second_block = remove_first_statement(stack_minus_first_block, ':')
    third_block = extract_first_statement(stack_minus_second_block, ';')
    return extract_short_error(third_block)
}

function handle_corporate_subscription(stack) {
    if (stack === undefined || stack === '' || !extract_first_statement(stack, ':').includes('has a corporate subscription')) {
        return ''
    }

    return 'User has a corporate subscription'
}

function extract_short_error(stack) {
    if (stack === undefined || stack === '') {
        return ''
    }

    var index = stack.length > 100 ? 100 : stack.length

    if (stack.substring(0, index).includes('. ')) {
        stack = extract_first_statement(stack, '. ')
    }

    if (stack.substring(0, index).includes(': ')) {
        stack = extract_first_statement(stack, ': ')
    }

    if (stack.substring(0, index).includes('; ')) {
        stack = extract_first_statement(stack, '; ')
    }

    if (stack.substring(0, index).includes(', ')) {
        stack = extract_first_statement(stack, ', ')
    }

    return stack
}
