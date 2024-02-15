var app = angular.module("myApp", ["ngRoute", "ui.bootstrap"]);

app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "templates/login.html",
        controller: "LoginController",
      })
      .when("/signup", {
        templateUrl: "templates/signup.html",
        controller: "SignupController",
      })
      .when("/landingPage", {
        templateUrl: "templates/landing-page.html",
        controller: "landingPageController",
      })
      .when("/addCar", {
        templateUrl: "templates/add-car.html",
        controller: "addCarController",
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]);
