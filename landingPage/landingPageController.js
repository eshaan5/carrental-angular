app.controller("landingPageController", function ($scope, indexedDBService, verifyDateFactory) {
  // Initialization
  $scope.dateError = false;
  $scope.availableCars = [];
  $scope.showRentModal = false;
  $scope.currentPage = 1;
  $scope.carsPerPage = 5;
  $scope.startDate = new Date();
  $scope.endDate = verifyDateFactory.tomorrowsDate();

  $scope.verifyDates = function () {
    $scope.dateError = verifyDateFactory.verifyDate($scope.startDate, $scope.endDate, new Date());
  };

  $scope.checkCarAvailability = function () {
    // Perform validation
    if ($scope.dateError) {
      return;
    }

    // Check car availability
    indexedDBService
      .getAllDocuments("cars")
      .then(function (cars) {
        return getAvailableCars(cars, $scope.startDate, $scope.endDate);
      })
      .then(function (availableCars) {
        $scope.availableCars = availableCars;
      });
  };

  $scope.changePage = function (change) {
    $scope.currentPage += change;
    if ($scope.currentPage < 1) {
      $scope.currentPage = 1;
    } else {
      var maxPage = Math.ceil($scope.availableCars.length / $scope.carsPerPage);
      if ($scope.currentPage > maxPage) {
        $scope.currentPage = maxPage;
      }
    }
    displayAvailableCars(getAvailableCars($scope.startDate, $scope.endDate));
  };

  $scope.openRentNowModal = function (car) {
    $scope.rentStartDate = $scope.startDate;
    $scope.rentEndDate = $scope.endDate;

    $scope.selectedCar = car;
    $scope.rentAmount = car.rentAmount;

    updateRent();
    $scope.showRentModal = true;
  };

  $scope.closeRentNowModal = function () {
    $scope.showRentModal = false;
  };

  $scope.confirmRentNow = function () {
    var username = localStorage.getItem("currentUser");

    if (!username) {
      // Handle the case where the username is not available
      alert("Error: User not logged in");
      return;
    }

    var bookingObject = {
      id: generateUUID(),
      startDate: $scope.rentStartDate,
      endDate: $scope.rentEndDate,
      uid: username,
      cid: $scope.selectedCar.number,
      totalAmount: $scope.totalRent,
      bookingDate: currentDate,
      bookingTime: currentTime,
    };

    // Update bookings array in IndexedDB
    var newBookingId;
    indexedDBService
      .addToDB(bookingObject, "bookings", bookingObject.id, "put")
      .then(function (bookingId) {
        newBookingId = bookingId.id;
        // Retrieve existing cars from IndexedDB
        return indexedDBService.getByKey($scope.selectedCar.number, "cars");
      })
      .then(function (car) {
        if (car) {
          // Update bookings array in the selected car
          car.bookings = car.bookings || [];
          car.bookings.push(newBookingId);

          return indexedDBService.addToDB(car, "cars", car.number, "put");
        }
      })
      .then(function () {
        // Retrieve existing users from IndexedDB
        return indexedDBService.getByKey(username, "users");
      })
      .then(function (currentUser) {
        if (currentUser) {
          // Update bookings array in the user's profile
          currentUser.bookings = currentUser.bookings || [];
          currentUser.bookings.push(newBookingId);

          return indexedDBService.addToDB(currentUser, "users", username, "put");
        }
      })
      .then(function () {
        // Close the modal after confirmation
        $scope.closeRentNowModal();

        // Display a success message or perform any additional actions
        $scope.showPasswordToast = true;
        return showPasswordToast();
      })
      .then(function () {
        window.location.href = "#/bookings";
      })
      .catch(function (error) {
        console.error("Error confirming rent:", error);
        // Handle errors appropriately
      });
  };

  $scope.updateRent = function () {
    // Check for the availability first
    $scope.availabilityError = "";
    $scope.totalRent = 0;

    var startRentDate = $scope.rentStartDate;
    var endRentDate = $scope.rentEndDate;

    if (startRentDate < currentDate) {
      $scope.availabilityError = "Start date should not be behind the current date.";
      return;
    }

    if (startRentDate >= endRentDate) {
      $scope.availabilityError = "Start date should not be greater than end date.";
      return;
    }

    var isCarAvailable = checkCarAvailabilityForRent(startRentDate, endRentDate, $scope.selectedCar.number);

    if (!isCarAvailable) {
      $scope.availabilityError = "Car is not available for the selected period.";
      return;
    }

    // Calculate total rent
    $scope.totalRent = dateDiffInDays(endRentDate, startRentDate) * $scope.rentAmount;
  };

  $scope.logout = function () {
    // Your logout logic here
  };

  // Other functions and variables...
});
