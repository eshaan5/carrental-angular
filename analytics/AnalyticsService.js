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

  function dayWiseSales(startDate, endDate, allBookings, dates) {
    var labelArray = [];

    for (var i = 1; i <= Math.ceil(dates.length / 7); i++) {
      labelArray.push(`Occurrence ${i}`);
    }

    var res = [[], [], [], [], [], [], []];

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
  }
  // end of dayWiseSales function

  // start of generateBookingsChart function

  function getBookings(startDate, endDate) {
    return new Promise((resolve, reject) => {
      indexedDBService
        .getAllDocuments("bookings")
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

  function generateBookingsChart(dates, bookings) {
    var bookingsChartContainer = document.getElementById("bookings-chart").getContext("2d");

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
  }

  // end of generateBookingsChart function

  // start of total revenue

  function totalRevenue(bookings) {
    var totalRevenue = bookings.reduce((total, booking) => {
      return total + booking.totalAmount;
    }, 0);
    return totalRevenue;
  }

  // end of total revenue

  // top users and cars functions

  function topUsersAndCars(bookings) {
    var users = {};
    var cars = {};

    bookings.forEach((booking) => {
      if (users[booking.uid]) {
        users[booking.uid] += booking.totalAmount;
      } else {
        users[booking.uid] = booking.totalAmount;
      }

      if (cars[booking.cid]) {
        cars[booking.cid] += 1;
      } else {
        cars[booking.cid] = 1;
      }
    });

    // top users and cars with their total revenue and total bookings

    var topUsers = Object.keys(users)
      .sort((a, b) => users[b] - users[a])
      .slice(0, 5)
      .map((uid) => {
        return { uid, totalAmount: users[uid] };
      });

    var topCars = Object.keys(cars)
      .sort((a, b) => cars[b] - cars[a])
      .slice(0, 3)
      .map((cid) => {
        return { cid, totalBookings: cars[cid] };
      });

    return { topUsers, topCars };
  }

  // end of top users and cars functions

  // start of pie chart function

  function generateBottomRightSection(bookings) {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF8C00",
      "#8B4513",
      "#1E90FF",
      "#FFD700",
      "#32CD32",
      // ... add more colors as needed
    ];

    const bottomRightSectionContainer = document.getElementById("bottom-right").getContext("2d");

    const carWiseBookings = {};

    // get car name wise bookings

    bookings.forEach((booking) => {
      if (carWiseBookings[booking.car.carName]) {
        carWiseBookings[booking.car.carName] += 1;
      } else {
        carWiseBookings[booking.car.carName] = 1;
      }
    });

    // Calculate percentage values
    const percentValues = Object.values(carWiseBookings).map((value) => ((value / bookings.length) * 100).toFixed(2));

    // Prepare data for the chart
    const data = {
      labels: Object.keys(carWiseBookings),
      datasets: [
        {
          data: percentValues,
          backgroundColor: colors,
        },
      ],
    };

    // Create and render the pie chart
    const chart = new Chart(bottomRightSectionContainer, {
      type: "pie",
      data: data,
    });
    return chart;
  }

  // end of pie chart function

  this.getTotalRegistrations = function (startDate, endDate) {
    return new Promise((resolve, reject) => {
      indexedDBService
        .getAllDocuments("users")
        .then((users) => {
          var totalRegistrations = users.filter((user) => {
            return user.registeredOn >= startDate && user.registeredOn <= endDate;
          }).length;
          resolve(totalRegistrations);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  this.generateCharts = function (sDate, eDate) {
    var charts = [];
    var revenue = 0;
    var startDate = sDate.toISOString().split("T")[0];
    var endDate = eDate.toISOString().split("T")[0];

    var dates = DatesService.getDatesBetween(startDate, endDate);

    return getBookings(startDate, endDate)
      .then((bookings) => {
        revenue = totalRevenue(bookings);
        charts.push(generateBookingsChart(dates, bookings));
        charts.push(dayWiseSales(startDate, endDate, bookings, dates));
        var topUsersAndCarsData = topUsersAndCars(bookings);
        charts.push(generateBottomRightSection(bookings));
        return { charts, revenue, topUsers: topUsersAndCarsData.topUsers, topCars: topUsersAndCarsData.topCars };
      })
      .catch((error) => {
        console.error("Error retrieving bookings:", error);
      });
  };
});
