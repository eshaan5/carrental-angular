app.service("AnalyticsService", function (indexedDBService, DatesService) {
  function generateDayWiseChart(startDate, endDate, res) {
    var labelArray = [];

    for (var i = 0; i < Math.ceil(DatesService.getDatesBetween(startDate, endDate).length / 7); i++) {
      labelArray.push(`Occurence ${i + 1}`);
    }
    console.log(labelArray);
    // Sample data for 7 line charts
    var datasets = [
      { label: "Sunday", data: res[0], borderColor: "rgba(255, 99, 132, 1)", fill: false },
      { label: "Monday", data: res[1], borderColor: "rgba(54, 162, 235, 1)", fill: false },
      { label: "Tuesday", data: res[2], borderColor: "rgba(255, 206, 86, 1)", fill: false },
      { label: "Wednesday", data: res[3], borderColor: "rgba(75, 192, 192, 1)", fill: false },
      { label: "Thursday", data: res[4], borderColor: "rgba(153, 102, 255, 1)", fill: false },
      { label: "Friday", data: res[5], borderColor: "rgba(255, 159, 64, 1)", fill: false },
      { label: "Saturday", data: res[6], borderColor: "rgba(255, 99, 71, 1)", fill: false },
    ];

    var data = {
      labels: labelArray,
      datasets: datasets,
    };

    var options = {
      scales: {
        x: {
          type: "category",
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    var config = {
      type: "line",
      data: data,
      options: options,
    };

    const ctx = document.getElementById("day-wise-chart").getContext("2d");
    const myLineChart = new Chart(ctx, config);

    return myLineChart;

    // Create the chart
  }

  function dayWiseSales(startDate, endDate) {
    var dates = DatesService.getDatesBetween(startDate, endDate);
    console.log(dates);
    var labelArray = [];

    for (var i = 1; i <= Math.ceil(dates.length / 7); i++) {
      labelArray.push(`Occurrence ${i}`);
    }

    var res = [[], [], [], [], [], [], []];

    return indexedDBService
      .getAllDocuments("bookings")
      .then((allBookings) => {
        console.log(allBookings);
        dates.forEach((date) => {
          var day = new Date(date).getDay();

          var bookings = allBookings.filter((booking) => {
            return booking.bookingDate === date && !booking.isCancelled;
          });
          console.log(bookings);
          res[day].push(bookings.length);
        });

        res.forEach((day) => {
          while (day.length < labelArray.length) {
            day.push(0);
          }
        });

        console.log(res);

        return generateDayWiseChart(startDate, endDate, res);
      })
      .catch((error) => {
        console.error("Error retrieving bookings:", error);
        return [];
      });
  }

  this.generateAnalytics = function (sDate, eDate) {
    var startDate = sDate.toISOString().split("T")[0];
    var endDate = eDate.toISOString().split("T")[0];

    return dayWiseSales(startDate, endDate);
  };
});
