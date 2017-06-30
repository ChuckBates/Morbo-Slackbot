module.exports = {
    clean: clean
}

function clean(list) {
    var regEx = /(%[A-F,0-9][A-F,0-9])/
    if (list != undefined && list.length > 0) {
        list.forEach(function(element) {
            var stack = element.header_and_stack.stack
            if (stack != undefined && stack.length > 0) {
                element.header_and_stack.stack = cleanHtml(decodeURIComponent(stack))
            }
        }, this);
    }
    return list
}

function cleanHtml(stack) {
    var htmlMap = [
        ['amp', '&'],
        ['apos', '\''],
        ['lt', '<'],
        ['gt', '>']
    ];

    htmlMap.forEach(function(map){
        stack = stack.replace(new RegExp('&' + map[0], 'g'), map[1]);
    });

    return stack
}
