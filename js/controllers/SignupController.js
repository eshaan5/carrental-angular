app.controller("SignupController", function ($scope, $location) {
  // Controller logic for signup page
  $scope.goToLogin = function () {
    $location.path("/");
  };
  $scope.formData = {}; // Initialize form data object
  $scope.confirmPassword;
  $scope.arePasswordsEqual = true;

  $scope.confirm = function () {
    if ($scope.formData.password !== $scope.confirmPassword) {
      $scope.arePasswordsEqual = false;
      $scope.signupForm.$invalid = true;
    } else {
      $scope.arePasswordsEqual = true;
      $scope.signupForm.$invalid = false;
    }
  };

  $scope.submitForm = function () {
    // Handle form submission here
    if ($scope.signupForm.$invalid) {
      return;
    }
    console.log("Form data:", $scope.formData);
    // You can perform further validation and submit data to backend API
  };
});
