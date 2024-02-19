app.controller("landingPageController", function ($scope, indexedDBService, DatesService, CarAvailabilityService, $timeout) {
  // Initialization
  $scope.dateError = false;
  $scope.availableCars = [];
  $scope.showRentModal = false;
  $scope.currentPage = 1;
  $scope.carsPerPage = 5;
  $scope.startDate = new Date();
  $scope.endDate = DatesService.tomorrowsDate();
  $scope.maxPage = 1;
  $scope.showToast = false;

  $scope.verifyDates = function () {
    $scope.dateError = DatesService.verifyDate($scope.startDate, $scope.endDate, new Date());
    $scope.checkCarAvailability();
  };

  $scope.checkCarAvailability = function () {
    // Perform validation
    if ($scope.dateError) {
      $scope.availableCars = [];
      return;
    }

    // Check car availability
    indexedDBService
      .getAllDocuments("cars")
      .then(function (cars) {
        return CarAvailabilityService.getAvailableCars(cars, $scope.startDate, $scope.endDate);
      })
      .then(function (availableCars) {
        $scope.availableCars = availableCars;
        $scope.maxPage = Math.ceil($scope.availableCars.length / $scope.carsPerPage);
      });
  };
  $scope.checkCarAvailability();

  $scope.changePage = function (change) {
    $scope.currentPage += change;
    if ($scope.currentPage < 1) {
      $scope.currentPage = 1;
    } else {
      $scope.maxPage = Math.ceil($scope.availableCars.length / $scope.carsPerPage);
      if ($scope.currentPage > $scope.maxPage) {
        $scope.currentPage = $scope.maxPage;
      }
    }
  };

  $scope.openRentNowModal = function (car) {
    $scope.rentStartDate = $scope.startDate;
    $scope.rentEndDate = $scope.endDate;

    $scope.selectedCar = car;
    $scope.rentAmount = car.rentAmount;

    $scope.updateRent();
    $scope.showRentModal = true;
  };

  $scope.closeRentNowModal = function () {
    $scope.showRentModal = false;
  };

  $scope.confirmRentNow = function () {
    var user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      // Handle the case where the username is not available
      alert("Error: User not logged in");
      return;
    }

    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();

    var bookingObject = {
      id: uuidv4(),
      startDate: $scope.rentStartDate,
      endDate: $scope.rentEndDate,
      user: user,
      uid: user.username,
      cid: $scope.selectedCar.number,
      car: $scope.selectedCar,
      totalAmount: $scope.totalRent,
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: hours + ":" + minutes,
    };

    indexedDBService
      .addToDB(bookingObject, "bookings", bookingObject.id)
      .then(function (bookingId) {
        $scope.showToast = true;
        $timeout(function () {
          $scope.showToast = false;
          $scope.checkCarAvailability();
          $scope.closeRentNowModal();
          window.location.href = "/bookings";
        }, 2000);
      })
      .catch(function (error) {
        console.error("Error confirming rent:", error);
        // Handle errors appropriately
      });
  };

  $scope.updateRent = function () {
    // Check for the availability first
    $scope.availabilityError = false;
    $scope.totalRent = 0;

    if ($scope.dateError) {
      $scope.totalRent = 0;
      return;
    }

    var isCarAvailable = CarAvailabilityService.checkCarAvailabilityForRent($scope.startDate, $scope.endDate, $scope.selectedCar.number);

    if (!isCarAvailable) {
      $scope.availabilityError = true;
      return;
    }

    // Calculate total rent
    $scope.totalRent = DatesService.dateDiffInDays($scope.endDate, $scope.startDate) * $scope.rentAmount;
  };

  $scope.onRentDateChange = function () {
    $scope.verifyDates();
    if (!$scope.dateError) $scope.updateRent();
  };
});
