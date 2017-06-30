module.exports = {
    clean: clean
}

function clean(list) {
    var regEx = /(%[A-F,0-9][A-F,0-9])/
    if (list != undefined && list.length > 0) {
        list.forEach(function(element) {
            var stack = element.header_and_stack.stack
            if (stack != undefined && stack.length > 0 && stack.match(regEx)) {
                element.header_and_stack.stack = decodeURIComponent(stack)
            }
        }, this);
    }
    return list
}
