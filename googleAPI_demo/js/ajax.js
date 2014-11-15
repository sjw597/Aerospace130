var postLoginRequest = function(email, password, rememberMe) {
    var request = {
        type: "USER_REQUEST_LOGIN",
        object: {
            user: {
                email: email,
                pass: password
            }
        },
        params: []
    };
    if (rememberMe) {
        request.params.push({
            name: "USER_REQUEST_LOGIN_REMEMBER"
        });
    }
    //uncomment this part will not receive object.user.role,
    //then will be identified as normal user
    request.params.push({
        name: "USER_REQUEST_LOGIN_OUTPUT_BASIC"
    });
    var config = {
        method: 'POST',
        url: '/user',
        data: request,
        timeout: 1 * 60 * 1000,
        responseType: 'json'
    };
    return config;
};

var postLogoutRequest = function() {
    var request = {
        type: "USER_REQUEST_LOGOUT",
    };
    var config = {
        method: 'POST',
        url: '/user',
        data: request,
        timeout: 1 * 60 * 1000,
        responseType: 'json'
    };
    return config;
};

var getCrashReportRequest = function(query) {
    var url = '/crashreport?query=';
    if (typeof query != 'undefined')
        url += query;
    return url;
};

/*
 * we use transformResponse:[] to bypass the default transformResponse
 * bacause the data received is actually not json, but is identified
 * as json by angularJS.
 */
var getCrashReportDetailRequest = function(key) {
    if (typeof key == 'undefined')
        return;
    var detailreq = "/crashreport/" + key + "?" + Math.random();
    var config = {
        method: 'GET',
        url: detailreq,
        transformResponse: []
    };
    return config;
};

var postDeleteRequest = function(key) {
    var request = {
        type: "SERVER_DELETE_CRASH_REPORT",
        params: [{
            name: "SERVER_DOWNLOAD_CRASH_REPORT_NAME",
            string_value: key
        }]
    };
    var config = {
        method: 'POST',
        url: '/board?' + Math.random(),
        data: request,
        timeout: 1 * 60 * 1000,
        responseType: 'json'
    };
    return config;
};

var getRequestRequest = function(sequence, server, timestamp) {
    var url = '/object/';
    if (typeof server != 'undefined' && server !== '')
        url += server + '/';
    else
        url += 'log/';

    if (typeof sequence != 'undefined')
        url += sequence;
    if (typeof timestamp != 'undefined' && timestamp !== '') {
        url += '?ts=' + timestamp;
    }
    return url;
};

/*
 * The getObjectDataRequest is actually the same as
 * getMeetObjectRequest, we can merge these two if we want to
 */
var getObjectDataRequest = function(objectId, filter) {
    var url = '/object/';
    if (typeof objectId != 'undefined')
        url += objectId;
    if (typeof filter != 'undefined' && filter !== '')
        url += '?query=' + filter;
    return url;
};

var getMeetObjectRequest = function(boardId, filter) {
    var url = '/object/';
    if (typeof boardId != 'undefined')
        url += boardId;
    if (typeof filter != 'undefined' && filter !== '')
        url += '?query=' + filter;
    return url;
};

var getObjectActivityRequest = function(objectId) {
    var url = '/object/activity/';
    if (typeof objectId != 'undefined') {
        if (objectId[2] == '_')
            objectId = objectId.substr(3);
        url += objectId;
    }
    return url;
};

var getMeetLogRequest = function(meetId) {
    var url = '/object/';
    var domain = window.location.hostname;
    if (domain.indexOf('localhost') > -1 || domain.indexOf('grouphour.com') > -1)
        url += 'logdev';
    else if (domain.indexOf('moxtra.com') > -1)
        url += 'log';
    url += '/meet?key=';
    if (typeof meetId != 'undefined')
        url += meetId;
    return url;
};

var getUserByEmailRequest = function(email) {
    var url = '/object/email/';
    if (typeof email != 'undefined')
        url += email;
    return url;
};

var getRedoJobRequest = function(boardId, choice, sequence) {
    var url = '/object/redojob/';
    if (typeof boardId != 'undefined' && typeof choice != 'undefined')
        url += boardId + '_' + choice;
    if (choice == 'resource' && typeof sequence != 'undefined')
        url += '_' + sequence;
    return url;
};

var getFileRequest = function(hash) {
    var url = '/object/file/';
    if (typeof hash != 'undefined')
        url += hash;
    return url;
};

var getTokenRequest = function(token) {
    var url = '/object/';
    if (typeof token != 'undefined')
        url += 'token?t=' + token;
    return url;
};