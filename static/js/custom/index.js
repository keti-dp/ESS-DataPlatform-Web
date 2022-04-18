// Main scrollspy
let scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#mainContentNavbar'
});

function getLineChart(elementId, data, option = {}) {
    let root = am5.Root.new(elementId);

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panY: false,
            wheelY: "zoomX",
            layout: root.verticalLayout,
            maxTooltipDistance: 0
        })
    );

    let chartData = data;

    // Create Y-axis
    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, Object.assign({
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {})
        }, option['yAxis']))
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, Object.assign({
            baseInterval: { timeUnit: "hour", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {})
        }, option['xAxis']))
    );

    xAxis.get("dateFormats")["hour"] = "HH:mm";
    xAxis.get("periodChangeDateFormats")["hour"] = "yyyy-MM-dd HH:mm";

    let series = chart.series.push(
        am5xy.LineSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {})
        })
    );

    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
                radius: 5,
                fill: series.get("fill")
            })
        });
    });

    series.strokes.template.set("strokeWidth", 2);

    series.get("tooltip").label.set("text", "[bold]{name}[/]\n{valueX.formatDate('yyyy-MM-dd HH:mm')}: {valueY.formatNumber('#.000')}")
    series.data.setAll(chartData);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomXY",
        xAxis: xAxis
    }));

    xAxis.set("tooltip", am5.Tooltip.new(root, {
        themeTags: ["axis"]
    }));

    yAxis.set("tooltip", am5.Tooltip.new(root, {
        themeTags: ["axis"]
    }));

    return series;
}


// <!-- Create initial chart -->

// Luxon alias 'DateTime'
var DateTime = luxon.DateTime;

var currentDateTime = DateTime.now();
var currentDate = currentDateTime.toISODate();

// Series variables of AMCharts
var avgBankSoCChart;
var avgRackSoCChart;
var avgBankSoHChart;
var avgRackSoHChart;
var avgBankPowerChart;

// Create initial avg bank soc chart
var requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/stats/avg-bank-soc');
requestUrl.searchParams.append('date', currentDate);
requestUrl.searchParams.append('time-bucket-width', '1hour');

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let data = [];

    responseData.forEach(element => {
        let date = new Date(element.time).getTime();
        let value = element['avg_bank_soc'];

        data.push({ date: date, value: value });
    });

    let chartOption = {
        yAxis: {
            min: 0,
            max: 100
        }
    }

    avgBankSoCChart = getLineChart('avg-bank-soc-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Create initial avg rank soc chart 
var requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/racks/1/stats/avg-rack-soc');
requestUrl.searchParams.append('date', currentDate);
requestUrl.searchParams.append('time-bucket-width', '1hour');

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let data = [];

    responseData.forEach(element => {
        let date = new Date(element.time).getTime();
        let value = element['avg_rack_soc'];

        data.push({ date: date, value: value });
    });

    let chartOption = {
        yAxis: {
            min: 0,
            max: 100
        }
    }

    avgRackSoCChart = getLineChart('avg-rack-soc-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Create initial avg bank soh chart
var requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/stats/avg-bank-soh');
requestUrl.searchParams.append('date', currentDate);
requestUrl.searchParams.append('time-bucket-width', '1hour');

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let data = [];

    responseData.forEach(element => {
        let date = new Date(element.time).getTime();
        let value = element['avg_bank_soh'];

        data.push({ date: date, value: value });
    });

    let chartOption = {
        yAxis: {
            min: 0,
            max: 100
        }
    }

    avgBankSoHChart = getLineChart('avg-bank-soh-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Create initial avg rack soh chart
var requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/racks/1/stats/avg-rack-soh');
requestUrl.searchParams.append('date', currentDate);
requestUrl.searchParams.append('time-bucket-width', '1hour');

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let data = [];

    responseData.forEach(element => {
        let date = new Date(element.time).getTime();
        let value = element['avg_rack_soh'];

        data.push({ date: date, value: value });
    });

    let chartOption = {
        yAxis: {
            min: 0,
            max: 100
        }
    }

    avgRackSoHChart = getLineChart('avg-rack-soh-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Create initial avg bank power chart
var requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/stats/avg-bank-power');
requestUrl.searchParams.append('date', currentDate);
requestUrl.searchParams.append('time-bucket-width', '1hour');

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let data = [];

    responseData.forEach(element => {
        let date = new Date(element.time).getTime();
        let value = element['avg_bank_power'];

        data.push({ date: date, value: value });
    });

    avgBankPowerChart = getLineChart('avg-bank-power-chart', data);
}).catch(error => {
    console.log(error);
});


// < !--Event of chart-- >

// Event of avg bank soc chart
var avgBankSoCDatePicker = $('#avg-bank-soc-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});
avgBankSoCDatePicker.on('changeDate', () => {
    let date = avgBankSoCDatePicker.val();
    let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/stats/avg-bank-soc');
    requestUrl.searchParams.append('date', date);
    requestUrl.searchParams.append('time-bucket-width', '1hour');

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(responseData => {
        let data = [];

        responseData.forEach(element => {
            let date = new Date(element.time).getTime();
            let value = element['avg_bank_soc'];

            data.push({ date: date, value: value });
        });

        avgBankSoCChart.data.setAll(data);
    }).catch(error => {
        console.log(error);
    });
});

// Event of avg rack soc chart
var avgRackSoCDatePicker = $('#avg-rack-soc-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});

var avgRackSoCSelect = document.getElementById('avg-rack-soc-select');
avgRackSoCSelect.addEventListener('change', (event) => {
    if (!avgRackSoCDatePicker.val()) {
        avgRackSoCDatePicker.focus();
    } else {
        let date = avgRackSoCDatePicker.val();
        let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/racks/' + avgRackSoCSelect.value + '/stats/avg-rack-soc');
        requestUrl.searchParams.append('date', date);
        requestUrl.searchParams.append('time-bucket-width', '1hour');

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = [];

            responseData.forEach(element => {
                let date = new Date(element.time).getTime();
                let value = element['avg_rack_soc'];

                data.push({ date: date, value: value });
            });

            avgRackSoCChart.data.setAll(data);
        }).catch(error => {
            console.log(error);
        });
    }
});

avgRackSoCDatePicker.on('changeDate', () => {
    if (!avgRackSoCSelect.value) {
        avgRackSoCSelect.focus();
    } else {
        let date = avgRackSoCDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/racks/' + avgRackSoCSelect.value + '/stats/avg-rack-soc');
        requestUrl.searchParams.append('date', date);
        requestUrl.searchParams.append('time-bucket-width', '1hour');

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = [];

            responseData.forEach(element => {
                let date = new Date(element.time).getTime();
                let value = element['avg_rack_soc'];

                data.push({ date: date, value: value });
            });

            avgRackSoCChart.data.setAll(data);
        }).catch(error => {
            console.log(error);
        });
    }
});

// Event of avg bank soh chart
var avgBankSoHDatePicker = $('#avg-bank-soh-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});
avgBankSoHDatePicker.on('changeDate', () => {
    let date = avgBankSoHDatePicker.val();

    let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/stats/avg-bank-soh');
    requestUrl.searchParams.append('date', date);
    requestUrl.searchParams.append('time-bucket-width', '1hour');

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(responseData => {
        let data = [];

        responseData.forEach(element => {
            let date = new Date(element.time).getTime();
            let value = element['avg_bank_soh'];

            data.push({ date: date, value: value });
        });

        avgBankSoHChart.data.setAll(data);
    }).catch(error => {
        console.log(error);
    });
});

// Event of avg rack soh chart
var avgRackSoHDatePicker = $('#avg-rack-soh-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});

var avgRackSoHSelect = document.getElementById('avg-rack-soh-select');
avgRackSoHSelect.addEventListener('change', (event) => {
    if (!avgRackSoHDatePicker.val()) {
        avgRackSoHDatePicker.focus();
    } else {
        let date = avgRackSoHDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/racks/' + avgRackSoHSelect.value + '/stats/avg-rack-soh');
        requestUrl.searchParams.append('date', date);
        requestUrl.searchParams.append('time-bucket-width', '1hour');

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = [];

            responseData.forEach(element => {
                let date = new Date(element.time).getTime();
                let value = element['avg_rack_soh'];

                data.push({ date: date, value: value });
            });

            avgRackSoHChart.data.setAll(data);
        }).catch(error => {
            console.log(error);
        });
    }
});

avgRackSoHDatePicker.on('changeDate', () => {
    if (!avgRackSoHSelect.value) {
        avgRackSoHSelect.focus();
    } else {
        let date = avgRackSoHDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/racks/' + avgRackSoHSelect.value + '/stats/avg-rack-soh');
        requestUrl.searchParams.append('date', date);
        requestUrl.searchParams.append('time-bucket-width', '1hour');

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = [];

            responseData.forEach(element => {
                let date = new Date(element.time).getTime();
                let value = element['avg_rack_soh'];

                data.push({ date: date, value: value });
            });

            avgRackSoHChart.data.setAll(data);
        }).catch(error => {
            console.log(error);
        });
    }
});

// Event of avg bank power chart
var avgBankPowerDatePicker = $('#avg-bank-power-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});
avgBankPowerDatePicker.on('changeDate', () => {
    let date = avgBankPowerDatePicker.val();

    let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/banks/1/stats/avg-bank-power');
    requestUrl.searchParams.append('date', date);
    requestUrl.searchParams.append('time-bucket-width', '1hour');

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(responseData => {
        let data = [];

        responseData.forEach(element => {
            let date = new Date(element.time).getTime();
            let value = element['avg_bank_power'];

            data.push({ date: date, value: value });
        });

        avgBankPowerChart.data.setAll(data);
    }).catch(error => {
        console.log(error);
    });
});
