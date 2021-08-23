//////////////Pie chart for registered Users //////////////
$.get('/total', function(DATA){
    const registered = DATA.registered;

    const data = {
        labels: [
            'Registered',
            'Not registered',
        ],
        datasets: [{
            label: 'Website Adoption',
          data: [registered, 761-registered],
          backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
            ],
          hoverOffset: 4,
          
        }]

    };

      const config = {
          type: 'doughnut',
        data: data,
        options : {
            plugins :{
                title: {
                    display: true,
                    text: 'Website Adoption',
                    color: '#fff',
                },
                //
                legend: {
                    labels: {
                      color: "#fff",
                    }
                  },
                //
            },
        }
    };

    var mychart = new Chart(
          document.querySelector(".registered"),
          config,
          )
        });

////////////// Bar Graph for Yearwise vaccinated percentages/////////
$.get('/yearwise', function(DATA){
    const pb21 = DATA.part21;
    const pb20 = DATA.part20;
    const pb19 = DATA.part19;
    const pb18 = DATA.part18;
    const fb21 = DATA.full21;
    const fb20 = DATA.full20;
    const fb19 = DATA.full19;
    const fb18 = DATA.full18;
    const labels = ['B2021', 'B2020' , 'B2019' , 'B2018'];
    const data = {
    labels: labels,
    datasets: [
    {
        label: 'Partially Vaccinated',
        data: [pb21, pb20 , pb19, pb18],
        backgroundColor: "rgb(255,99, 132, 0.4)",//Utils.CHART_COLORS.red,
        borderColor: "rgb(255,99,132)",  
        stack: 'Stack 0',
    },
    {
        label: 'Fully Vaccinated',
        data: [fb21 , fb20, fb19, fb18],
        backgroundColor: "rgba(54, 162, 235, 0.4)",//Utils.CHART_COLORS.blue,
        borderColor: "rgba(54, 162, 235)",  
        stack: 'Stack 1',
    }
    ]
};
const config = {
    type: 'bar',
    data: data,
    options: {
        plugins: {
            title: {
                display: true,
                text: '% Vaccinated',
                color: '#fff'
            },
            legend : {
                labels:{
                    color:'#fff',
                }
            },
            scales:{
                y: { 
                    ticks: {
                      color: "#fff",
                      },
                    }
            }
        },
        responsive: true,
        interaction: {
        intersect: false,
        },
        scales: {
        x: {
            stacked: true,
            ticks: {
                color: "#fff",
                },
        },
        y: {
            stacked: true,
            ticks: {
                color: "#fff",
                },
        }
        },
        aspectRatio : 1,
    },
    };
    var myChart = new Chart(
        document.querySelector(".partial-full-bar"),
        config,        
    );
})


/////Pie chart for total IIT Mandi population/////////
$.get('/btech', function(DATA){
    const partial = DATA.part21+ DATA.part20+DATA.part19+DATA.part18;
    const full = DATA.full21+ DATA.full20 + DATA.full19 + DATA.full18;
    // alert("Partial = " + String(partial) +" and full = " + String(full));

    const data = {
        labels: [
          'Partially Vaccinated',
          'Fully Vaccinated',
          'Not Vaccinated'
        ],
        datasets: [{
          label: 'Vaccinated ratio',
          data: [partial, full, 761-(full+partial)],
          backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
              'rgb(255, 205, 86)'
          ],
          hoverOffset: 4,
        }]
      };

      const config = {
        type: 'doughnut',
        data: data,
        options : {
            plugins :{
                title: {
                    display: true,
                    text: 'B.Tech Vaccinated Ratio',
                    color: '#fff',
                },
                legend:{
                    labels:{
                        color:'#fff',
                    }
                }
            },
        }
      };

      var mychart = new Chart(
          document.querySelector(".totalVaccinationStats"),
          config,
      )
});

//////////Vaccine  Distribution ///////////
$.get('/vaccine', function(DATA){
    const covishield = DATA.covishield;
    const covaxin = DATA.covaxin;
    const other = DATA.other;

    const labels = ["Covishield", "Covaxin", "Other"];
    const data = {
    labels: labels,
    datasets: [{
        axis: 'y',
        // label: "My first Dataset",
        data: [covishield, covaxin, other],
        fill: false,
        backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
    }]
    };

    const config = {
        type: 'bar',
        data,
        options : {
            indexAxis: 'y',
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                    }
                }
            },
            plugins :{
                legend : {
                    display: false
                },
                // legend :{
                //     display: false,
                // },
                title: {
                    display: true,
                    text: 'Vaccine Distribution',
                    color: '#fff',
                },
                
            },
            scales:{
                x:{
                    ticks:{
                        color:'#fff',
                    }                        
                },
                y:{
                    ticks:{
                        color:'#fff',
                    }
                }
            },
                aspectRatio : 1,
            },
      };

      var mychart = new Chart(
        document.querySelector(".vaccines"),
        config,
    )
});