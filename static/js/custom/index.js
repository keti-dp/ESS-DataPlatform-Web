const essProtectionMap = JSON.parse(document.getElementById('ess-protection-map').textContent);
const customFullDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
const customTimeDesignatorFullDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;

function getCamelCaseString(text, seperator = '-') {
    return text.split(seperator).map((element, index) => index > 0 ? element.charAt(0).toUpperCase() + element.substr(1) : element).join('');
}

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
let DateTime = luxon.DateTime;
let currentDateTime = DateTime.now();
let startTimeObject = currentDateTime.startOf('day');
let startTime = startTimeObject.toFormat(customTimeDesignatorFullDateTimeFormat);
let endTime = startTimeObject.plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

let visualizationTypes = ['avg-bank-soc', 'avg-rack-soc', 'avg-bank-soh', 'avg-rack-soh', 'avg-bank-power'];

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

            visualizationTypesObjects['chart'][visualizationTypeCamelCaseString] = getLineChart(chartString, data, chartOption);
        } else {
            visualizationTypesObjects['chart'][visualizationTypeCamelCaseString] = getLineChart(chartString, data);
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
