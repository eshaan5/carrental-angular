app.controller("addCarController", function ($scope, $location, indexedDBService, $timeout) {
  // Controller logic for add car page
  $scope.goToLandingPage = function () {
    $location.path("/landingPage");
  };
  $scope.formData = {}; // Initialize form data object
  $scope.show = false;
  $scope.plateNumberExists = false;

  $scope.showToast = function () {
    $scope.show = true;
    console.log($scope.show);
  };

  $scope.uploadImage = function (files) {
    var reader = new FileReader();

    reader.onload = function (event) {
      $scope.$apply(function () {
        $scope.formData.image = event.target.result; // Store the image data
      });
    };

    reader.readAsDataURL(files[0]); // Read the file as a data URL
  };

  $scope.submitForm = function () {
    // Handle form submission here

    $scope.formData.isDeleted = false;
    var carIsPresent = false;

    indexedDBService
      .getByKey($scope.formData.number, "cars")
      .then((car) => {
        if (car) {
          if (car.isDeleted) carIsPresent = true;
          else {
            $scope.plateNumberExists = true;
            $scope.addCar.$invalid = true;
            $scope.$apply();
            return;
          }
        }

        if ($scope.addCar.$invalid) {
          return;
        }

        if (carIsPresent) {
          $scope.formData.isDeleted = false;
          return indexedDBService.addToDB($scope.formData, "cars", $scope.formData.number, "put");
        }
        return indexedDBService.addToDB($scope.formData, "cars", $scope.formData.number);
      })
      .then((car) => {
        if (car) {
          console.log("Car added successfully:", car);
          $timeout(function () {
            $scope.show = true;
            $scope.$apply();
          }, 200);
        }
      });
  };
});
