app.controller("SignupController", function ($scope, $location, indexedDBService, $timeout) {
  // Controller logic for signup page
  $scope.goToLogin = function () {
    $location.path("/");
  };
  $scope.formData = {}; // Initialize form data object
  $scope.confirmPassword;
  $scope.arePasswordsEqual = true;
  $scope.usernameExists = false;
  $scope.show = false;

  $scope.showToast = function () {
    $scope.show = true;
    console.log($scope.show);
  };

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

    indexedDBService
      .getByKey($scope.formData.username, "users")
      .then((user) => {
        if (user) {
          $scope.usernameExists = true;
          return;
        }

        $scope.formData.registeredOn = new Date().toISOString().split("T")[0];
        $scope.formData.logins = 0;

        return indexedDBService.addToDB($scope.formData, "users", $scope.formData.username);
      })
      .then((user) => {
        if (user) {
          console.log("User added successfully:", user);
          $timeout(function () {
            $scope.show = true;
            $scope.$apply();
          }, 200);

          // Use $timeout instead of setTimeout
          // $timeout(() => {
          //   $scope.goToLogin();
          // }, 2000);
        }
      });
  };
});
