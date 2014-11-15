var MX_DebugConsoleApp = angular.module('MX_DebugConsoleApp', ['ngRoute', 'consoleControllers']);

MX_DebugConsoleApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/demo1', {
            templateUrl: 'partials/demo1.html',
            controller: 'demo1Ctrl'
        }).when('/blank', {
            templateUrl: 'partials/blank.html',
            controller: 'blankCtrl'
        }).otherwise({
            redirectTo: '/blank'
        });
    }
]);