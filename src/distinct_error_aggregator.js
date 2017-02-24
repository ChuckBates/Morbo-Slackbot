module.exports = {
    aggregate_distinct_errors: aggregate_distinct_errors,
    increment_error_count: increment_error_count,
    is_error_in_list: is_error_in_list
}

function aggregate_distinct_errors(headers_and_stack_list) {
    if (headers_and_stack_list === undefined || JSON.stringify(headers_and_stack_list) === JSON.stringify([])) {
        return []
    }

    var distinct_list = []
    for (var i = 0; i < headers_and_stack_list.length; i++) {
        var error = headers_and_stack_list[i].stack
        if (!is_error_in_list(distinct_list, error)) {
            distinct_list.push({
                header_and_stack: headers_and_stack_list[i], 
                count: 1
            })
        } else {
            distinct_list = increment_error_count(distinct_list, error)
        }
    }

    return distinct_list.sort(compare_count)
}

function increment_error_count(distinct_list, error) {
    if (error === undefined || error === '') {
        return distinct_list
    }

    distinct_list.find(function(distinct) {
        if (distinct.header_and_stack.stack === error) {
            distinct.count++;
        }
    })   

    return distinct_list
}

function is_error_in_list(distinct_list, error) {
    if (error === undefined || error === '') {
        return false
    }

    if (JSON.stringify(distinct_list) === JSON.stringify([])) {
        return false
    }

    for (var i = 0; i < distinct_list.length; i++) {
        if (distinct_list[i].header_and_stack.stack === error) {
            return true
        }
    }

    return false
}

function compare_count(a, b) {
  return b.count - a.count
}