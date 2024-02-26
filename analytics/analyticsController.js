app.controller("AnalyticsController", function ($scope, DatesService, indexedDBService, AnalyticsService) {
  $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $scope.currentDate = new Date();
  $scope.startDate = DatesService.sevenDaysAgo();
  $scope.endDate = new Date();
  //   $scope.selectedTime = "12:00"; // Default value is 12 PM
  $scope.totalRevenue = 0;
  $scope.totalLogins = 0;
  $scope.totalSignups = 0;
  $scope.conversionRate = 0;
  $scope.topUsers = [];
  $scope.topCars = [];

  var startDate = $scope.startDate;
  var endDate = $scope.endDate;

  var chartsArray = [];

  $scope.verifyDates = function () {
    chartsArray.forEach(function (chart) {
      chart.destroy();
    });
    $scope.dateError = DatesService.verifyAnalyticsDates($scope.startDate, $scope.endDate, new Date());
    if (!$scope.dateError) {
      startDate = $scope.startDate;
      endDate = $scope.endDate;
      Promise.all(AnalyticsService.generateCharts(startDate, endDate)).then((results) => {
        chartsArray = results;
      });
    }
  };

  Promise.all(AnalyticsService.generateCharts(startDate, endDate)).then((results) => {
    chartsArray = results;
  });

  // Define other functions like dayWiseSales, generateBookingsChart, etc. as in the previous JavaScript code
});
