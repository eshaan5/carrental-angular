app.service("DatesService", function () {
  this.verifyDate = function (startDate, endDate, currentDate) {
    var sDate = new Date(startDate).toISOString().split("T")[0];
    var eDate = new Date(endDate).toISOString().split("T")[0];
    var cDate = new Date(currentDate).toISOString().split("T")[0];
    var error = false;

    if (sDate < cDate) {
      error = true;
    }

    if (sDate >= eDate) {
      error = true;
    }

    return error;
  };
  this.tomorrowsDate = function () {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  this.dateDiffInDays = function (date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const diffInMilliseconds = Math.abs(firstDate - secondDate);
    const diffInDays = Math.round(diffInMilliseconds / oneDay);

    return diffInDays;
  };
});
