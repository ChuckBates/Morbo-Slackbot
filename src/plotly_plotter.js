module.exports = {
    extract_x_y_values: extract_x_y_values
}

function extract_x_y_values(distinct_list) {
    if (distinct_list === undefined || JSON.stringify(distinct_list) === JSON.stringify([])) {
        return []
    }

    var x_values = []
    var y_values = []

    for (var i = 0; i < distinct_list.length; i++) {
        x_values.push(distinct_list[i].count)
        y_values.push(distinct_list[i].header_and_stack.stack)
    }

    return {x_values: x_values, y_values: y_values}
}