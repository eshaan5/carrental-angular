app.service("AnalyticsService", function (indexedDBService, DatesService) {
  // start of dayWiseSales function
  function generateDayWiseChart(startDate, endDate, res) {
    var labelArray = [];

    for (var i = 0; i < Math.ceil(DatesService.getDatesBetween(startDate, endDate).length / 7); i++) {
      labelArray.push(`Occurence ${i + 1}`);
    }
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

    var ctx = document.getElementById("day-wise-chart").getContext("2d");
    var myLineChart = new Chart(ctx, config);

    return myLineChart;

    // Create the chart
  }

  function dayWiseSales(startDate, endDate) {
    var dates = DatesService.getDatesBetween(startDate, endDate);
    var labelArray = [];

    for (var i = 1; i <= Math.ceil(dates.length / 7); i++) {
      labelArray.push(`Occurrence ${i}`);
    }

    var res = [[], [], [], [], [], [], []];

    return indexedDBService
      .getAllDocuments("bookings")
      .then((allBookings) => {
        dates.forEach((date) => {
          var day = new Date(date).getDay();

          var bookings = allBookings.filter((booking) => {
            return booking.bookingDate === date && !booking.isCancelled;
          });
          res[day].push(bookings.length);
        });

        res.forEach((day) => {
          while (day.length < labelArray.length) {
            day.push(0);
          }
        });

        return generateDayWiseChart(startDate, endDate, res);
      })
      .catch((error) => {
        console.error("Error retrieving bookings:", error);
        return [];
      });
  }
  // end of dayWiseSales function

  // start of generateBookingsChart function

  function getBookings(startDate, endDate) {
    return new Promise((resolve, reject) => {
      indexedDBService.getAllDocuments("bookings")
        .then((bookings) => {
          // Filter bookings within the specified date range
          var filteredBookings = bookings.filter((booking) => {
            var bookingDate = booking.bookingDate;
            return bookingDate >= startDate && bookingDate <= endDate && !booking.isCancelled;
          });
          resolve(filteredBookings);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function generateBookingsChart(startDate = sevenDaysAgo(), endDate, dates) {
    var bookingsChartContainer = document.getElementById("bookings-chart").getContext("2d");

    return getBookings(startDate, endDate)
      .then((bookings) => {
        var bookingsPerDay = dates.map((date) => {
          return bookings.filter((booking) => booking.bookingDate === date).length;
        });

        var revenuePerDay = dates.map((date) => {
          return bookings
            .filter((booking) => booking.bookingDate === date)
            .reduce((total, booking) => {
              return total + booking.totalAmount;
            }, 0);
        });

        var data = {
          labels: dates,
          datasets: [
            {
              label: "Bookings per Day",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              data: bookingsPerDay,
            },
            {
              label: "Revenue per Day",
              type: "line", // Set the type to 'line' to overlay it as a line chart
              fill: false,
              borderColor: "rgba(255, 99, 132, 1)",
              data: revenuePerDay,
              yAxisID: "y-axis-revenue", // Assign it to a different y-axis
            },
          ],
        };

        var options = {
          scales: {
            yAxes: [
              {
                id: "y-axis-bookings",
                type: "linear",
                position: "left",
              },
              {
                id: "y-axis-revenue",
                type: "linear",
                position: "right",
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || "";
                var value = tooltipItem.yLabel;
                return datasetLabel + ": " + value;
              },
            },
          },
        };

        var chart = new Chart(bookingsChartContainer, {
          type: "bar",
          data: data,
          options: options,
        });

        return chart;
      })
      .catch((error) => {
        console.error("Error generating bookings chart:", error);
      });
  }

  // end of generateBookingsChart function

  this.generateCharts = function (sDate, eDate) {

    var charts = [];
    var startDate = sDate.toISOString().split("T")[0];
    var endDate = eDate.toISOString().split("T")[0];

    var dates = DatesService.getDatesBetween(startDate, endDate);

    charts.push(dayWiseSales(startDate, endDate));
    charts.push(generateBookingsChart(startDate, endDate, dates));

    return charts;
  };
});
