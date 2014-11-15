var panelscope;
var createNewNavigation = true;
var angular_location;
var angular_route;
var angular_q_defer;
var env = {};
var pushNewHistory = function(name, title, path) {
    panelscope.history.push(panelscope.newestPage);
    panelscope.newestPage = {
        name: name,
        title: title,
        path: path,
        variables: {},
        index: panelscope.history.length,
        onclick: function() {
            createNewNavigation = false;
            panelscope.history = panelscope.history.slice(0, this.index);
            panelscope.newestPage = this;
            /*
             * no need to do $scope.$apply here, the reason is from
             * https://docs.angularjs.org/error/$rootScope/inprog
             * we are already inside a $digest when the ngFocus directive makes another call to $apply(),
             * causing this error to be thrown.
             */
            if (angular_location.path() == path)
                angular_route.reload();
            else
                angular_location.path(path);
        }
    };
};
var updateNewestPage = function(name, variables) {
    if (typeof panelscope.newestPage.name == 'undefined')
        return;
    if (typeof name != 'undefined') {
        panelscope.newestPage.name = panelscope.newestPage.name.split(':')[0] + ':' + name.slice(0, 5) + '...';
        panelscope.newestPage.title = name;
    }
    $.extend(panelscope.newestPage.variables, variables);
};
var getNewestPage = function() {

    return panelscope.newestPage.variables;
};
var locateSequenceByTrace = function(json, jumpArgs, traceList) {
    if (traceList.length === 0) {
        if (typeof jumpArgs.sequence == "undefined" || json.sequence == jumpArgs.sequence) {
            if (typeof jumpArgs.local_revision == typeof json.local_revision)
                return true;
            else
                return false;
        } else
            return false;
    }
    var getName = traceList.splice(0, 1);
    if (typeof json[getName] != 'object')
        return false;
    if (json[getName] instanceof Array) {
        return json[getName].some(function(element, index, array) {
            return locateSequenceByTrace(element, jumpArgs, traceList);
        });
    } else {
        return locateSequenceByTrace(json[getName], jumpArgs, traceList);
    }
};
var findSequenceInActivity = function(data, key, jumpArgs) {
    var returnActivities = {
        from: key,
        activities: []
    };
    if (typeof data == 'undefined' || typeof data.object == 'undefined' || typeof data.object.recording == 'undefined')
        return returnActivities;
    var activities = data.object.recording.activities;
    if (typeof activities == 'undefined')
        return returnActivities;
    activities.forEach(function(value, index, array) {
        if (locateSequenceByTrace(value, jumpArgs, jumpArgs.trace.split('.')))
            returnActivities.activities.push(value);
    });
    return returnActivities;
};
/*
          <li><a id='debugConsole_utilities_0' style='' ng-show='user_role>=100' href="#/user-by-email">User By Email</a></li>
          <li><a id='debugConsole_utilities_1' style='' ng-show='user_role>=10' href="#/crash-report">Crash Reports</a></li>
          <li><a id='debugConsole_utilities_2' style='' ng-show='user_role>=100' href="#/check-request">Requests</a></li>
          <li><a id='debugConsole_utilities_3' style='' ng-show='user_role>=100' href="#/check-object-data">Object Data</a></li>
          <li><a id='debugConsole_utilities_4' style='' ng-show='user_role>=100' href="#/check-meet-object">Meet Object</a></li>
          <li><a id='debugConsole_utilities_5' style='' ng-show='user_role>=100' href="#/check-object-activity">Object Activity</a></li>
          <li><a id='debugConsole_utilities_6' style='' ng-show='user_role>=10' href="#/meet-log">Meet Log</a></li>
          <li><a id='debugConsole_utilities_7' style='' ng-show='user_role>=100' href="#/redo-job">Redo Job</a></li>
          <li><a id='debugConsole_utilities_8' style='' ng-show='user_role>0' href="#">Clear History</a></li>
          <li><a id='debugConsole_utilities_9' style='' ng-show='user_role>=100' href="#/decode-token">Decode Token</a></li>
*/
var scopeSetup = function(index) {
    if (typeof angular_q_defer != 'undefined')
        angular_q_defer.resolve();
    for (var i = 0; i < 10; i++) {
        document.getElementById('debugConsole_utilities_' + i).style.backgroundColor = (i == index ? '#cccccc' : '');
    }
    if (index == -1)
        return;
    if (index == 5)
        mx_printJSON.setShowLevel(5);
    else if (index == 9)
        mx_printJSON.setShowLevel(10);
    else
        mx_printJSON.setShowLevel(3);
    if (panelscope.user_role >= 100) {
        return;
    } else if (panelscope.user_role >= 10) {
        if (index != 1 && index != 6)
            angular_location.path('/blank');
    } else {
        angular_location.path('/blank');
    }
};
var showPrintJSON = function(scope, data) {
    scope.showdetail = true;
    var jsoncontainer = document.getElementById('renderjson');
    if (jsoncontainer === null)
        return;
    jsoncontainer.replaceChild(mx_printJSON(data), jsoncontainer.childNodes[0]);
    updateNewestPage(undefined, {
        jsoncontainer: jsoncontainer,
        data: data
    });
};
var restorePrintJSON = function(scope, getPage) {
    if (typeof getPage == 'undefined' || typeof getPage.jsoncontainer == 'undefined')
        return;
    //restore the internal variables for mx_printJSON
    if (typeof getPage.data == 'object' && getPage.data !== null)
        mx_printJSON(getPage.data);
    var jsoncontainer = document.getElementById('renderjson');
    jsoncontainer.parentNode.replaceChild(getPage.jsoncontainer, jsoncontainer);
    scope.showdetail = true;
    if (typeof getPage.scrollTop != 'undefined')
        $(window).scrollTop(getPage.scrollTop);
};
var ajaxOnWait = function(wait) {
    panelscope.waitAjax = wait;
    document.body.style.cursor = wait ? 'wait' : 'default';
};
var verifyUserRole = function(role) {
    if (typeof role == 'undefined')
        return 0;
    switch (role) {
        case 'USER_ROLE_NORMAL':
            return 0;
        case 'USER_ROLE_CRASH_REPORT_READ':
            return 10;
        case 'USER_ROLE_SERVER_STATUS_READ':
            return 100;
        case 'USER_ROLE_SUPERADMIN':
            return 150;
        case 'USER_ROLE_OBJECT_READ':
            return 200;
        case 'USER_ROLE_OBJECT_WRITE':
            return 300;
        default:
            return 0;
    }
};

//recording the scoll position for each page
$(window).on('scroll', function() {
    updateNewestPage(undefined, {
        scrollTop: $(window).scrollTop()
    });
});