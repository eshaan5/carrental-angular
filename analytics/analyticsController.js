app.controller("AnalyticsController", function ($scope, DatesService, indexedDBService, AnalyticsService) {
  $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $scope.currentDate = new Date();
  $scope.startDate = DatesService.sevenDaysAgo();
  $scope.endDate = new Date();
  //   $scope.selectedTime = "12:00"; // Default value is 12 PM
  $scope.showMainContainer = false;
  $scope.totalRevenue = 0;
  $scope.totalLogins = 0;
  $scope.totalSignups = 0;
  $scope.conversionRate = 0;
  $scope.topUsers = [];
  $scope.topCars = [];

  var startDate = $scope.startDate;
  var endDate = $scope.endDate;

  $scope.verifyDates = function () {
    $scope.dateError = DatesService.verifyAnalyticsDates($scope.startDate, $scope.endDate, new Date());
    console.log($scope.dateError);
    if (!$scope.dateError) AnalyticsService.generateAnalytics(startDate, endDate);
  };

  AnalyticsService.generateAnalytics(startDate, endDate)
  .then(function (data) {
    console.log(data);
  })

  // Define other functions like dayWiseSales, generateBookingsChart, etc. as in the previous JavaScript code
});
