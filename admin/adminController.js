app.controller("AdminController", function ($scope, indexedDBService, $location) {
  $scope.showCarUpdateModal = false;
  $scope.showBookingsModal = false;
  $scope.showToast = false;
  $scope.cars = [];

  $scope.user = JSON.parse(localStorage.getItem("currentUser")).username;

  $scope.goTo = function (path) {
    if (path == "home") {
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

  $scope.displayCars = function () {
    indexedDBService
      .getAllDocuments("cars")
      .then(function (cars) {
        $scope.cars = cars.filter(function (car) {
          return !car.isDeleted;
        });
      })
      .catch(function (error) {
        console.error("Error displaying cars:", error);
      });
  };
  $scope.displayCars();

  $scope.deleteCar = function (car) {
    // Implementation of deleteCar function
    var res = confirm("Are you sure you want to delete this car?");
    if (!res) {
      return;
    }

    var toDelete = true;

    // check if car has any bookings
    indexedDBService
      .getAllDocumentsByIndex("cid", car.number, "bookings")
      .then(function (bookings) {
        bookings.some(function (booking) {
          if (new Date(booking.endDate) > new Date()) {
            toDelete = false;
          }
        });

        if (!toDelete) {
          alert("Car has active bookings. Cannot delete.");
          return;
        }

        car.isDeleted = true;
        return indexedDBService.addToDB(car, "cars", car.number, "put");
      })
      .then(function (car) {
        $scope.displayCars();
      })
      .catch(function (error) {
        console.error("Error getting bookings:", error);
      });
  };

  $scope.openCarUpdateModal = function (carNumber) {
    $scope.showCarUpdateModal = true;
    $scope.carToUpdate = carNumber;
    // Other logic for opening modal
  };

  $scope.closeCarUpdateModal = function () {
    $scope.showCarUpdateModal = false;
    // Reset input fields and other modal cleanup
  };

  $scope.uploadImage = function (files) {
    var reader = new FileReader();

    reader.onload = function (event) {
      $scope.$apply(function () {
        $scope.newImage = event.target.result; // Store the image data
      });
    };

    reader.readAsDataURL(files[0]); // Read the file as a data URL
  };

  $scope.updateDetails = function () {
    var carNumber = $scope.carToUpdate;
    console.log(carNumber);

    // Retrieve the car object from IndexedDB
    indexedDBService
      .getByKey(carNumber, "cars")
      .then(function (car) {
        console.log(car);
        const newRent = $scope.newRent || car.rentAmount;
        const updatedCar = {
          ...car,
          image: $scope.newImage || car.image,
          rentAmount: newRent,
        };

        // Update car in IndexedDB
        return indexedDBService.addToDB(updatedCar, "cars", carNumber, "put");
      })
      .then(function () {
        $scope.closeCarUpdateModal();
        $scope.displayCars();
        $scope.showToast();
      })
      .catch(function (error) {
        console.error("Error updating car:", error);
      });
  };

  $scope.showBookings = function (carNumber) {
    $scope.showBookingsModal = true;
    $scope.bookings = [];

    // Retrieve the car from IndexedDB
    indexedDBService.getAllDocumentsByIndex("cid", carNumber, "bookings").then(function (bookings) {
      $scope.bookings = bookings;
    });
  };

  $scope.showToast = function () {
    $scope.showPasswordToast = true;
    setTimeout(function () {
      $scope.showPasswordToast = false;
      $scope.$apply(); // Trigger digest cycle to update view
    }, 3000);
  };

  $scope.closeBookingsModal = function () {
    $scope.showBookingsModal = false;
    // Other logic for closing modal
  };

  // Initialize data on page load
  $scope.displayCars();
});
