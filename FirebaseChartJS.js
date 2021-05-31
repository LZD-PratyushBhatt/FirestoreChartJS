const firebaseConfig = {
  apiKey: "AIzaSyAKBxpwWaF_HZIQNILVZgHF4HDOfxx6DK0",
  authDomain: "dragon-variation.firebaseapp.com",
  databaseURL: "https://dragon-variation-default-rtdb.firebaseio.com",
  projectId: "dragon-variation",
  storageBucket: "dragon-variation.appspot.com",
  messagingSenderId: "533592326325",
  appId: "1:533592326325:web:cbbb4443b2a1231f95befc",
  measurementId: "G-LDENZY8NCH",
};

firebase.initializeApp(firebaseConfig);
const ctx = document.getElementById("myChart").getContext("2d");
let myChart;
function getChart(dataChart) {
  console.log(dataChart.xLabels.length);
  console.log(dataChart.yLabels.length);
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dataChart.xLabels,
      datasets: [
        {
          label: "Calories burned in the day",
          data: dataChart.yLabels,
          backgroundColor: "rgba(255, 233, 132, 0.2)",
          borderColor: "rgba(12, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      animation: false,
    },
  });
  myChart.update();
  console.log(dataChart.xLabels.length);
  console.log(dataChart.yLabels.length);
}

//FIREBASE STUFF
const insertCalories = document.querySelector("#submit-calories");
const Ready = () => {
  day = insertCalories["day"].value;
  calories = insertCalories["calories"].value;
};

// Inserting data
insertCalories.addEventListener("submit", (e) => {
  e.preventDefault();
  Ready();
  firebase
    .database()
    .ref("pv/" + day)
    .set({
      Day: day,
      Calories: calories,
    })
    .then(() => {
      myChart.destroy();
      getData().then(getChart);
    });
});

// Selecting/Reading data
function getData() {
  // Snapshot points to a part of data in the firebase realtime database
  // You can get deepe r fieldss and deeper nodes by getting deeper into snapshot object
  const xLabels = [];
  const yLabels = [];
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref("pv/")
      .on("value", (snapshot) => {
        let obj = snapshot.val();
        // for (let x of Object.keys(obj)) {
        //   let y = obj[x].Calories;
        //   xLabels.push(x);
        //   yLabels.push(y);
        //   console.log(xLabels.length);
        //   console.log(yLabels.length);
        //   // console.log(x);
        //   // console.log(y);
        // }
        obj.forEach((x) => {
          xLabels.push(x.Day);
          yLabels.push(x.Calories);
        });
        resolve({ xLabels, yLabels });
      });
  });

  // alert("Read Complete");
}

// function callMe() {
//   setInterval(() => {
//     getData().then(getChart);
//     myChart.destroy();
//   }, 2000);
// }
// getData().then(getChart);
window.onload = getData().then(getChart);
