app.controller("ProfileController", [
  "$scope",
  "indexedDBService",
  "$timeout",
  "$location",
  function ($scope, indexedDBService, $timeout, $location) {
    $scope.user = {};
    $scope.showPasswordForm = false;
    $scope.currentPassword = "";
    $scope.newPassword = "";
    $scope.confirmPassword = "";
    $scope.passwordChangeError = "";
    $scope.showToast = false;

    $scope.user = JSON.parse(localStorage.getItem("currentUser")).username;

    $scope.goTo = function (path) {
      if (path == 'home') {
        if ($scope.user === "admin") {
          $location.path("/admin");
        } else {
          $location.path("/landingPage");
        }
        return;
      }
      $location.path(path);
    };

    $scope.logout = function () {
      localStorage.removeItem("currentUser");
      $location.path("/");
    };

    // Load user details when the page is loaded
    $scope.loadUserDetails = function () {
      indexedDBService
        .getByKey($scope.user, "users")
        .then(function (user) {
          $scope.user = user;
          $scope.welcomeMessage = "Welcome, " + (user.firstName || "") + " " + (user.lastName || "") + "!";
        })
        .catch(function (error) {
          console.error("Error loading user details:", error);
          // Handle error
        });
    };

    $scope.showChangePasswordForm = function () {
      $scope.showPasswordForm = true;
    };

    $scope.closePasswordForm = function () {
      $scope.showPasswordForm = false;
      $scope.currentPassword = "";
      $scope.newPassword = "";
      $scope.confirmPassword = "";
    };

    $scope.submitForm = function () {
      // Implementation similar to the original JavaScript function
      // Use UserService to change password
      if ($scope.currentPassword !== $scope.user.password) {
        $scope.passwordChangeError = "Current password is incorrect";
        return;
      }

      if ($scope.newPassword !== $scope.confirmPassword) {
        $scope.passwordChangeError = "New password and confirm password do not match";
        return;
      }

      $scope.user.password = $scope.newPassword;
      indexedDBService.addToDB($scope.user, "users", $scope.user, "put").then(
        function (user) {
          console.log("Password changed successfully:", user);
          $scope.showToast = true;
          $scope.closePasswordForm();
          $timeout(function () {
            $scope.showToast = false;
          }, 2000);
        },
        function (error) {
          console.error("Error changing password:", error);
          $scope.passwordChangeError = "Error changing password";
        }
      );
    };

    // Load user details when the controller is initialized
    $scope.loadUserDetails();
  },
]);
