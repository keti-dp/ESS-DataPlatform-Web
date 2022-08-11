const essProtectionMap = JSON.parse(document.getElementById('ess-protection-map').textContent);
const customFullDateFormat = 'yyyy-MM-dd';
const customFullDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
const customTimeDesignatorFullDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;

function getCamelCaseString(text, seperator = '-') {
    return text.split(seperator).map((element, index) => index > 0 ? element.charAt(0).toUpperCase() + element.substr(1) : element).join('');
}

async function loadData(requestUrl) {
    let response = await fetch(requestUrl);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(response.status);
}

function getChartRoot(elementId) {
    let root = am5.Root.new(elementId);
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    return root;
}

function getInitialLineChart(chartRoot) {
    let root = chartRoot;
    let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panY: false,
            wheelY: "zoomX",
            layout: root.verticalLayout,
        })
    );
    chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomXY",
    }));

    return chart;
}

function getSimpleLineChart(elementId, data, option = {}) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

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

    xAxis.set("tooltip", am5.Tooltip.new(root, {
        themeTags: ["axis"]
    }));

    yAxis.set("tooltip", am5.Tooltip.new(root, {
        themeTags: ["axis"]
    }));

    return series;
}

function getAvgSoHChartSeries(elementId) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

    // Create X-Axis
    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "day", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {}),
            dateFormats: {
                day: 'yyyy-MM-dd',
                month: 'yyyy-MM'
            },
            periodChangeDateFormats: {
                month: 'yyyy-MM'
            }
        }),
    );
    
    // Create Y-axis
    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            min: 80,
            max: 100,
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );
    
    // Create series
    let series = chart.series.push(
        am5xy.LineSeries.new(root, {
            name: "Avg SoH",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]{name}[/]\n{valueX.formatDate('yyyy-MM-dd')}: {valueY.formatNumber('#.000')}"
            })
        })
    );

    // Setup series
    series.strokes.template.setAll({
        strokeWidth: 3
    });

    return series
}

// <!-- Create initial chart -->

// Luxon alias 'DateTime'
let DateTime = luxon.DateTime;
let currentDateTime = DateTime.now();
let startTimeObject = currentDateTime.startOf('day');
let startTime = startTimeObject.toFormat(customTimeDesignatorFullDateTimeFormat);
let endTime = startTimeObject.plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

let visualizationTypes = ['avg-bank-soc', 'avg-rack-soc', 'avg-bank-power'];

// Assign variable collection for dynamic names
let visualizationTypesObjects = {
    chart: {},
    cardElement: {},
    chartElement: {},
};
visualizationTypes.forEach(element => {
    let visualizationTypeCamelCaseString = getCamelCaseString(element);

    visualizationTypesObjects['chart'][visualizationTypeCamelCaseString] = '';
    visualizationTypesObjects['cardElement'][visualizationTypeCamelCaseString] = document.getElementById(`${visualizationTypeCamelCaseString}Card`);
    visualizationTypesObjects['chartElement'][visualizationTypeCamelCaseString] = document.getElementById(`${visualizationTypeCamelCaseString}Chart`);
});

// Create initial visualization chart
visualizationTypes.forEach(visualizationType => {
    let requestUrl;

    if (visualizationType.includes('bank')) {
        requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/stats/${visualizationType}`);
    }

    if (visualizationType.includes('rack')) {
        requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/racks/1/stats/${visualizationType}`);
    }

    requestUrl.searchParams.append('time-bucket-width', '1hour');
    requestUrl.searchParams.append('start-time', startTime);
    requestUrl.searchParams.append('end-time', endTime);

    fetch(requestUrl).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error(response.statusText);
    }).then(responseData => {
        let data = responseData.map(element => {
            let date = new Date(element.time).getTime();
            let value = element[visualizationType.replaceAll('-', '_')];

            return { date: date, value: value };
        });

        let visualizationTypeCamelCaseString = getCamelCaseString(visualizationType);
        let chartString = `${visualizationTypeCamelCaseString}Chart`;

        if (visualizationType.includes('soc') || visualizationType.includes('soh')) {
            let chartOption = {
                yAxis: {
                    min: 0,
                    max: 100
                }
            }

            visualizationTypesObjects['chart'][visualizationTypeCamelCaseString] = getSimpleLineChart(chartString, data, chartOption);
        } else {
            visualizationTypesObjects['chart'][visualizationTypeCamelCaseString] = getSimpleLineChart(chartString, data);
        }

        visualizationTypesObjects['cardElement'][visualizationTypeCamelCaseString].querySelector('.card-body .spinner-border').classList.add('d-none');
        visualizationTypesObjects['chartElement'][visualizationTypeCamelCaseString].parentNode.classList.remove('d-none');
    }).catch(error => console.log(error));
});

// Event
// - Search visualization card
let essBankVisualizationSearchModalElement = document.getElementById('essBankVisualizationSearchModal');
essBankVisualizationSearchModalElement.addEventListener('show.bs.modal', event => {
    let button = event.relatedTarget;
    let visualizationType = button.getAttribute('data-visualization-type');
    let searchButton = essBankVisualizationSearchModalElement.querySelector('.btn-primary');
    searchButton.setAttribute('data-visualization-type', visualizationType);
});

let essRackVisualizationSearchModalElement = document.getElementById('essRackVisualizationSearchModal');
essRackVisualizationSearchModalElement.addEventListener('show.bs.modal', event => {
    let button = event.relatedTarget;
    let visualizationType = button.getAttribute('data-visualization-type');
    let searchButton = essRackVisualizationSearchModalElement.querySelector('.btn-primary');
    searchButton.setAttribute('data-visualization-type', visualizationType);
});

let essBankVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essBankVisualizationSearchModalFormOperatingSiteSelect');
let essBankVisualizationSearchModalFormBankSelectElement = document.getElementById('essBankVisualizationSearchModalFormBankSelect');
let essBankVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essBankVisualizationSearchModalFormStartDateTimePicker');
let essBankVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essBankVisualizationSearchModalFormEndDateTimePicker');
let essBankVisualizationSearchModalFormStartDateTimeInputElement = document.getElementById('essBankVisualizationSearchModalFormStartDateTimeInput');
let essBankVisualizationSearchModalFormEndDateTimeInputElement = document.getElementById('essBankVisualizationSearchModalFormEndDateTimeInput');

let essRackVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essRackVisualizationSearchModalFormOperatingSiteSelect');
let essRackVisualizationSearchModalFormBankSelectElement = document.getElementById('essRackVisualizationSearchModalFormBankSelect');
let essRackVisualizationSearchModalFormRackSelectElement = document.getElementById('essRackVisualizationSearchModalFormRackSelect');
let essRackVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essRackVisualizationSearchModalFormStartDateTimePicker');
let essRackVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essRackVisualizationSearchModalFormEndDateTimePicker');
let essRackVisualizationSearchModalFormStartDateTimeInputElement = document.getElementById('essRackVisualizationSearchModalFormStartDateTimeInput');
let essRackVisualizationSearchModalFormEndDateTimeInputElement = document.getElementById('essRackVisualizationSearchModalFormEndDateTimeInput');

essBankVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essBankVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essBankVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Bank를 선택해주세요.</option>');
    essBankVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (i = 0; i < bankCount; i++) {
            essBankVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essBankVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essRackVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essRackVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Bank를 선택해주세요.</option>');
    essRackVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Rack을 선택해주세요.</option>');
    essRackVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');
    essRackVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (i = 0; i < bankCount; i++) {
            essRackVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        essRackVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackVisualizationSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    essRackVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Rack을 선택해주세요.</option>')

    let operatingSiteId = essRackVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (i = 0; i < rackCount; i++) {
            essRackVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essRackVisualizationSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        essRackVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

// -- Validation ess bank type modal
const essBankVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(essBankVisualizationSearchModalFormStartDateTimePickerElement, {
    display: {
        components: {
            seconds: true
        },
        sideBySide: true
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateTimeFormat) }
    }
});

const essBankVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(essBankVisualizationSearchModalFormEndDateTimePickerElement, {
    display: {
        components: {
            seconds: true
        },
        sideBySide: true
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateTimeFormat) }
    },
    useCurrent: false
});

// Using event listeners
essBankVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essBankVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// Using subscribe method
const essBankVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = essBankVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    essBankVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const essBankVisualizationSearchModalFormValidation = new JustValidate('#essBankVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
essBankVisualizationSearchModalFormValidation
    .addField('#essBankVisualizationSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: '운영 사이트를 선택하세요.'
        }
    ])
    .addField('#essBankVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: 'Bank를 선택하세요.'
        }
    ])
    .addField('#essBankVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: '시작 시간을 선택하세요.'
        },
    ]).addField('#essBankVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: '마지막 시간을 선택하세요.'
        },
    ])
    .onSuccess((event) => {
        let visualizationType = essBankVisualizationSearchModalElement.querySelector('.btn-primary').getAttribute('data-visualization-type');
        let visualizationTypeCamelCaseString = getCamelCaseString(visualizationType, '-');
        let visualizationCardElement = visualizationTypesObjects['cardElement'][visualizationTypeCamelCaseString];
        let visualizationChartElement = visualizationTypesObjects['chartElement'][visualizationTypeCamelCaseString];

        bootstrap.Modal.getInstance(essBankVisualizationSearchModalElement).hide();
        visualizationChartElement.parentNode.classList.add('d-none');
        visualizationCardElement.querySelector('.card-body .spinner-border').classList.remove('d-none');

        let operatingSiteId = essBankVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = essBankVisualizationSearchModalFormBankSelectElement.value;
        let startTime = DateTime.fromFormat(essBankVisualizationSearchModalFormStartDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
        let endTime = DateTime.fromFormat(essBankVisualizationSearchModalFormEndDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);

        let requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${bankId}/stats/${visualizationType}`);
        requestUrl.searchParams.append('time-bucket-width', '1hour');
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);

        fetch(requestUrl).then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        }).then(responseData => {
            let data = responseData.map(element => {
                let date = new Date(element.time).getTime();
                let value = element[visualizationType.replaceAll('-', '_')];

                return { date: date, value: value };
            });

            visualizationCardElement.querySelector('.card-body p').textContent = `
                ${essBankVisualizationSearchModalFormOperatingSiteSelectElement.options[essBankVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} > Bank ${bankId}
            `;

            let chart = visualizationTypesObjects['chart'][visualizationTypeCamelCaseString];
            chart.data.setAll(data);

            visualizationCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
            visualizationChartElement.parentNode.classList.remove('d-none');
        }).catch(error => console.log(error));
    });

// -- Validation ess rack type modal
const essRackVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(essRackVisualizationSearchModalFormStartDateTimePickerElement, {
    display: {
        components: {
            seconds: true
        },
        sideBySide: true
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateTimeFormat) }
    }
});

const essRackVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(essRackVisualizationSearchModalFormEndDateTimePickerElement, {
    display: {
        components: {
            seconds: true
        },
        sideBySide: true
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateTimeFormat) }
    },
    useCurrent: false
});

// Using event listeners
essRackVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essRackVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// Using subscribe method
const essRackVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = essRackVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    essBankVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const essRackVisualizationSearchModalFormValidation = new JustValidate('#essRackVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
essRackVisualizationSearchModalFormValidation
    .addField('#essRackVisualizationSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: '운영 사이트를 선택하세요.'
        }
    ])
    .addField('#essRackVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: 'Bank를 선택하세요.'
        }
    ])
    .addField('#essRackVisualizationSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: 'Rack를 선택하세요.'
        }
    ])
    .addField('#essRackVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: '시작 시간을 선택하세요.'
        },
    ]).addField('#essRackVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: '마지막 시간을 선택하세요.'
        },
    ])
    .onSuccess((event) => {
        let visualizationType = essRackVisualizationSearchModalElement.querySelector('.btn-primary').getAttribute('data-visualization-type');
        let visualizationTypeCamelCaseString = getCamelCaseString(visualizationType, '-');
        let visualizationCardElement = visualizationTypesObjects['cardElement'][visualizationTypeCamelCaseString];
        let visualizationChartElement = visualizationTypesObjects['chartElement'][visualizationTypeCamelCaseString];

        bootstrap.Modal.getInstance(essRackVisualizationSearchModalElement).hide();
        visualizationChartElement.parentNode.classList.add('d-none');
        visualizationCardElement.querySelector('.card-body .spinner-border').classList.remove('d-none');

        let operatingSiteId = essRackVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = essRackVisualizationSearchModalFormBankSelectElement.value;
        let rackId = essRackVisualizationSearchModalFormRackSelectElement.value;
        let startTime = DateTime.fromFormat(essRackVisualizationSearchModalFormStartDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
        let endTime = DateTime.fromFormat(essRackVisualizationSearchModalFormEndDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);

        let requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/stats/${visualizationType}`);
        requestUrl.searchParams.append('time-bucket-width', '1hour');
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);

        fetch(requestUrl).then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        }).then(responseData => {
            let data = responseData.map(element => {
                let date = new Date(element.time).getTime();
                let value = element[visualizationType.replaceAll('-', '_')];

                return { date: date, value: value };
            });

            visualizationCardElement.querySelector('.card-body p').textContent = `
                ${essRackVisualizationSearchModalFormOperatingSiteSelectElement.options[essRackVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} > Bank ${bankId} > Rack ${rackId}
            `;

            let chart = visualizationTypesObjects['chart'][visualizationTypeCamelCaseString];
            chart.data.setAll(data);

            visualizationCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
            visualizationChartElement.parentNode.classList.remove('d-none');
        }).catch(error => console.log(error));
    });

// Create forecasting bank SoL chart
async function createForecastingBankSoLChart() {
    let root = getChartRoot('forecastingBankSoLChart');
    let chart = getInitialLineChart(root);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: 'day',
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        dateFormats: {
            day: 'yyyy-MM-dd',
            month: 'yyyy-MM'
        },
        periodChangeDateFormats: {
            month: 'yyyy-MM'
        },
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: 'yyyy-MM-dd'
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 30
        })
    }));

    let observedSoLSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Observed SoL',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'observedSoL',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
            labelText: '[bold]{name}[/]\n{valueY}',
        })
    }));

    let forecastingSoLSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Forecasting SoL',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
            labelText: `[bold]{name}[/]\nTop Limit: {topLimitValue}\nForecasting: {valueY}\nBottom Limit: {bottomLimitValue}`,
        })
    }));

    let forecastingTopLimitSoLSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Forecasting Top Limit SoL',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'topLimitValue',
        openValueYField: 'bottomLimitValue',
        valueXField: 'date',
    }));

    let forecastingBottomLimitSoLSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Forecasting Bottom Limit SoL',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'bottomLimitValue',
        valueXField: 'date',
    }));

    observedSoLSeries.strokes.template.setAll({
        strokeWidth: 3
    });

    forecastingSoLSeries.strokes.template.setAll({
        strokeWidth: 3
    });

    forecastingTopLimitSoLSeries.fills.template.setAll({
        fillOpacity: 0.3,
        visible: true
    });
    
    root.dateFormatter.setAll({
        dateFormat: customFullDateFormat,
        dateFields: ['valueX']
    });

    let chartData = [];

    let requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/1/banks/1/`);

    let avgBankSoHData = await loadData(requestUrl);
    avgBankSoHData.forEach(element => {
        chartData.push({
            date: DateTime.fromISO(element['date']).toMillis(),
            observedSoL: (element['value'] - 80) * 5
        });
    });

    // - Save forecasting SoL
    requestUrl = new URL(`${window.location.origin}/api/ess/stats/forecasting-sol/operating-sites/1/banks/1/`);

    let forecastingBankSoLData = await loadData(requestUrl);

    for (const element of forecastingBankSoLData) {
        let item = {};

        if (element['value'] >= 0) {
            item['date'] = DateTime.fromISO(element['date']).toMillis();
            item['value'] = Math.round(element['value'] * 10) / 10;

            if (element['top_limit_value'] >= 0) {
                item['topLimitValue'] = Math.round(element['top_limit_value'] * 10) / 10;
            }
    
            if (element['bottom_limit_value'] >= 0) {
                item['bottomLimitValue'] = Math.round(element['bottom_limit_value'] * 10) / 10;
            }

            chartData.push(item);
        } else {
            break;
        }
    }

    // Setup chart series
    observedSoLSeries.data.setAll(chartData);
    forecastingSoLSeries.data.setAll(chartData);
    forecastingTopLimitSoLSeries.data.setAll(chartData);
    forecastingBottomLimitSoLSeries.data.setAll(chartData);

    // Add guide line
    let rangeDataItem = xAxis.makeDataItem({
        value: currentDateTime.toMillis()
    });

    xAxis.createAxisRange(rangeDataItem);

    rangeDataItem.get('grid').setAll({
        strokeWidth: 3,
        strokeOpacity: 0.5,
        strokeDasharray: [3]
    });

    // Add legend
    // - Remove legend of forecasting SoL top & bottom limit
    let seriesValuesCopy = chart.series.values.slice();
    seriesValuesCopy.pop();
    seriesValuesCopy.pop();

    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50)
    }));
    legend.data.setAll(seriesValuesCopy);

    // Chart animation
    observedSoLSeries.appear(1000);
    forecastingSoLSeries.appear(1000);
    forecastingTopLimitSoLSeries.appear(1000);
    forecastingBottomLimitSoLSeries.appear(1000);
    chart.appear(1000, 100);

    // Setup loading UI
    let forecastingBankSoLCardElement = document.getElementById('forecastingBankSoLCard');
    forecastingBankSoLCardElement.querySelector('.spinner-border').classList.add('d-none');
    
    let forecastingBankSoLChartElement = document.getElementById('forecastingBankSoLChart');
    forecastingBankSoLChartElement.parentNode.classList.remove('d-none');
}

// Create forecasting max rack cell voltage chart
async function createForecastingMaxRackCellVoltageChart() {
    let root = getChartRoot('forecastingMaxRackCellVoltageChart');
    let chart = getInitialLineChart(root);

    // Create axes
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: "second",
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        periodChangeDateFormats: {
            hour: 'yyyy-MM-dd HH:mm'
        },
        tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
    }));
  
    // Add series
    let observedMaxRackCellVoltageSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Observed Max Cell Voltage",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "observedMaxRackCellVoltage",
        valueXField: "time",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}",
            pointerOrientation:"horizontal"
        })
    }));

    let forecastingCatBoostMaxRackCellVoltageSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Forecasting Max Cell Voltage(CatBoost)",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "forecastingCatBoostMaxRackCellVoltage",
        valueXField: "time",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}",
            pointerOrientation:"horizontal"
        })
    }));

    let forecastingLinearMaxRackCellVoltageSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Forecasting Max Cell Voltage(Linear)",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "forecastingLinearMaxRackCellVoltage",
        valueXField: "time",
    }));

    let forecastingLightGBMMaxRackCellVoltageSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Forecasting Max Cell Voltage(LightGBM)",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "forecastingLightGBMMaxRackCellVoltage",
        valueXField: "time",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}",
            pointerOrientation:"horizontal"
        })
    }));

    let forecastingXGBoostMaxRackCellVoltageSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Forecasting Max Cell Voltage(XGBoost)",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "forecastingXGBoostMaxRackCellVoltage",
        valueXField: "time",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}",
            pointerOrientation:"horizontal"
        })
    }));

    observedMaxRackCellVoltageSeries.strokes.template.setAll({
        strokeWidth: 3
    });

    forecastingCatBoostMaxRackCellVoltageSeries.strokes.template.setAll({
        strokeDasharray: [2, 2],
        strokeWidth: 3
    });

    forecastingLinearMaxRackCellVoltageSeries.strokes.template.setAll({
        strokeDasharray: [2, 2]
    });

    forecastingLightGBMMaxRackCellVoltageSeries.strokes.template.setAll({
        strokeDasharray: [2, 2],
        strokeWidth: 3
    });

    forecastingXGBoostMaxRackCellVoltageSeries.strokes.template.setAll({
        strokeDasharray: [2, 2],
        strokeWidth: 3
    });
  
    // Set date fields
    root.dateFormatter.setAll({
        dateFormat: customTimeDesignatorFullDateTimeFormat,
        dateFields: ["valueX"]
    });

    let requestUrl = new URL(`${window.location.origin}/api/ess/stats/forecasting-max-cell-voltage/operating-sites/1/banks/1/racks/2/`);
    requestUrl.searchParams.append('start-time', currentDateTime.set({hour: 0, minute: 0, second: 0}).toFormat(customTimeDesignatorFullDateTimeFormat));
    requestUrl.searchParams.append('end-time', currentDateTime.toFormat(customTimeDesignatorFullDateTimeFormat));

    let responseData = await loadData(requestUrl);
  
    // Set data
    let data = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['time']).toMillis(),
            observedMaxRackCellVoltage: element['values']['observed'],
            forecastingCatBoostMaxRackCellVoltage: element['values']['catboost'],
            forecastingLinearMaxRackCellVoltage: element['values']['linear'],
            forecastingLightGBMMaxRackCellVoltage: element['values']['lightgbm'],
            forecastingXGBoostMaxRackCellVoltage: element['values']['xgboost'],
        }
    });
  
    observedMaxRackCellVoltageSeries.data.setAll(data);
    forecastingCatBoostMaxRackCellVoltageSeries.data.setAll(data);
    forecastingLinearMaxRackCellVoltageSeries.data.setAll(data);
    forecastingLightGBMMaxRackCellVoltageSeries.data.setAll(data);
    forecastingXGBoostMaxRackCellVoltageSeries.data.setAll(data);

    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50)
    }));
    legend.data.setAll(chart.series.values);
  
    // Make stuff animate on load
    observedMaxRackCellVoltageSeries.appear(1000);
    forecastingCatBoostMaxRackCellVoltageSeries.appear(1000);
    forecastingLinearMaxRackCellVoltageSeries.appear(1000);
    forecastingLightGBMMaxRackCellVoltageSeries.appear(1000);
    forecastingXGBoostMaxRackCellVoltageSeries.appear(1000);

    // Setup loading UI
    let forecastingMaxRackCellVoltageCardElement = document.getElementById('forecastingMaxRackCellVoltageCard');
    forecastingMaxRackCellVoltageCardElement.querySelector('.spinner-border').classList.add('d-none');

    let forecastingMaxRackCellVoltageChartElement = document.getElementById('forecastingMaxRackCellVoltageChart');
    forecastingMaxRackCellVoltageChartElement.parentNode.classList.remove('d-none');
  
  chart.appear(1000, 100);
}

/*
 * Event
 */ 

// Avg bank SoH search modal
let essBankSoHVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essBankSoHVisualizationSearchModalFormStartDateTimePicker');
let essBankSoHVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essBankSoHVisualizationSearchModalFormEndDateTimePicker');
let essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essBankSoHVisualizationSearchModalFormOperatingSiteSelect');
let essBankSoHVisualizationSearchModalFormBankSelectElement = document.getElementById('essBankSoHVisualizationSearchModalFormBankSelect');
essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essBankSoHVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essBankSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Bank를 선택해주세요.</option>');
    essBankSoHVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (i = 0; i < bankCount; i++) {
            essBankSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essBankSoHVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

const essBankSoHVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(essBankSoHVisualizationSearchModalFormStartDateTimePickerElement, {
    display: {
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false,
        },
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateFormat) }
    }
});

const essBankSoHVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(essBankSoHVisualizationSearchModalFormEndDateTimePickerElement, {
    display: {
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false,
        }
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateFormat) }
    },
    useCurrent: false
});

essBankSoHVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essBankSoHVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

const essBankSoHVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = essBankSoHVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    essBankSoHVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const essBankSoHVisualizationSearchModalFormValidation = new JustValidate('#essBankSoHVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
essBankSoHVisualizationSearchModalFormValidation
    .addField('#essBankSoHVisualizationSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: '운영 사이트를 선택하세요.'
        }
    ])
    .addField('#essBankSoHVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: 'Bank를 선택하세요.'
        }
    ])
    .addField('#essBankSoHVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: '시작 날짜를 선택하세요.'
        },
    ]).addField('#essBankSoHVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: '마지막 날짜를 선택하세요.'
        },
    ])
    .onSuccess(async (event) => {
        let essBankSoHVisualizationSearchModalElement = document.getElementById('essBankSoHVisualizationSearchModal');
        let avgBankSoHCardElement = document.getElementById('avgBankSoHCard');
        let avgBankSoHChartElement = document.getElementById('avgBankSoHChart');

        // Off modal
        bootstrap.Modal.getInstance(essBankSoHVisualizationSearchModalElement).hide();

        // Setup loading UI
        avgBankSoHChartElement.parentNode.classList.add('d-none');
        avgBankSoHCardElement.querySelector('.card-body .spinner-border').classList.remove('d-none');

        let operatingSiteId = essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = essBankSoHVisualizationSearchModalFormBankSelectElement.value;
        let startDate = DateTime.fromISO(essBankSoHVisualizationSearchModalFormStartDateTimeInput.value).toFormat(customFullDateFormat);
        let endDate = DateTime.fromISO(essBankSoHVisualizationSearchModalFormEndDateTimeInput.value).toFormat(customFullDateFormat);

        let requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/${operatingSiteId}/banks/${bankId}/`);
        requestUrl.searchParams.append('start-date', startDate);
        requestUrl.searchParams.append('end-date', endDate);

        let responseData = await loadData(requestUrl);

        let chartData = responseData.map(element => {
            let date = DateTime.fromISO(element['date']).toMillis();
            let value = element['value'];

            return { date: date, value: value };
        });

        avgBankSoHCardElement.querySelector('.card-body p').textContent = `
            ${essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.options[essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} > Bank ${bankId}
        `;

        avgBankSoHChartSeries.data.setAll(chartData);

        // Off loading UI
        avgBankSoHCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
        avgBankSoHChartElement.parentNode.classList.remove('d-none');
    });

// Avg rack SoH search modal
let essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essRackSoHVisualizationSearchModalFormOperatingSiteSelect');
let essRackSoHVisualizationSearchModalFormBankSelectElement = document.getElementById('essRackSoHVisualizationSearchModalFormBankSelect');
let essRackSoHVisualizationSearchModalFormRackSelectElement = document.getElementById('essRackSoHVisualizationSearchModalFormRackSelect');
let essRackSoHVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essRackSoHVisualizationSearchModalFormStartDateTimePicker');
let essRackSoHVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essRackSoHVisualizationSearchModalFormEndDateTimePicker');

essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essRackSoHVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essRackSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Bank를 선택해주세요.</option>');
    essRackSoHVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    essRackSoHVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackSoHVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Rack을 선택해주세요.</option>');
    essRackSoHVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (i = 0; i < bankCount; i++) {
            essRackSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        essRackSoHVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackSoHVisualizationSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    essRackSoHVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackSoHVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', '<option value="" selected disabled>Rack을 선택해주세요.</option>')

    let operatingSiteId = essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (i = 0; i < rackCount; i++) {
            essRackSoHVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essRackSoHVisualizationSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        essRackSoHVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

const essRackSoHVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(essRackSoHVisualizationSearchModalFormStartDateTimePickerElement, {
    display: {
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false,
        },
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateFormat) }
    }
});

const essRackSoHVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(essRackSoHVisualizationSearchModalFormEndDateTimePickerElement, {
    display: {
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false,
        }
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat(customFullDateFormat) }
    },
    useCurrent: false
});

essRackSoHVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essRackSoHVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

const essRackSoHVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = essRackSoHVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    essRackSoHVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const essRackSoHVisualizationSearchModalFormValidation = new JustValidate('#essRackSoHVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
essRackSoHVisualizationSearchModalFormValidation
    .addField('#essRackSoHVisualizationSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: '운영 사이트를 선택하세요.'
        }
    ])
    .addField('#essRackSoHVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: 'Bank를 선택하세요.'
        }
    ])
    .addField('#essRackSoHVisualizationSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: 'Rack을 선택하세요.'
        }
    ])
    .addField('#essRackSoHVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: '시작 날짜를 선택하세요.'
        },
    ]).addField('#essRackSoHVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: '마지막 날짜를 선택하세요.'
        },
    ])
    .onSuccess(async (event) => {
        let essRackSoHVisualizationSearchModalElement = document.getElementById('essRackSoHVisualizationSearchModal');
        let avgRackSoHCardElement = document.getElementById('avgRackSoHCard');
        let avgRackSoHChartElement = document.getElementById('avgRackSoHChart');

        // Off modal
        bootstrap.Modal.getInstance(essRackSoHVisualizationSearchModalElement).hide();

        // Setup loading UI
        avgRackSoHChartElement.parentNode.classList.add('d-none');
        avgRackSoHCardElement.querySelector('.card-body .spinner-border').classList.remove('d-none');

        let operatingSiteId = essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = essRackSoHVisualizationSearchModalFormBankSelectElement.value;
        let rackId = essRackSoHVisualizationSearchModalFormRackSelectElement.value;
        let startDate = DateTime.fromISO(essRackSoHVisualizationSearchModalFormStartDateTimeInput.value).toFormat(customFullDateFormat);
        let endDate = DateTime.fromISO(essRackSoHVisualizationSearchModalFormEndDateTimeInput.value).toFormat(customFullDateFormat);

        let requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        requestUrl.searchParams.append('start-date', startDate);
        requestUrl.searchParams.append('end-date', endDate);

        let responseData = await loadData(requestUrl);

        let chartData = responseData.map(element => {
            let date = DateTime.fromISO(element['date']).toMillis();
            let value = element['value'];

            return { date: date, value: value };
        });

        avgRackSoHCardElement.querySelector('.card-body p').textContent = `
            ${essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.options[essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} > Bank ${bankId} > Rack ${rackId}
        `;

        avgRackSoHChartSeries.data.setAll(chartData);

        // Off loading UI
        avgRackSoHCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
        avgRackSoHChartElement.parentNode.classList.remove('d-none');
    });

/* 
 * Initial task
 */

// Create avg bank SoH chart
let avgBankSoHChartSeries = getAvgSoHChartSeries('avgBankSoHChart');

let requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/1/banks/1/`);

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let chartData = responseData.map(element => {
        return {
            date: DateTime.fromISO(element['date']).toMillis(),
            value: element['value']
        }
    });
    
    avgBankSoHChartSeries.data.setAll(chartData);

    // Off loading UI
    let avgBankSoHCardElement = document.getElementById('avgBankSoHCard');
    avgBankSoHCardElement.querySelector('.spinner-border').classList.add('d-none');

    let avgBankSoHChartElement = document.getElementById('avgBankSoHChart');
    avgBankSoHChartElement.parentNode.classList.remove('d-none');
}).catch(error => console.log(error));

// Create avg rack SoH chart
let avgRackSoHChartSeries = getAvgSoHChartSeries('avgRackSoHChart');

requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/1/banks/1/racks/1/`);

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    let chartData = responseData.map(element => {
        return {
            date: DateTime.fromISO(element['date']).toMillis(),
            value: element['value']
        }
    });
    
    avgRackSoHChartSeries.data.setAll(chartData);

    // Off loading UI
    let avgRackSoHCardElement = document.getElementById('avgRackSoHCard');
    avgRackSoHCardElement.querySelector('.spinner-border').classList.add('d-none');

    let avgRackSoHChartElement = document.getElementById('avgRackSoHChart');
    avgRackSoHChartElement.parentNode.classList.remove('d-none');
}).catch(error => console.log(error));


createForecastingBankSoLChart();
createForecastingMaxRackCellVoltageChart();

