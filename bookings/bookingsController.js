app.controller("BookingsController", function ($scope, indexedDBService, $timeout) {
  if (!localStorage.getItem("currentUser")) {
    // User not logged in, redirect to login page
    window.location.href = "login.html";
  }

  $scope.activeTab = "ongoing";
  $scope.changeTab = function (tab) {
    $scope.activeTab = tab;
  };
  $scope.showToast = false;

  $scope.getDate = function (date) {
    return new Date(date).toISOString().split("T")[0];
  };

  // Retrieve the current user from local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser")).username;

  // Retrieve the user's bookings from IndexedDB
  indexedDBService
    .getAllDocumentsByIndex("uid", currentUser, "bookings")
    .then(function (bookings) {
      // Separate upcoming, previous, and ongoing trips
      $scope.upcomingTrips = bookings.filter(function (booking) {
        return new Date(booking.startDate) > new Date() && !booking.isCancelled;
      });

      $scope.previousTrips = bookings.filter(function (booking) {
        return new Date(booking.endDate) < new Date() && !booking.isCancelled;
      });

      $scope.ongoingTrips = bookings.filter(function (booking) {
        return new Date(booking.startDate) <= new Date() && new Date(booking.endDate) >= new Date() && !booking.isCancelled;
      });

      console.log("User bookings loaded successfully:", bookings);
    })
    .catch(function (error) {
      console.error("Error loading user bookings:", error);
      // Handle error, such as displaying an error message to the user
    });

  $scope.cancelBooking = function (booking) {
    var res = confirm("Are you sure you want to cancel this booking?");
    if (res) {
      booking.isCancelled = true;
      indexedDBService
        .addToDB(booking, "bookings", booking.id, "put")
        .then(function (booking) {
          console.log("Booking cancelled successfully");
          $scope.showToast = true;
          // Remove the cancelled booking from the ongoing trips
          $timeout(function () {
            $scope.showToast = false;
            $scope.upcomingTrips = $scope.upcomingTrips.filter(function (trip) {
              return trip.id !== booking.id;
            });
          }, 2000);
        })
        .catch(function (error) {
          console.error("Error cancelling booking:", error);
          // Handle error, such as displaying an error message to the user
        });
    }
  };
});
