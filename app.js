var app = angular.module("myApp", ["ngRoute", "ui.bootstrap"]);

app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/analytics", {
        templateUrl: "./login/login.html",
        controller: "LoginController",
      })
      .when("/signup", {
        templateUrl: "/signup/signup.html",
        controller: "SignupController",
      })
      .when("/landingPage", {
        templateUrl: "/landingPage/landing-page.html",
        controller: "landingPageController",
      })
      .when("/addCar", {
        templateUrl: "addCar/add-car.html",
        controller: "addCarController",
      })
      .when("/profile", {
        templateUrl: "/profile/profile.html",
        controller: "ProfileController",
      })
      .when("/bookings", {
        templateUrl: "/bookings/bookings.html",
        controller: "BookingsController",
      })
      .when("/admin", {
        templateUrl: "/admin/admin.html",
        controller: "AdminController",
      })
      .when("/", {
        templateUrl: "/analytics/analytics.html",
        controller: "AnalyticsController",
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]);
