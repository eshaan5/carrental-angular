app.controller("AnalyticsController", function ($scope, DatesService, indexedDBService, AnalyticsService, $location) {
  $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $scope.currentDate = new Date();
  $scope.startDate = DatesService.sevenDaysAgo();
  $scope.endDate = new Date();
  //   $scope.selectedTime = "12:00"; // Default value is 12 PM
  $scope.totalRevenue = 0;
  $scope.totalSignups = 0;
  $scope.topUsers = [];
  $scope.topCars = [];

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

  var startDate = $scope.startDate;
  var endDate = $scope.endDate;

  var chartsArray = [];

  function doAnalysis() {
    AnalyticsService.generateCharts(startDate, endDate)
      .then((results) => {
        chartsArray = results.charts;
        $scope.totalRevenue = results.revenue;
        $scope.topUsers = results.topUsers;
        $scope.topCars = results.topCars;
        return AnalyticsService.getTotalRegistrations(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]);
      })
      .then((totalRegistrations) => {
        $scope.totalSignups = totalRegistrations;
        $scope.$apply();
      });
  }

  $scope.verifyDates = function () {
    chartsArray.forEach(function (chart) {
      chart.destroy();
    });
    $scope.dateError = DatesService.verifyAnalyticsDates($scope.startDate, $scope.endDate, new Date());
    if (!$scope.dateError) {
      startDate = $scope.startDate;
      endDate = $scope.endDate;
      doAnalysis();
    }
  };

  doAnalysis();

  // Define other functions like dayWiseSales, generateBookingsChart, etc. as in the previous JavaScript code
});
