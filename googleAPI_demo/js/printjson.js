var module;

(module || {}).exports = mx_printJSON = (function() {
    var mx_printJSON;
    var oneIndent = '   ';
    var showLevel = 3;
    var expandBtn_array = '[+]';
    var expandBtn_object = '{+}';
    var collapseBtn = '[-]';
    var setJump = false;
    var jumpArgs = {};
    var A_location;
    var A_route;
    var A_scope;
    var currentJSON = {};
    var jumpTo = function(path) {
        setJump = true;
        /*
         * thanks to https://groups.google.com/forum/#!topic/angular/nFbtADyEHg8
         */
        A_scope.$apply(function() {
            if (A_location.path() != path)
                A_location.path(path);
            else
                A_route.reload();
        });
    };
    var span = function(txt) {
        var s = document.createElement('span');
        s.appendChild(document.createTextNode(txt));
        return s;
    };
    var A = function(id, func) {
        var a = document.createElement('a');
        a.appendChild(document.createTextNode(id));
        a.style.cursor = 'pointer';
        return a;
    };
    var br = function() {
        return document.createElement('br');
    };
    var append = function() {
        var base = arguments[0];
        for (var a = 1; a < arguments.length; a++) {
            if (typeof arguments[a] == 'object')
                base.appendChild(arguments[a]);
            else
                base.appendChild(span(arguments[a]));
        }
        return base;
    };
    var expandA = function(id, json, level, trace) {
        var button_label = expandBtn_object;
        if (json instanceof Array)
            button_label = expandBtn_array;
        var a = A(button_label);
        a.onclick = function() {
            var nextLevel = expandOneLevel(id, json, level, false, trace);
            var collapseButton = collapseA(id, json, level, trace);
            a.parentNode.insertBefore(nextLevel, a);
            a.parentNode.insertBefore(collapseButton, nextLevel);
            a.parentNode.removeChild(a);
        };
        return a;
    };
    var collapseA = function(id, json, level, trace) {
        var a = A(collapseBtn);
        a.onclick = function() {
            var expandedTree = a.nextSibling;
            expandedTree.parentNode.insertBefore(expandA(id, json, level, trace), expandedTree);
            expandedTree.parentNode.removeChild(expandedTree);
            a.parentNode.removeChild(a);
        };
        return a;
    };
    var getIdA = function(id, value, json) {
        var a = A(value);
        a.onclick = function(e) {
            jumpArgs.id = id;
            jumpArgs.objectId = json[value];
            switch (id) {
                case 'activities':
                    var sequence = "";
                    if (jumpArgs.objectId[8] == '-')
                        sequence = jumpArgs.objectId.slice(0, 36);
                    else if (jumpArgs.objectId[23] == '_')
                        sequence = jumpArgs.objectId.split('-')[0];
                    else if (jumpArgs.objectId[24] == '_')
                        sequence = jumpArgs.objectId.slice(0, 24);
                    var popupWindow = window.open(getRequestRequest(sequence, json.server, json.created_time), "", "scrollbars=1,width=600,height=600,left=" + e.screenX + ",top=" + e.screenY);
                    popupWindow.onload = function() {
                        /*
                         * Since the popup uses mx_printJSON, which will modifies currentJSON,
                         * so we have to keep a backup of currentJSON so we can go back later.
                         */
                        var currentJSON_bak = currentJSON;
                        var popupElement = popupWindow.document.body.childNodes[0];
                        var text = JSON.parse(popupElement.innerHTML);
                        popupWindow.document.title = sequence;
                        popupWindow.document.body.replaceChild(mx_printJSON(text), popupElement);
                        var css = popupWindow.document.createElement('link');
                        css.rel = 'stylesheet';
                        css.href = '/css/bootstrap.min.css';
                        popupWindow.document.body.appendChild(css);
                        currentJSON = currentJSON_bak;
                    };
                    break;
                default:
                    jumpTo('/check-object-data');
            }
        };
        return a;
    };
    var getHashA = function(hash) {
        if (typeof hash == 'undefined')
            return "hash";
        var a = A("hash");
        a.onclick = function(e) {
            var popupWindow = window.open(getFileRequest(hash), "", "scrollbars=1,width=600,height=600,left=" + e.screenX + ",top=" + e.screenY);
        };
        return a;
    };
    var getSvgA = function(svg_tag) {
        if (typeof svg_tag == 'undefined')
            return 'svg_tag';
        var a = A('svg_tag');
        a.onclick = function(e) {
            var popupWindow = window.open('', '', "scrollbars=1,width=800,height=600,left=" + e.screenX + ",top=" + e.screenY);
            popupWindow.document.body.style.margin = '0px';
            popupWindow.document.body.innerHTML = '<svg height="100%" width="100%">' + svg_tag + '</svg>';
        };
        return a;
    };
    var getTimeA = function(id, value, created_time, updated_time, sequence, local_revision, trace) {
        if (typeof created_time == 'undefined' || typeof updated_time == 'undefined')
            return value;
        var a = A(value);
        a.onclick = function() {
            jumpArgs.id = id;
            jumpArgs.created_time = created_time;
            jumpArgs.updated_time = updated_time;
            jumpArgs.sequence = sequence;
            jumpArgs.local_revision = local_revision;
            jumpArgs.trace = trace;
            var traceList = trace.split('.');
            if (traceList.length >= 2)
                jumpArgs.objectId = currentJSON[traceList[0]][traceList[1]].id;
            jumpTo('/check-object-activity');
        };
        return a;
    };

    var expandOneLevel = function(id, json, level, firstTime, trace) {
        var indent = '';
        for (var i = 0; i < level; i++) {
            indent += oneIndent;
        }
        var container = span('');
        //container.id = "mx_printJSON_" + id + "_level_" + level;
        var closure = '{}';
        if (json instanceof Array)
            closure = '[]';
        else {
            if (trace === '')
                trace += id;
            else
                trace += '.' + id;
        }
        append(container, closure[0], br());
        Object.keys(json).forEach(function(value, index, array) {
            if (typeof json[value] != 'object') {
                var insertTitle = value;
                var insertValue = span(json[value]);
                if (value == 'id')
                    insertTitle = getIdA(id, value, json);
                if (value == 'hash')
                    insertTitle = getHashA(json.hash);
                if (value == 'svg_tag')
                    insertTitle = getSvgA(json.svg_tag);
                else if (value == 'sequence' || value == 'local_revision')
                    insertTitle = getTimeA(id, value, json.created_time, json.updated_time, json.sequence, json.local_revision, trace);
                if (value.indexOf('time') > -1)
                    insertValue.title = (new Date(json[value])).toLocaleString();
                append(container, indent, insertTitle, ' : ', insertValue, br());
            } else {
                var name = value;
                var showIndex = value;
                if (json instanceof Array) {
                    name = id;
                    if (typeof json[value] != "undefined" && typeof json[value].sequence != "undefined")
                        showIndex = json[value].sequence;
                }
                if (level < showLevel && firstTime)
                    append(container, indent, showIndex, ' : ', collapseA(value, json[value], level + 1, trace), expandOneLevel(name, json[value], level + 1, true, trace), br());
                else
                    append(container, indent, showIndex, ' : ', expandA(name, json[value], level + 1, trace), br());
            }
        });
        append(container, indent.substr(oneIndent.length), closure[1]);
        return container;
    };

    mx_printJSON = function(json) {
        currentJSON = json;
        return append(document.createElement('pre'), collapseA('', json, 1, ''), expandOneLevel('', json, 1, true, ''));
    };
    //Both checkFlag and getArgs will reset the local variable, so it can be only use once per jump
    mx_printJSON.checkFlag = function() {
        if (setJump) {
            setJump = false;
            return true;
        } else {
            return false;
        }
    };
    mx_printJSON.getArgs = function() {
        var tempJumpArgs = jumpArgs;
        jumpArgs = {};
        return tempJumpArgs;
    };
    mx_printJSON.setAngularService = function(location, route, scope) {
        A_location = location;
        A_route = route;
        A_scope = scope;
    };
    mx_printJSON.getCurrentJSON = function() {
        return currentJSON;
    };
    mx_printJSON.setShowLevel = function(level) {
        showLevel = level;
    };
    mx_printJSON.changeButtons = function(expand_array, expand_object, collapse) {
        expandBtn_array = expand_array;
        expandBtn_object = expand_object;
        collapseBtn = collapse;
    };
    return mx_printJSON;
})();