app.controller('LoginController', function($scope, $location) {
    // Controller logic for login page
    $scope.goToSignup = function() {
        $location.path('/signup');
    };
});