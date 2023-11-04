
// from 2013 to 2022
const legal_cases = [8, 12, 21, 17, 30, 35, 64, 92, 101, 121]
const new_companies = [495, 568, 572, 712, 983, 1234, 1197, 1289, 1669, 2000]
// Last point is 1392 but we extrapolate to 2000, similarly for legal cases

// const data = [];
// const data2 = [];
// let prev = 100;
// let prev2 = 80;
// for (let i = 0; i < 100; i++) {
//     prev += 5 - Math.random() * 10;
//     data.push({ x: i, y: prev });
//     prev2 += 5 - Math.random() * 10;
//     data2.push({ x: i, y: prev2 });
// }
// The function to linearly interpolate between two points
const interpol_steps = 50;
function interpolate(startValue, endValue, steps) {
    const stepSize = (endValue - startValue) / steps;
    let interpolatedValues = [];
    for (let i = 0; i <= steps; i++) {
        interpolatedValues.push(startValue + stepSize * i);
    }
    return interpolatedValues;
}

// Function to generate the full dataset with interpolated values
function generateInterpolatedDataset(dataset) {
    let interpolatedDataset = [];
    for (let i = 0; i < dataset.length - 1; i++) {
        // Get the interpolated values between the current and next data point
        const interpolatedValues = interpolate(dataset[i], dataset[i + 1], interpol_steps);
        // Exclude the last point to prevent duplication with the next interpolated start point
        interpolatedDataset.push(...interpolatedValues.slice(0, -1));
    }
    // Add the last original data point
    interpolatedDataset.push(dataset[dataset.length - 1]);
    return interpolatedDataset;
}

// Interpolated datasets
const interpolatedLegalCases = generateInterpolatedDataset(legal_cases);
const interpolatedNewCompanies = generateInterpolatedDataset(new_companies);

// Now convert these to the format expected by Chart.js
const legal_data = interpolatedLegalCases.map((value, index) => ({ x: index, y: value }));
const company_data = interpolatedNewCompanies.map((value, index) => ({ x: index, y: value }));


var color_green = 'rgba(77, 170, 87, 1)';
var color_red = 'rgba(120, 1, 22, 1)';
var color_blue = 'rgba(7, 68, 148, 1)';
var color_yellow = 'rgba(255, 185,64, 1)';

const totalDuration = 4000;
const delayBetweenPoints = totalDuration / legal_data.length;

// ;
// let restart = false;
// const totalDuration = 5000;
// const duration = (ctx) => easing(ctx.index / data.length) * totalDuration / data.length;
// const delay = (ctx) => easing(ctx.index / data.length) * totalDuration;

const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
const animation = {
    x: {
        type: 'number',
        easing: 'easeOutQuad',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
                return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
        }
    },
    y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) {
                return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
        }
    }
};


// year dictionary - n_steps * i == 2013+i

const year_dict = {};
for (let i = 0; i < 10; i++) {
    year_dict[interpol_steps * i] = 2013 + i;
};

const config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'AI Legal Cases',
            borderColor: color_blue,
            borderWidth: 5,
            radius: 0,
            data: legal_data,
        },
        {
            label: 'New AI Companies',
            borderColor: color_yellow,
            borderWidth: 5,
            radius: 0,
            data: company_data,
        }]
    },
    options: {
        animation,
        label: 'New AI Companies',
        interaction: {
            intersect: false
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true, // Will use point style (circles by default)
                    // Custom rendering of the legend items
                    generateLabels: function (chart) {
                        return chart.data.datasets.map(function (dataset, i) {
                            return {
                                text: dataset.label, // The text for the legend item
                                //fontsize
                                font: {
                                    size: 40, // adjust size as needed
                                },
                                fillStyle: dataset.borderColor, // Color of the text
                                // OPTIONAL: if you want the default legend to use dataset point style
                                pointStyle: dataset.pointStyle || 'circle',
                                // You can disable stroke, if you want to remove the colored boxes completely
                                strokeStyle: 'transparent',
                                lineWidth: 0,
                                // Customize the legend item text color here
                                fontColor: dataset.borderColor,
                                hidden: !chart.isDatasetVisible(i),
                                index: i,
                            };
                        });
                    }
                }
            }
            // don't show the boxes, but just colored titles
        },
        scales: {
            x: {
                type: 'linear',
                grid: {
                    drawBorder: true, // if you want to keep the axis line
                    drawOnChartArea: false, // this removes the vertical grid lines
                    drawTicks: true, // if you want to keep the ticks
                },
                ticks: {
                    // Define how each tick will be rendered
                    callback: function (value, index, values) {
                        // Assuming 'value' is your year or you have a way to determine the year from the value
                        return year_dict[value].toString(); // Return the value to be displayed as the tick label
                    },
                    font: {
                        size: 16, // Specify the font size for ticks
                        family: 'Poppins' // Specify the font family for ticks
                    },

                    // Additional styles if needed
                    // make gray
                    color: "#5A5A5A", // Tick labels' text color
                    major: {
                        enabled: true // Enable major ticks
                    }
                },

            },
            y: {
                type: 'linear',
                ticks: {
                    font: {
                        size: 16, // Specify the font size for ticks
                        family: 'Poppins' // Specify the font family for ticks
                    },
                    // Additional styles if needed
                    color: '#5A5A5A', // Tick labels' text color
                    major: {
                        enabled: true // Enable major ticks
                    }
                },
            }
        }
    }
};


// Start the animation only when the user scrolls into iew
// by using async Observers
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('aiCompaniesPlot').getContext('2d');
    let chartInitialized = false;

    // Intersection Observer callback
    const onIntersect = (entries, observer) => {
        entries.forEach(entry => {
            // Check if the element is in view
            if (entry.isIntersecting && !chartInitialized) {
                // Initialize the chart
                const myChart = new Chart(ctx, config);
                // Set a flag so the chart won't be initialized again
                chartInitialized = true;
                // Optionally, unobserve the canvas if you only want to trigger this once
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the Intersection Observer instance
    const observer = new IntersectionObserver(onIntersect, {
        root: null, // relative to the viewport
        threshold: 0.5, // trigger when at least 50% of the canvas is visible
    });

    // Start observing the canvas element
    observer.observe(ctx.canvas);
});
