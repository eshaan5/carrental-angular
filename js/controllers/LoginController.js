app.controller("LoginController", function ($scope, $location, indexedDBService) {
  indexedDBService.checkObject();

  $scope.user = localStorage.getItem("currentUser");
  if ($scope.user) {
    if ($scope.user === "admin") {
      $location.path("/admin");
    } else {
      $location.path("/landingPage");
    }
  }

  // Controller logic for login page
  $scope.goToSignup = function () {
    $location.path("/signup");
  };
  $scope.formData = {}; // Initialize form data object
  $scope.login = function () {
    const credential = $scope.formData.user;
    const password = $scope.formData.password;

    // Retrieve user from IndexedDB
    indexedDBService
      .getByKey(credential, "users")
      .then((userByUsername) => {
        indexedDBService
          .getByKey(credential, "users", "email")
          .then((userByEmail) => {
            const user = userByUsername || userByEmail;

            if (user && user.password === password) {
              // Successful login
              $scope.loginFailed = false;

              // Store the current user's username in local storage
              localStorage.setItem("currentUser", user.username);

              // Update login timestamp
              user.logins = user.logins + 1;
              indexedDBService.addToDB(user, "users", "username", "put").then(() => {
                console.log("User logged in:", user);
                if (user.username === "admin") {
                  $location.path("/admin");
                } else {
                  // Redirect to the landing page
                  $location.path("/landingPage");
                }
              });
            } else {
              // Invalid credentials
              $scope.loginFailed = true;
            }
          })
          .catch((error) => {
            console.error("Error retrieving user by email:", error);
            $scope.loginFailed = true;
          });
      })
      .catch((error) => {
        console.error("Error retrieving user by username:", error);
        $scope.loginFailed = true;
      });
  };
});
