app.controller('AdminController', function ($scope, indexedDBService) {
        if (!localStorage.getItem("currentUser")) {
            // User not logged in, redirect to login page
            window.location.href = "login.html";
        }

        $scope.showCarUpdateModal = false;
        $scope.showBookingsModal = false;
        $scope.showToast = false;
        $scope.cars = [];

        $scope.displayCars = function () {
            indexedDBService.getAllDocuments("cars")
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
            car.isDeleted = true;
            indexedDBService.addToDB(car, "cars", car.number, "put")
                .then(function (car) {
                    $scope.displayCars();
                })
                .catch(function (error) {
                    console.error("Error deleting car:", error);
                });
        };

        $scope.openCarUpdateModal = function (carNumber) {
            $scope.showCarUpdateModal = true;
            // Other logic for opening modal
        };

        $scope.closeCarUpdateModal = function () {
            $scope.showCarUpdateModal = false;
            // Reset input fields and other modal cleanup
        };

        $scope.updateCar = function () {
            // Implementation of updateCar function
        };

        $scope.showToast = function () {
            $scope.showPasswordToast = true;
            setTimeout(function () {
                $scope.showPasswordToast = false;
                $scope.$apply(); // Trigger digest cycle to update view
            }, 3000);
        };

        $scope.showBookings = function (carNumber) {
            // Implementation of showBookings function
        };

        $scope.closeBookingsModal = function () {
            $scope.showBookingsModal = false;
            // Other logic for closing modal
        };

        // Initialize data on page load
        $scope.displayCars();
    });
