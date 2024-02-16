app.service("CarAvailabilityService", function ($q, indexedDBService) {
  this.getAvailableCars = function (cars, startDate, endDate) {
    var deferred = $q.defer();

    var bookingPromises = cars.reduce(function (promises, car) {
      var carId = car.number; // Assuming car ID is stored in 'id' property
      return promises.concat(getBookingsForCar(carId));
    }, []);

    // Resolve all booking promises
    $q.all(bookingPromises)
      .then(function (allBookings) {
        // Filter available cars based on bookings
        var availableCars = cars.filter(function (car) {
          return isCarAvailable(car, allBookings, startDate, endDate);
        });
        deferred.resolve(availableCars);
      })
      .catch(function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  function getBookingsForCar(carId) {
    // Assuming getByKey function retrieves bookings for a given car ID
    return indexedDBService.getByKey(carId, "bookings", "cid");
  }

  function isCarAvailable(car, allBookings, startDate, endDate) {
    var carId = car.number; // Assuming car ID is stored in 'id' property
    return !allBookings.some(function (booking) {
      if (!booking) {
        return false;
      }
      return booking.cid === carId && bookingOverlaps(booking, startDate, endDate);
    });
  }

  function bookingOverlaps(booking, startDate, endDate) {
    var bookingStartDate = booking.startDate;
    var bookingEndDate = booking.endDate;
    return endDate >= bookingStartDate && startDate <= bookingEndDate;
  }

  this.checkCarAvailabilityForRent = function (startRentDate, endRentDate, selectedCar) {
    // Retrieve existing bookings using indexedDB
    // Get all bookings for the selected car
    return indexedDBService.getByKey(selectedCar, "bookings", "cid")
      .then(function (carBookings) {

        if (!carBookings) {
          return true;
        }

        console.log("Car bookings:", carBookings);
        // Check for overlap with existing bookings
        const overlap = carBookings.some((booking) => {
          const bookingStartDate = booking.startDate;
          const bookingEndDate = booking.endDate;
          return endRentDate >= bookingStartDate && startRentDate <= bookingEndDate;
        });

        // If there is no overlap, the car is considered available for rent
        return !overlap;
      })
      .catch((error) => {
        console.error("Error checking car availability:", error);
        // Reject the promise if there is an error
        throw error;
      });
  };
});
