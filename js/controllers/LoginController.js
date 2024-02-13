app.controller("LoginController", function ($scope, $location) {
  // Controller logic for login page
  $scope.goToSignup = function () {
    $location.path("/signup");
  };
  $scope.formData = {}; // Initialize form data object
  $scope.login = function () {
    // Login logic
    console.log("Form data:", $scope.formData);
  };
});
