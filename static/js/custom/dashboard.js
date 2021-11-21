
function createLineChart(elementId, data, option = {}) {
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

    // Create series
    function createSeries(name, field) {
        let series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
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
    }

    createSeries("Series", "value");

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
}


// <!-- Create initial chart -->

// Luxon alias 'DateTime'
var DateTime = luxon.DateTime;

// Avg bank soc chart
var currentDateTime = DateTime.now();
var currentDate = currentDateTime.toISODate();

var requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/stats/bank-avg-soc');
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

    createLineChart('avg-bank-soc-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Avg rank soc chart 
var requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/1/stats/rack-avg-soc');
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

    createLineChart('avg-rack-soc-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Avg bank soh chart
var requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/stats/bank-avg-soh');
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

    createLineChart('avg-bank-soh-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Avg rack soh chart
var requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/1/stats/rack-avg-soh');
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

    createLineChart('avg-rack-soh-chart', data, chartOption);
}).catch(error => {
    console.log(error);
});

// Avg bank power chart
var requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/stats/avg-bank-power');
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

    createLineChart('avg-bank-power-chart', data);
}).catch(error => {
    console.log(error);
});


// < !--Create chart with event-- >

// Avg bank soc event
var avgBankSoCDatePicker = $('#avg-bank-soc-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});
avgBankSoCDatePicker.on('changeDate', () => {
    document.getElementById('avg-bank-soc-chart').innerHTML = '';
    let date = avgBankSoCDatePicker.val();

    let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/stats/bank-avg-soc');
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

        let chartOption = {
            yAxis: {
                min: 0,
                max: 100
            }
        }

        createLineChart('avg-bank-soc-chart', data, chartOption);
    }).catch(error => {
        console.log(error);
    });
});

//Avg rack soc event
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
        document.getElementById('avg-rack-soc-chart').innerHTML = '';
        let date = avgRackSoCDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/' + avgRackSoCSelect.value + '/stats/rack-avg-soc');
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

            let chartOption = {
                yAxis: {
                    min: 0,
                    max: 100
                }
            }

            createLineChart('avg-rack-soc-chart', data, chartOption);
        }).catch(error => {
            console.log(error);
        });
    }
});

avgRackSoCDatePicker.on('changeDate', () => {
    if (!avgRackSoCSelect.value) {
        avgRackSoCSelect.focus();
    } else {
        document.getElementById('avg-rack-soc-chart').innerHTML = '';
        let date = avgRackSoCDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/' + avgRackSoCSelect.value + '/stats/rack-avg-soc');
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

            let chartOption = {
                yAxis: {
                    min: 0,
                    max: 100
                }
            }

            createLineChart('avg-rack-soc-chart', data, chartOption);
        }).catch(error => {
            console.log(error);
        });
    }
});

// Avg bank soh event
var avgBankSoHDatePicker = $('#avg-bank-soh-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});
avgBankSoHDatePicker.on('changeDate', () => {
    document.getElementById('avg-bank-soh-chart').innerHTML = '';
    let date = avgBankSoHDatePicker.val();

    let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/stats/bank-avg-soh');
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

        let chartOption = {
            yAxis: {
                min: 0,
                max: 100
            }
        }

        createLineChart('avg-bank-soh-chart', data, chartOption);
    }).catch(error => {
        console.log(error);
    });
});

// Avg rack soh event
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
        document.getElementById('avg-rack-soh-chart').innerHTML = '';
        let date = avgRackSoHDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/' + avgRackSoHSelect.value + '/stats/rack-avg-soh');
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

            let chartOption = {
                yAxis: {
                    min: 0,
                    max: 100
                }
            }

            createLineChart('avg-rack-soh-chart', data, chartOption);
        }).catch(error => {
            console.log(error);
        });
    }
});

avgRackSoHDatePicker.on('changeDate', () => {
    if (!avgRackSoHSelect.value) {
        avgRackSoHSelect.focus();
    } else {
        document.getElementById('avg-rack-soh-chart').innerHTML = '';
        let date = avgRackSoHDatePicker.val();

        let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/' + avgRackSoHSelect.value + '/stats/rack-avg-soh');
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

            let chartOption = {
                yAxis: {
                    min: 0,
                    max: 100
                }
            }

            createLineChart('avg-rack-soh-chart', data, chartOption);
        }).catch(error => {
            console.log(error);
        });
    }
});

// Avg bank power event
var avgBankPowerDatePicker = $('#avg-bank-power-date-input').datepicker({
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    autoclose: true
});
avgBankPowerDatePicker.on('changeDate', () => {
    document.getElementById('avg-bank-power-chart').innerHTML = '';
    let date = avgBankPowerDatePicker.val();

    let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/stats/avg-bank-power');
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

        createLineChart('avg-bank-power-chart', data);
    }).catch(error => {
        console.log(error);
    });
});
