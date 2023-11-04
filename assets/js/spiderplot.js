// Set up the initial data

// [{ "name": "Xanthous", "hex": "ffb940", "rgb": [255, 185, 64], "cmyk": [0, 27, 75, 0], "hsb": [38, 75, 100], "hsl": [38, 100, 63], "lab": [80, 15, 68] },
//     { "name": "Marian blue", "hex": "073a94", "rgb": [7, 58, 148], "cmyk": [95, 61, 0, 42], "hsb": [218, 95, 58], "hsl": [218, 91, 30], "lab": [27, 22, -53] },
//     { "name": "Burgundy", "hex": "780116", "rgb": [120, 1, 22], "cmyk": [0, 99, 82, 53], "hsb": [349, 99, 47], "hsl": [349, 98, 24], "lab": [24, 46, 25] },
//     { "name": "Pigment green", "hex": "4daa57", "rgb": [77, 170, 87], "cmyk": [55, 0, 49, 33], "hsb": [126, 55, 67], "hsl": [126, 38, 48], "lab": [63, -45, 34] },
//     { "name": "Dogwood rose", "hex": "d90368", "rgb": [217, 3, 104], "cmyk": [0, 99, 52, 15], "hsb": [332, 99, 85], "hsl": [332, 97, 43], "lab": [47, 74, 6] }
// ]

var color_green = 'rgba(77, 170, 87, 1)';
var color_red = 'rgba(120, 1, 22, 1)';
// Array of data sets and colors
const dataSets = [
    {
        data: [7, 8, 7, 8, 7],
        color: {
            backgroundColor: 'rgba(77, 170, 87, 0.3)', // green
            borderColor: color_green,
            pointBackgroundColor: color_green,
            pointHoverBorderColor: color_green,
        },
    },
    {
        data: [3, 5, 3, 4, 5],
        color: {
            backgroundColor: 'rgba(120, 1, 22, 0.2)', // red
            borderColor: color_red,
            pointBackgroundColor: color_red,
            pointHoverBorderColor: color_red,
        },
    },
];


const data = {
    labels: ['AI Model', 'Pipelines', 'Signal Strength', 'Expertise', 'Code Base'],
    datasets: [
        {
            label: 'Values',
            data: [7, 8, 7, 8, 7], // initial values
            fill: true,
            backgroundColor: 'rgba(77, 170, 87, 0.3)',
            borderColor: 'rgba(77, 170, 87, 1)',
            pointBackgroundColor: 'rgba(77, 170, 87, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77, 170, 87, 1)',
        },
    ],
};

const options = {
    scales: {
        r: {
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
                display: false,
                stepSize: 2, // This will ensure that you have 5 lines (0, 2, 4, 6, 8, 10)
                callback: function (value, index, values) {
                    if (index === values.length - 1) {
                        return ''; // or you can return a string for the last label
                    }
                    return value;
                }
                // font: {
                //     size: 20, // adjust size as needed
                //     family: 'Poppins'//Times New Roman'
                // }
            },
            angleLines: {
                color: '#000000' // or any color you want for the lines
            },
            pointLabels: {
                font: {
                    size: 20, // adjust size as needed
                    family: 'Poppins'
                }
            },
            // grid: {
            //     color: ['rgba(0, 0, 0, 1)', 'transparent', 'rgba(0, 0, 0, 0.3)', 'transparent', 'rgba(0, 0, 0, 0.3)', 'transparent', 'rgba(0, 0, 0, 0.3)', 'transparent', 'rgba(0, 0, 0, 0.3)', 'transparent'], // adjust as needed
            //     lineWidth: [1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] // adjust as needed
            // },
            grid: {
                color: 'rgba(0, 0, 0, 0.3)', // single color for all gridlines
                lineWidth: function (context) {
                    // Check if it is the outermost line
                    if (context.tick.value === context.chart.scales.r.max) {
                        return 2; // Set the outer line width thicker
                    }
                    return 0.5; // Other lines will have the default width
                }
                // lineWidth: 0.5 // single line width for all gridlines
            },
        },
    },
    animation: {
        duration: 2000, // duration of the animation in milliseconds
    },
    plugins: {
        legend: {
            display: false
        }
    },
    autosize: false,
    width: 575,
    height: 575,
    responsive: false,
    // maintainAspectRatio: false,
};




document.addEventListener('DOMContentLoaded', function () {
    // Create the radar chart
    const canvas = document.getElementById('spiderPlot');
    canvas.width = 575; // set the width of the canvas
    // canvas.height = 600; // set the height of the canvas
    const ctx = canvas.getContext('2d');
    // const ctx = document.getElementById('radarChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options,
    });

    // Function to update the data and color
    function updateData(newData, newColor) {
        let dataCopy = [...newData]; // create a copy of newData
        for (let i = 0; i < dataCopy.length; i++) {
            dataCopy[i] += 2*(Math.random() * 2 - 1); // random number between -1 and 1
            // clip at 0 and 10
            dataCopy[i] = Math.min(Math.max(dataCopy[i], 0), 10);
        }
        chart.data.datasets[0].data = dataCopy;
        chart.data.datasets[0].backgroundColor = newColor.backgroundColor;
        chart.data.datasets[0].borderColor = newColor.borderColor;
        chart.data.datasets[0].pointBackgroundColor = newColor.pointBackgroundColor;
        chart.data.datasets[0].pointHoverBorderColor = newColor.pointHoverBorderColor;
        chart.update();
    }

    // Index of the current data set
    let index = 0;

    // Update the data and color every 5 seconds
    setInterval(() => {
        updateData(dataSets[index].data, dataSets[index].color);
        index = (index + 1) % dataSets.length; // loop back to the first data set when we reach the end
    }, 3000);

});
