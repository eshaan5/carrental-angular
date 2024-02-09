app.controller('SignupController', function($scope, $location) {
    // Controller logic for signup page
    $scope.goToLogin = function() {
        $location.path('/');
    };
});