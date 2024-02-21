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

  this.verifyAnalyticsDates = function (startDate, endDate, currentDate) {
    var sDate = startDate.toISOString().split("T")[0];
    var eDate = endDate.toISOString().split("T")[0];
    var cDate = currentDate.toISOString().split("T")[0];
    var error = false;

    if (sDate > cDate || eDate > cDate) 
    return true;

    if (sDate > cDate) {
      error = true;
    }

    if (sDate > eDate) {
      error = true;
    }

    return error;
  }

  this.sevenDaysAgo = function () {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

  this.getDatesBetween = function (start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var dateArray = [];

    // Iterate through each day and push it to the array
    var currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }
});
