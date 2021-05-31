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
const db = firebase.firestore();
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
let day, calories;
const Ready = () => {
  day = parseInt(insertCalories["day"].value);
  calories = insertCalories["calories"].value;
};

// Inserting data
insertCalories.addEventListener("submit", (e) => {
  e.preventDefault();
  Ready();
  db.collection("12345")
    .doc("CalorieTracker")
    .collection("calorieList")
    .doc(day + "")
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
  const masterXY = [];
  return new Promise((resolve, reject) => {
    db.collection("12345")
      .doc("CalorieTracker")
      .collection("calorieList")
      .get()
      .then((snapshot) => {
        let obj = snapshot.docs;
        obj.forEach((x) => {
          masterXY.push([parseInt(x.data().Day), x.data().Calories]);
        });
        // Sort cause after the 10th day, it starts messing up,
        // so parseInt and sort.
        masterXY.sort((a, b) => {
          // console.log("first=", a, " Second=", b);
          return a[0] - b[0];
        });
        console.log(masterXY);
        masterXY.forEach((ele) => {
          xLabels.push(ele[0]);
          yLabels.push(ele[1]);
        });
        resolve({ xLabels, yLabels });
      });
  });
}
window.onload = getData().then(getChart);
