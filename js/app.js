var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .when('/signup', {
            templateUrl: 'templates/signup.html',
            controller: 'SignupController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
