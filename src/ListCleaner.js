module.exports = {
    clean: clean
}

function clean(list) {
    var regEx = /(%[A-F,0-9][A-F,0-9])/
    if (list != undefined && list.length > 0) {
        list.forEach(function(element) {
            var stack = element.headerAndStack.stack
            if (stack != undefined && stack.length > 0) {
                if (stack.match(regEx)) {
                    stack = stack + ' \(URL decoded\)'
                }
                element.headerAndStack.stack = cleanHtml(decodeURIComponent(stack))
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

    var regEx1 = /(&['amp','apos','lt','gt'])/
    var regEx2 = /(&['amp','apos','lt','gt'];)/
    if (stack.match(regEx1) || stack.match(regEx2)) {
        stack = stack + ' \(HTML decoded\)'
    }

    htmlMap.forEach(function(map){
        stack = stack.replace(new RegExp('&' + map[0] + ';', 'g'), map[1])
        stack = stack.replace(new RegExp('&' + map[0], 'g'), map[1])
    });

    return stack
}
