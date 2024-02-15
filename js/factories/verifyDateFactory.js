app.factory("verifyDateFactory", function () {
  return {
    verifyDate: function (startDate, endDate, currentDate) {
      var error = false;

      if (startDate < currentDate) {
        error = true;
      }

      if (startDate >= endDate) {
        error = true;
      }

      return error;
    },
    tomorrowsDate: function () {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
  };
});
