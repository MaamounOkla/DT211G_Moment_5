//Diagram
import Chart from 'chart.js/auto';
// variabler
const ctx = document.getElementById('myChart');
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

 

     new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(course => course.name),
            datasets: [
              {
                label: 'Totalt antal sökande',
                data: data.map(course => course.applicantsTotal)
              }
            ]
          },
    
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });



      const topSixCourses = data
      .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
      .slice(0, 6);
      const topCourses = data
      .sort((a, b) => b.applicantsTotal - a.applicantsTotal);
  

     new Chart(filteredCtx, {
        type: 'bar',
        data: {
            labels: topSixCourses.map(course => course.name),
            datasets: [
              {
                label: 'Totalt antal sökande',
                data: data.map(course => course.applicantsTotal)
              }
            ]
          },
    
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      
     new Chart(DoughnutChart, {
        type: 'doughnut',
        data: {
            labels: topCourses.map(course => course.name),
            datasets: [
              {
                label: 'Totalt antal sökande',
                data: data.map(course => course.applicantsTotal)
              }
            ]
          },
          label:false,
        options: {
             
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      
     
  } catch (error) {
     const err =  document.getElementById('error');
    err.innerHTML = "Något gick fel, hittar inga kurser..";
  }
}



 
export default diagram;
