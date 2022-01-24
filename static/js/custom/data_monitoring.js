// Luxon alias 'DateTime'
var DateTime = luxon.DateTime;

const essProtectionMap = JSON.parse(document.getElementById('ess-protection-map').textContent);

async function loadData(requestUrl) {
    let response = await fetch(requestUrl);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(response.status);
}

function getOperationSiteInfoRows(operationSiteInfoTypeObject) {
    let rows = [];
    let row = [];

    for (const column of Object.keys(operationSiteInfoTypeObject)) {
        if (row.length >= 3) {
            rows.push(Object.assign([], row));
            row = [];
        }

        row.push(column);
    }

    if (row) {
        rows.push(Object.assign([], row));
    }

    return rows;
}

function getOperationSiteInfoMonitoringList(operationSiteId, operationSiteInfoType, operationSiteInfoIds) {
    // 'operationSiteInfoIds' type is Array which have 1~2 elements expected
    // 'operationSiteInfoIds' first element is 'bank_id'
    // 'operationSiteInfoIds' second element is 'rack_id'

    if (!Array.isArray(operationSiteInfoIds) || (operationSiteInfoIds.length == 0 || operationSiteInfoIds.length >= 3)) {
        console.log('operationSiteInfoIds type is Array which have 1~2 elements expected');

        return;
    }

    let operationSiteInfoMonitoringList = document.createElement('div');
    operationSiteInfoMonitoringList.setAttribute('class', 'row');

    var operationSiteInfo = '';

    // 'operationSiteInfoType' is 'bank'
    if (operationSiteInfoIds.length == 1) {
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'info'].join('-');
        operationSiteInfoMonitoringList.innerHTML = '<div class="col-auto offset-1 p-r-0"><i class="bi bi-circle-fill text-primary"></i></div>' +
            '<div class="col"><p>Bank ' + operationSiteInfoIds[0] + ' Info</p></div><hr>';
    } else if (operationSiteInfoIds.length == 2) { // 'operationSiteInfoType' is 'rack'
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'rack' + operationSiteInfoIds[1], 'info'].join('-');
        operationSiteInfoMonitoringList.innerHTML = '<div class="col-auto offset-1 p-r-0"><i class="bi bi-circle-fill text-primary"></i></div>' +
            '<div class="col"><p>Rack ' + operationSiteInfoIds[1] + ' Info</p></div><hr>';
    }

    operationSiteInfoMonitoringList.setAttribute('id', [operationSiteInfo, 'monitoring', 'list'].join('-'));

    let operationSiteInfoTypeObject = essProtectionMap['dataType'][operationSiteId][operationSiteInfoType];
    let operationSiteInfoRows = getOperationSiteInfoRows(operationSiteInfoTypeObject);

    for (const operationSiteInfoRow of operationSiteInfoRows) {
        let row = document.createElement('div');
        row.setAttribute('class', 'row');

        for (const operationSiteInfoColumn of operationSiteInfoRow) {
            var column = document.createElement('div');
            column.setAttribute('class', 'col-xl-4 col-md-12');
            column.setAttribute('id', [operationSiteInfo, operationSiteInfoColumn, 'column'].join('-'));
            column.setAttribute('data-bs-toggle', 'tooltip');
            column.setAttribute('data-bs-placement', 'top');
            column.setAttribute('title', operationSiteInfoColumn);

            let operationSiteIdNum = operationSiteId.replace('operationSite', '');

            // 'operationSiteInfoType' is 'bank'
            if (operationSiteInfoIds.length == 1) {
                column.innerHTML = '<div class="row"><div class="col-auto p-r-0"><i class="bi bi-circle-fill text-primary"></i></div>' +
                    '<div class="col text-truncate" data-bs-toggle="modal" data-bs-target="#monitoringListItemModal" data-operation-site-info-type="' + operationSiteInfoType +
                    '" data-operation-site-id="' + operationSiteIdNum + '" data-operation-site-bank-id="' + operationSiteInfoIds[0] + '" data-operation-site-info-column="' + operationSiteInfoColumn.toLowerCase() +
                    '"><p><small>' + operationSiteInfoColumn + '</small></p></div></div>'
            } else if (operationSiteInfoIds.length == 2) { // 'operationSiteInfoType' is 'rack'
                column.innerHTML = '<div class="row"><div class="col-auto p-r-0"><i class="bi bi-circle-fill text-primary"></i></div>' +
                    '<div class="col text-truncate" data-bs-toggle="modal" data-bs-target="#monitoringListItemModal" data-operation-site-info-type="' + operationSiteInfoType +
                    '" data-operation-site-id="' + operationSiteIdNum + '" data-operation-site-bank-id="' + operationSiteInfoIds[0] + '" data-operation-site-info-column="' + operationSiteInfoColumn.toLowerCase() +
                    '" data-operation-site-rack-id="' + operationSiteInfoIds[1] + '"><p><small>' + operationSiteInfoColumn + '</small></p></div></div>'
            }

            row.appendChild(column);
        }

        operationSiteInfoMonitoringList.appendChild(row);
    }

    return operationSiteInfoMonitoringList;
}

function drawMonitoringListAndGetOperationSiteInfoWarningFlag(operationSiteId, operationSiteInfoType, operationSiteInfoIds, data) {
    // 'operationSiteInfoIds' type is Array which have 1~2 elements expected
    // 'operationSiteInfoIds' first element is 'bank_id'
    // 'operationSiteInfoIds' second element is 'rack_id'

    if (!Array.isArray(operationSiteInfoIds) || (operationSiteInfoIds.length == 0 || operationSiteInfoIds.length >= 3)) {
        console.log('operationSiteInfoIds type is Array which have 1~2 elements expected');

        return;
    }

    let isWarningOfOperationSiteInfo = false;
    let operationSiteInfo = '';

    if (operationSiteInfoIds.length == 1) {
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'info'].join('-');
    } else if (operationSiteInfoIds.length == 2) {
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'rack' + operationSiteInfoIds[1], 'info'].join('-');
    }


    let operationSiteInfoMonitoringList = document.getElementById([operationSiteInfo, 'monitoring', 'list'].join('-'));
    let operationSiteInfoMonitoringListIcon = operationSiteInfoMonitoringList.querySelector('i');
    let operationSiteInfoTypeObject = essProtectionMap['dataType'][operationSiteId][operationSiteInfoType];

    for (const column of Object.keys(operationSiteInfoTypeObject)) {
        let lowerCaseColumn = column.toLowerCase();
        let operationSiteInfoColumn = document.getElementById([operationSiteInfo, column, 'column'].join('-'));
        let operationSiteInfoColumnIcon = operationSiteInfoColumn.querySelector('i');

        switch (operationSiteInfoTypeObject[column]['type']) {
            case 'number':
                let splitedOperationSiteInfoTypeObjectColumnValue = operationSiteInfoTypeObject[column]['value'].split('~');

                if (splitedOperationSiteInfoTypeObjectColumnValue.length == 1 && splitedOperationSiteInfoTypeObjectColumnValue[0] != '-') {
                    if (data[lowerCaseColumn] >= Number(splitedOperationSiteInfoTypeObjectColumnValue[0])) {
                        isWarningOfOperationSiteInfo = true;
                        operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                        operationSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                        operationSiteInfoColumnIcon.classList.add('text-secondary');
                    }
                } else if (splitedOperationSiteInfoTypeObjectColumnValue.length == 2) {
                    if ((data[lowerCaseColumn] <= Number(splitedOperationSiteInfoTypeObjectColumnValue[0])) || (data[lowerCaseColumn] >= Number(splitedOperationSiteInfoTypeObjectColumnValue[1]))) {
                        isWarningOfOperationSiteInfo = true;
                        operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                        operationSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                        operationSiteInfoColumnIcon.classList.add('text-secondary');
                    }
                }

                break;
            case 'boolean':
                if (data[lowerCaseColumn] == 1) {
                    isWarningOfOperationSiteInfo = true;
                    operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                    operationSiteInfoColumnIcon.classList.add('text-danger');
                } else {
                    operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                    operationSiteInfoColumnIcon.classList.add('text-secondary');
                }

                break;
            default:
                console.log('operationSiteInfoTypeObjectColumn is invalid type');
                break;
        }
    }

    if (isWarningOfOperationSiteInfo) {
        operationSiteInfoMonitoringListIcon.classList.remove('text-primary', 'text-secondary');
        operationSiteInfoMonitoringListIcon.classList.add('text-danger');
    } else {
        operationSiteInfoMonitoringListIcon.classList.remove('text-primary', 'text-danger');
        operationSiteInfoMonitoringListIcon.classList.add('text-secondary');
    }

    return isWarningOfOperationSiteInfo;
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
            baseInterval: { timeUnit: "second", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {})
        }, option['xAxis']))
    );

    xAxis.get("dateFormats")["hour"] = "HH";
    xAxis.get("periodChangeDateFormats")["hour"] = "yyyy-MM-dd HH";

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

    series.strokes.template.set("strokeWidth", 3);

    series.get("tooltip").label.set("text", "[bold]{name}[/]\n{valueX.formatDate('yyyy-MM-dd HH:mm:ss')}: {valueY.formatNumber('#.000')}")
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

/* Initial task */
// - Create monitoring list
var opertaionSiteMonitoringListColumn = document.getElementById('operationSite1-monitoring-list-column');
opertaionSiteMonitoringListColumn.appendChild(getOperationSiteInfoMonitoringList('operationSite1', 'bank', [1]));

for (i = 1; i <= 8; i++) {
    opertaionSiteMonitoringListColumn.appendChild(getOperationSiteInfoMonitoringList('operationSite1', 'rack', [1, i]));
}

setInterval(async () => {
    let operationSiteWarningFlagList = [];

    // Bank info draw monitoring list
    let readLatestBankRequestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/latest/');

    await loadData(readLatestBankRequestUrl)
        .then(data => {
            let operationSiteWarningFlag = drawMonitoringListAndGetOperationSiteInfoWarningFlag('operationSite1', 'bank', [1], data);
            operationSiteWarningFlagList.push(operationSiteWarningFlag);
        }).catch(error => {
            console.log(error);
        });

    // Rack info draw monitoring list
    for (let i = 1; i <= 8; i++) {
        var readLatestRackRequestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/racks/' + i + '/latest/');

        await loadData(readLatestRackRequestUrl)
            .then(data => {
                let operationSiteWarningFlag = drawMonitoringListAndGetOperationSiteInfoWarningFlag('operationSite1', 'rack', [1, i], data);
                operationSiteWarningFlagList.push(operationSiteWarningFlag);
            }).catch(error => {
                console.log(error);
            });
    }

    // Bank draw monitoring list
    var isWarningOfOperationSite = operationSiteWarningFlagList.some(element => element);
    var operationSiteMonitoringListBankIcon = document.getElementById('operationSite1-bank1-info-monitoring-list').previousElementSibling.querySelector('i');

    if (isWarningOfOperationSite) {
        operationSiteMonitoringListBankIcon.classList.remove('text-primary', 'text-secondary');
        operationSiteMonitoringListBankIcon.classList.add('text-danger');
    } else {
        operationSiteMonitoringListBankIcon.classList.remove('text-primary', 'text-danger');
        operationSiteMonitoringListBankIcon.classList.add('text-secondary');
    }
}, 1000);

// - Create monitoring list item chart
var monitoringListItemChart;

var monitoringListItemModalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-target="#monitoringListItemModal"]'));
monitoringListItemModalTriggerList.forEach(element => {
    element.addEventListener('click', event => {
        let chart = document.getElementById('monitoringListItemChart');
        let loader = chart.previousElementSibling.firstElementChild;

        chart.classList.add('d-none');
        loader.classList.remove('d-none');

        let operationSiteInfoType = element.dataset.operationSiteInfoType;
        let operationSiteId = element.dataset.operationSiteId;
        let operationSiteBankId = element.dataset.operationSiteBankId;
        let operationSiteInfoColumn = element.dataset.operationSiteInfoColumn;
        let requestUrl;

        switch (operationSiteInfoType) {
            case 'bank':
                requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/' + operationSiteId + '/banks/' + operationSiteBankId + '/');
                break;
            case 'rack':
                let operationSiteRackId = element.dataset.operationSiteRackId;
                requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/' + operationSiteId + '/banks/' + operationSiteBankId + '/racks/' + operationSiteRackId + '/');
                break;
            default:
                break;
        }

        var currentDateTime = DateTime.now();
        var currentDate = currentDateTime.toISODate();

        let monitoringListItemModalTitleEl = document.getElementById('monitoringListItemModalLabel');
        monitoringListItemModalTitleEl.innerHTML = operationSiteInfoColumn + ' 시간별 모니터링 차트 <span class="material-icons-two-tone">watch_later</span> ' + currentDate;

        requestUrl.searchParams.append('date', currentDate);
        requestUrl.searchParams.append('fields', ['timestamp', operationSiteInfoColumn].join(','));
        requestUrl.searchParams.append('no_page', '');

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = [];

            responseData.forEach(element => {
                let date = new Date(element['timestamp']).getTime();
                let value = element[operationSiteInfoColumn];

                data.push({ date: date, value: value });
            });

            if (monitoringListItemChart && 'data' in monitoringListItemChart) {
                monitoringListItemChart.data.setAll(data);
            } else {
                monitoringListItemChart = getLineChart('monitoringListItemChart', data);
            }

            loader.classList.add('d-none');
            chart.classList.remove('d-none');
        }).catch(error => {
            console.log(error);
        });
    });
});

// - Create room sensor of bank header in monitoring list
setInterval(() => {
    let requestUrl = new URL(window.location.origin + '/api/ess/operation-sites/1/banks/1/etc/latest/');

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(data => {
        let header = document.querySelector('#operationSite1-monitoring-list-column > div:nth-child(1) > div.col > h6');
        let oldSmall = header.querySelector('small');

        if (oldSmall) {
            header.removeChild(oldSmall);
        }

        let newSmall = document.createElement('small');
        // Degree Celsius HTML Code '&#8451;'
        newSmall.innerHTML = ' <span class="material-icons-two-tone">thermostat</span>' + data['sensor1_temperature'] + '&#8451;' + ' <span class="material-icons-two-tone">water_drop</span>' + data['sensor1_humidity'] + '%';

        header.appendChild(newSmall);
    }).catch(error => {
        console.log(error);
    });
}, 1000);

// - Create monitoring log
let operationSite1MonitoringLogColumn = document.getElementById('operationSite1-monitoring-log-column');
var monitoringLogContainerElement = operationSite1MonitoringLogColumn.querySelector('div');
var requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
requestUrl.searchParams.append('operation_site', 'operation1_local');
requestUrl.searchParams.append('time_gte', DateTime.utc().toFormat('yyyy-MM-dd').toString());
requestUrl.searchParams.append('time_lte', DateTime.utc().plus({ days: 1 }).toFormat('yyyy-MM-dd').toString());

function getMonitoringLogAlertEl(data) {
    let monitoringLogAlertEl = document.createElement('div');
    let alertClass;

    switch (data['log_level']) {
        case 'info':
            alertClass = 'alert-info';
            break;
        case 'warning':
            alertClass = 'alert-warning'
            break;
        case 'critical':
            alertClass = 'alert-danger'
            break;
        case 'error':
            alertClass = 'alert-primary'
            break;
        default:
            alertClass = 'alert-primary'
            console.log('', data['log_level']);
            break;
    }

    monitoringLogAlertEl.setAttribute('class', 'alert ' + alertClass + ' m-b-5 p-l-10 p-t-0 p-b-0');
    monitoringLogAlertEl.setAttribute('role', 'alert');
    monitoringLogAlertEl.innerHTML = '<p class="text-truncate m-t-0 m-b-0"><small>' + data['message'] + '</small></p>' +
        '<p class="text-truncate m-t-0 m-b-0"><small>' + DateTime.fromISO(data['time']).toFormat('HH:mm:ss') + '</small></p>';

    return monitoringLogAlertEl;
}

fetch(requestUrl).then(response => {
    return response.json();
}).then(responseData => {
    for (const data of responseData['results']) {
        var alertElement = getMonitoringLogAlertEl(data);

        monitoringLogContainerElement.appendChild(alertElement);
    }
}).catch(error => {
    console.log(error);
});

let initialMonitoringLogLoadInterval = setInterval(() => {
    // After wait for save time of monitoring log data, lazy request
    var time = DateTime.utc().minus({ seconds: 2 }).toFormat('yyyy-MM-dd HH:mm:ss').toString().replace(' ', 'T');
    let requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
    requestUrl.searchParams.append('operation_site', 'operation1_local');
    requestUrl.searchParams.append('time', time);

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(responseData => {
        let data = responseData['results'];

        data.forEach(element => {
            let alertElement = getMonitoringLogAlertEl(element);

            if (monitoringLogContainerElement.firstElementChild) {
                monitoringLogContainerElement.firstElementChild.before(alertElement);
            } else {
                monitoringLogContainerElement.appendChild(alertElement);
            }
        });
    }).catch(error => {
        console.log(error);
    });
}, 1000);

// - Download operation data
// Trigger the contents of the modal depending on which button was clicked
var operationDataDownloadModal = document.getElementById('operationDataDownloadModal');
operationDataDownloadModal.addEventListener('show.bs.modal', function (event) {
    let button = event.relatedTarget;
    let operationSiteId = button.getAttribute('data-operation-site-id');
    let downloadButton = operationDataDownloadModal.querySelector('.btn-primary');
    downloadButton.setAttribute('data-operation-site-id', operationSiteId);
});

const operationDataDownloadModalStartDateTimePickerElement = document.getElementById('operationDataDownloadModalStartDateTimePicker');
const operationDataDownloadModalStartDateTimeTempusDominus = new tempusDominus.TempusDominus(operationDataDownloadModalStartDateTimePickerElement, {
    display: {
        components: {
            seconds: true
        },
        sideBySide: true
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat('yyyy-MM-dd HH:mm:ss') }
    }
});
const operationDataDownloadModalEndDateTimeTempusDominus = new tempusDominus.TempusDominus(document.getElementById('operationDataDownloadModalEndDateTimePicker'), {
    display: {
        components: {
            seconds: true
        },
        sideBySide: true
    },
    hooks: {
        inputFormat: (context, date) => { return DateTime.fromISO(date.toISOString()).toFormat('yyyy-MM-dd HH:mm:ss') }
    },
    useCurrent: false
});

// Using event listeners
operationDataDownloadModalStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    operationDataDownloadModalEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// Using subscribe method
const operationDataDownloadModalEndDateTimeTempusDominusSubscription = operationDataDownloadModalEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    operationDataDownloadModalStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

// Validate operation data download modal form
const operationDataDownloadModalFormValidation = new JustValidate('#operationDataDownloadModalForm', {
    errorFieldCssClass: 'is-invalid',
    tootip: {
        position: 'bottom'
    }
});
operationDataDownloadModalFormValidation.addField('#operationDataDownloadModalStartDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: 'yyyy-MM-dd HH:mm:ss'
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).addField('#operationDataDownloadModalEndDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: 'yyyy-MM-dd HH:mm:ss'
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).addRequiredGroup(
    '#operationDataDownloadModalDataTypeCheckboxGroup',
    '1가지 이상의 데이터 타입을 선택하세요.'
).onSuccess(event => {
    let checkedBoxElements = document.querySelectorAll('#operationDataDownloadModalDataTypeCheckboxGroup input:checked');
    checkedBoxElements.forEach(element => {
        let operationSiteId = document.querySelector('#operationDataDownloadModalForm button[type=submit]').getAttribute('data-operation-site-id');
        let dataType = element.value;
        let startTime = document.getElementById('operationDataDownloadModalStartDateTimeInput').value.replace(' ', 'T');
        let endTime = document.getElementById('operationDataDownloadModalEndDateTimeInput').value.replace(' ', 'T');
        let requestUrl = new URL(window.location.origin + '/api/ess/download/operation-sites/' + operationSiteId + '/' + dataType + '/');
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);

        fetch(requestUrl).then(response => {
            return response.blob();
        }).then(data => {
            let tempAnchorElement = document.createElement('a');
            tempAnchorElement.href = window.URL.createObjectURL(data);
            tempAnchorElement.setAttribute('download', dataType);
            tempAnchorElement.click();
        }).catch(error => {
            console.log(error);
        });
    });
});

// - Tagging monitoring log message search input
var monitoringLogColumnInput = operationSite1MonitoringLogColumn.querySelector('input');
new Tagify(monitoringLogColumnInput, {
    originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
});;

/* Event task */
// - Monitoring log level select event
var monitoringLogLoadInterval;
var monitoringLogColumnSelectElement = document.querySelector('#operationSite1-monitoring-log-column select');
monitoringLogColumnSelectElement.addEventListener('change', event => {
    monitoringLogContainerElement.innerHTML = '';

    // Clear initial monitoring log load interval
    if (initialMonitoringLogLoadInterval) {
        clearInterval(initialMonitoringLogLoadInterval);
    }

    // Clear previous monitoring log load interval
    if (monitoringLogLoadInterval) {
        clearInterval(monitoringLogLoadInterval);
    }

    let logLevel = event.target.value;
    let logMessage = monitoringLogColumnInput.value;
    let requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
    requestUrl.searchParams.append('operation_site', 'operation1_local');
    requestUrl.searchParams.append('time_gte', DateTime.utc().toFormat('yyyy-MM-dd').toString());
    requestUrl.searchParams.append('time_lte', DateTime.utc().plus({ days: 1 }).toFormat('yyyy-MM-dd').toString());

    if (logLevel !== 'all') {
        requestUrl.searchParams.append('log_level', logLevel);
    }

    if (logMessage) {
        logMessage.split(',').forEach(element => {
            requestUrl.searchParams.append('message', element);
        });
    }

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(responseData => {
        for (const data of responseData['results']) {
            var alertElement = getMonitoringLogAlertEl(data);

            monitoringLogContainerElement.appendChild(alertElement);
        }
    }).catch(error => {
        console.log(error);
    });

    monitoringLogLoadInterval = setInterval(() => {
        // After wait for save time of monitoring log data, lazy request
        let time = DateTime.utc().minus({ seconds: 2 }).toFormat('yyyy-MM-dd HH:mm:ss').toString().replace(' ', 'T');
        let requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
        requestUrl.searchParams.append('operation_site', 'operation1_local');
        requestUrl.searchParams.append('time', time);

        if (logLevel !== 'all') {
            requestUrl.searchParams.append('log_level', logLevel);
        }

        if (logMessage) {
            logMessage.split(',').forEach(element => {
                requestUrl.searchParams.append('message', element);
            });
        }

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = responseData['results'];

            data.forEach(element => {
                let alertElement = getMonitoringLogAlertEl(element);

                if (monitoringLogContainerElement.firstElementChild) {
                    monitoringLogContainerElement.firstElementChild.before(alertElement);
                } else {
                    monitoringLogContainerElement.appendChild(alertElement);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }, 1000);
});

// - Monitoring log message search input event
monitoringLogColumnInput.addEventListener('change', event => {
    monitoringLogContainerElement.innerHTML = '';

    // Clear initial monitoring log load interval
    if (initialMonitoringLogLoadInterval) {
        clearInterval(initialMonitoringLogLoadInterval);
    }

    // Clear previous monitoring log load interval
    if (monitoringLogLoadInterval) {
        clearInterval(monitoringLogLoadInterval);
    }

    let logLevel = operationSite1MonitoringLogColumn.querySelector('select').value;
    let logMessage = event.target.value;
    let requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
    requestUrl.searchParams.append('operation_site', 'operation1_local');
    requestUrl.searchParams.append('time_gte', DateTime.utc().toFormat('yyyy-MM-dd').toString());
    requestUrl.searchParams.append('time_lte', DateTime.utc().plus({ days: 1 }).toFormat('yyyy-MM-dd').toString());

    if (logLevel !== 'all') {
        requestUrl.searchParams.append('log_level', logLevel);
    }

    if (logMessage) {
        logMessage.split(',').forEach(element => {
            requestUrl.searchParams.append('message', element);
        });
    }

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(responseData => {
        for (const data of responseData['results']) {
            var alertElement = getMonitoringLogAlertEl(data);

            monitoringLogContainerElement.appendChild(alertElement);
        }
    }).catch(error => {
        console.log(error);
    });

    monitoringLogLoadInterval = setInterval(() => {
        // After wait for save time of monitoring log data, lazy request
        let time = DateTime.utc().minus({ seconds: 2 }).toFormat('yyyy-MM-dd HH:mm:ss').toString().replace(' ', 'T');
        let requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
        requestUrl.searchParams.append('operation_site', 'operation1_local');
        requestUrl.searchParams.append('time', time);

        if (logLevel !== 'all') {
            requestUrl.searchParams.append('log_level', logLevel);
        }

        if (logMessage) {
            logMessage.split(',').forEach(element => {
                requestUrl.searchParams.append('message', element);
            });
        }

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(responseData => {
            let data = responseData['results'];

            data.forEach(element => {
                let alertElement = getMonitoringLogAlertEl(element);

                if (monitoringLogContainerElement.firstElementChild) {
                    monitoringLogContainerElement.firstElementChild.before(alertElement);
                } else {
                    monitoringLogContainerElement.appendChild(alertElement);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }, 1000);
});