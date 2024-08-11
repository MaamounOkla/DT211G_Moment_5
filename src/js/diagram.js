//Diagram
import Chart from 'chart.js/auto';
// variabler
 
const url = "https://studenter.miun.se/~mallar/dt211g/";
const filteredCtx = document.getElementById("myFilteredChart");
const DoughnutChart = document.getElementById("MyDoughnutChart");
//onload anropa getData();
window.onload = init;
function init() {
  console.log("initierar...");
  console.log("Hämtar data från JSON...");
  getData();
}

//funktioner
//Hämta data från JSON

async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    console.log(data.length);

    //flitrera alla program
    const filteredPrograms = data.filter(item => item.type === "Program");
    //flitrera alla kurser
    const filteredCourses = data.filter(items => items.type === "Kurs");

    //sortera efter de 6 mest sökta kurser
    const topSixCourses = filteredCourses.sort((a, b) => b.applicantsTotal - a.applicantsTotal).slice(0, 6);
    //sortera efter de 5 mest sökta program
    const topFivePrograms = filteredPrograms.sort((a, b) => b.applicantsTotal - a.applicantsTotal).slice(0, 5);

    //stabeldiagram
    new Chart(filteredCtx, {
      type: 'bar',
      data: {
        labels: topSixCourses.map(course => course.name),
        datasets: [
          {
            label: 'Totalt antal sökande',
            data: topSixCourses.map(course => course.applicantsTotal),
            borderWidth: 2
          }
        ]
      },
      options: {
        maintainAspectRatio: false,

        indexAxis: window.innerWidth < 769 ? 'y' : 'x',
        responsive: true,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              font: {
                size: window.innerWidth < 769 ? 12 : 20
              }
            }
          },
          title: {
            display: true,
            text: 'Mest Sökta Kurser HT23',
            font: {
              size: window.innerWidth < 769 ? 12 : 20
            }
          }
        }
      }
    });

    //Cikeldiagram
    new Chart(DoughnutChart, {
      type: 'pie',
      data: {
        labels: topFivePrograms.map(course => course.name),
        datasets: [
          {
            label: 'Totalt antal sökande',
            data: topFivePrograms.map(course => course.applicantsTotal)
          }
        ]
      },

      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              font: {
                size: window.innerWidth < 769 ? 12 : 16,
              },
            },
          },
          title: {
            display: true,
            text: 'Mest Sökta program HT23 ',
            font: {
              size: window.innerWidth < 769 ? 12 : 16,
            },
          },
        },
      }

    });


  } catch (error) {
    const err = document.getElementById('error');
    err.innerHTML = "Något gick fel, hittar inga kurser..";
  }
}




export default diagram;
