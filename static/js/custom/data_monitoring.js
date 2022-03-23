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

function getoperatingSiteInfoRows(operatingSiteInfoTypeObject) {
    let rows = [];
    let row = [];

    for (const column of Object.keys(operatingSiteInfoTypeObject)) {
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

function getOperatingSiteInfoMonitoringList(operatingSiteId, operatingSiteInfoType, operatingSiteInfoIds) {
    // 'operatingSiteInfoIds' type is Array which have 1~2 elements expected
    // 'operatingSiteInfoIds' first element is 'bank_id'
    // 'operatingSiteInfoIds' second element is 'rack_id'

    if (!Array.isArray(operatingSiteInfoIds) || (operatingSiteInfoIds.length == 0 || operatingSiteInfoIds.length >= 3)) {
        console.log('operatingSiteInfoIds type is Array which have 1~2 elements expected');

        return;
    }

    let operatingSiteInfoMonitoringList = document.createElement('div');
    operatingSiteInfoMonitoringList.setAttribute('class', 'row');

    var operatingSiteInfo = '';

    // 'operatingSiteInfoType' is 'bank'
    if (operatingSiteInfoIds.length == 1) {
        operatingSiteInfo = [operatingSiteId, 'bank' + operatingSiteInfoIds[0], 'info'].join('-');
        operatingSiteInfoMonitoringList.innerHTML = `
            <div class="col-auto offset-1 p-r-0">
                <i class="bi bi-circle-fill text-primary"></i>
            </div>
            <div class="col">
                <p>Bank ${operatingSiteInfoIds[0]} Info</p>
            </div>
            <hr>
        `;
    } else if (operatingSiteInfoIds.length == 2) { // 'operatingSiteInfoType' is 'rack'
        operatingSiteInfo = [operatingSiteId, 'bank' + operatingSiteInfoIds[0], 'rack' + operatingSiteInfoIds[1], 'info'].join('-');
        operatingSiteInfoMonitoringList.innerHTML = `
            <div class="col-auto offset-1 p-r-0">
                <i class="bi bi-circle-fill text-primary"></i>
            </div>
            <div class="col">
                <p>Rack ${operatingSiteInfoIds[1]} Info</p>
            </div>
            <hr>
        `;
    }

    operatingSiteInfoMonitoringList.setAttribute('id', [operatingSiteInfo, 'monitoring', 'list'].join('-'));

    let operatingSiteInfoTypeObject = essProtectionMap['dataType'][operatingSiteId][operatingSiteInfoType];
    let operatingSiteInfoRows = getoperatingSiteInfoRows(operatingSiteInfoTypeObject);

    for (const operatingSiteInfoRow of operatingSiteInfoRows) {
        let row = document.createElement('div');
        row.setAttribute('class', 'row');

        for (const operatingSiteInfoColumn of operatingSiteInfoRow) {
            var column = document.createElement('div');
            column.setAttribute('class', 'col-xl-4 col-md-12');
            column.setAttribute('id', [operatingSiteInfo, operatingSiteInfoColumn, 'column'].join('-'));
            column.setAttribute('data-bs-toggle', 'tooltip');
            column.setAttribute('data-bs-placement', 'top');
            column.setAttribute('title', operatingSiteInfoColumn);

            let operatingSiteIdNum = operatingSiteId.replace('operatingSite', '');

            // 'operatingSiteInfoType' is 'bank'
            if (operatingSiteInfoIds.length == 1) {
                column.innerHTML = `
                    <div class="row">
                        <div class="col-auto p-r-0">
                            <i class="bi bi-circle-fill text-primary"></i>
                        </div>
                        <div class="col text-truncate" data-bs-toggle="modal" data-bs-target="#monitoringListItemModal" data-operating-site-info-type="${operatingSiteInfoType}" data-operating-site-id="${operatingSiteIdNum}" data-operating-site-bank-id="${operatingSiteInfoIds[0]}" data-operating-site-info-column="${operatingSiteInfoColumn.toLowerCase()}">
                            <p><small>${operatingSiteInfoColumn}</small></p>
                        </div>
                    </div>
                `;
            } else if (operatingSiteInfoIds.length == 2) { // 'operatingSiteInfoType' is 'rack'
                column.innerHTML = `
                    <div class="row">
                        <div class="col-auto p-r-0">
                            <i class="bi bi-circle-fill text-primary"></i>
                        </div>
                        <div class="col text-truncate" data-bs-toggle="modal" data-bs-target="#monitoringListItemModal" data-operating-site-info-type="${operatingSiteInfoType}" data-operating-site-id="${operatingSiteIdNum}" data-operating-site-bank-id="${operatingSiteInfoIds[0]}" data-operating-site-info-column="${operatingSiteInfoColumn.toLowerCase()}" data-operating-site-rack-id="${operatingSiteInfoIds[1]}">
                            <p><small>${operatingSiteInfoColumn}</small></p>
                        </div>
                    </div>
                `;

            }

            row.appendChild(column);
        }

        operatingSiteInfoMonitoringList.appendChild(row);
    }

    return operatingSiteInfoMonitoringList;
}

function drawMonitoringListAndGetoperatingSiteInfoWarningFlag(operatingSiteId, operatingSiteInfoType, operatingSiteInfoIds, data) {
    // 'operatingSiteInfoIds' type is Array which have 1~2 elements expected
    // 'operatingSiteInfoIds' first element is 'bank_id'
    // 'operatingSiteInfoIds' second element is 'rack_id'

    if (!Array.isArray(operatingSiteInfoIds) || (operatingSiteInfoIds.length == 0 || operatingSiteInfoIds.length >= 3)) {
        console.log('operatingSiteInfoIds type is Array which have 1~2 elements expected');

        return;
    }

    let isWarningOfoperatingSiteInfo = false;
    let operatingSiteInfo = '';

    if (operatingSiteInfoIds.length == 1) {
        operatingSiteInfo = [operatingSiteId, 'bank' + operatingSiteInfoIds[0], 'info'].join('-');
    } else if (operatingSiteInfoIds.length == 2) {
        operatingSiteInfo = [operatingSiteId, 'bank' + operatingSiteInfoIds[0], 'rack' + operatingSiteInfoIds[1], 'info'].join('-');
    }


    let operatingSiteInfoMonitoringList = document.getElementById([operatingSiteInfo, 'monitoring', 'list'].join('-'));
    let operatingSiteInfoMonitoringListIcon = operatingSiteInfoMonitoringList.querySelector('i');
    let operatingSiteInfoTypeObject = essProtectionMap['dataType'][operatingSiteId][operatingSiteInfoType];

    for (const column of Object.keys(operatingSiteInfoTypeObject)) {
        let lowerCaseColumn = column.toLowerCase();
        let operatingSiteInfoColumn = document.getElementById([operatingSiteInfo, column, 'column'].join('-'));
        let operatingSiteInfoColumnIcon = operatingSiteInfoColumn.querySelector('i');

        switch (operatingSiteInfoTypeObject[column]['type']) {
            case 'number':
                let splitedoperatingSiteInfoTypeObjectColumnValue = operatingSiteInfoTypeObject[column]['value'].split('~');

                if (splitedoperatingSiteInfoTypeObjectColumnValue.length == 1 && splitedoperatingSiteInfoTypeObjectColumnValue[0] != '-') {
                    if (data[lowerCaseColumn] >= Number(splitedoperatingSiteInfoTypeObjectColumnValue[0])) {
                        isWarningOfoperatingSiteInfo = true;
                        operatingSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                        operatingSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operatingSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                        operatingSiteInfoColumnIcon.classList.add('text-secondary');
                    }
                } else if (splitedoperatingSiteInfoTypeObjectColumnValue.length == 2) {
                    if ((data[lowerCaseColumn] <= Number(splitedoperatingSiteInfoTypeObjectColumnValue[0])) || (data[lowerCaseColumn] >= Number(splitedoperatingSiteInfoTypeObjectColumnValue[1]))) {
                        isWarningOfoperatingSiteInfo = true;
                        operatingSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                        operatingSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operatingSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                        operatingSiteInfoColumnIcon.classList.add('text-secondary');
                    }
                }

                break;
            case 'boolean':
                if (data[lowerCaseColumn] == 1) {
                    isWarningOfoperatingSiteInfo = true;
                    operatingSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                    operatingSiteInfoColumnIcon.classList.add('text-danger');
                } else {
                    operatingSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                    operatingSiteInfoColumnIcon.classList.add('text-secondary');
                }

                break;
            default:
                console.log('operatingSiteInfoTypeObjectColumn is invalid type');
                break;
        }
    }

    if (isWarningOfoperatingSiteInfo) {
        operatingSiteInfoMonitoringListIcon.classList.remove('text-primary', 'text-secondary');
        operatingSiteInfoMonitoringListIcon.classList.add('text-danger');
    } else {
        operatingSiteInfoMonitoringListIcon.classList.remove('text-primary', 'text-danger');
        operatingSiteInfoMonitoringListIcon.classList.add('text-secondary');
    }

    return isWarningOfoperatingSiteInfo;
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
var opertaionSiteMonitoringListColumn = document.getElementById('operatingSite1MonitoringListColumn');
opertaionSiteMonitoringListColumn.appendChild(getOperatingSiteInfoMonitoringList('operatingSite1', 'bank', [1]));

for (i = 1; i <= 8; i++) {
    opertaionSiteMonitoringListColumn.appendChild(getOperatingSiteInfoMonitoringList('operatingSite1', 'rack', [1, i]));
}

setInterval(async () => {
    let operatingSiteWarningFlagList = [];

    // Bank info draw monitoring list
    let readLatestBankRequestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/latest/`);

    await loadData(readLatestBankRequestUrl)
        .then(data => {
            let operatingSiteWarningFlag = drawMonitoringListAndGetoperatingSiteInfoWarningFlag('operatingSite1', 'bank', [1], data);
            operatingSiteWarningFlagList.push(operatingSiteWarningFlag);
        }).catch(error => {
            console.log(error);
        });

    // Rack info draw monitoring list
    for (let i = 1; i <= 8; i++) {
        var readLatestRackRequestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/racks/${i}/latest/`);

        await loadData(readLatestRackRequestUrl)
            .then(data => {
                let operatingSiteWarningFlag = drawMonitoringListAndGetoperatingSiteInfoWarningFlag('operatingSite1', 'rack', [1, i], data);
                operatingSiteWarningFlagList.push(operatingSiteWarningFlag);
            }).catch(error => {
                console.log(error);
            });
    }

    // Bank draw monitoring list
    var isWarningOfoperatingSite = operatingSiteWarningFlagList.some(element => element);
    var operatingSiteMonitoringListBankIcon = document.getElementById('operatingSite1-bank1-info-monitoring-list').previousElementSibling.querySelector('i');

    if (isWarningOfoperatingSite) {
        operatingSiteMonitoringListBankIcon.classList.remove('text-primary', 'text-secondary');
        operatingSiteMonitoringListBankIcon.classList.add('text-danger');
    } else {
        operatingSiteMonitoringListBankIcon.classList.remove('text-primary', 'text-danger');
        operatingSiteMonitoringListBankIcon.classList.add('text-secondary');
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

        let operatingSiteInfoType = element.dataset.operatingSiteInfoType;
        let operatingSiteId = element.dataset.operatingSiteId;
        let operatingSiteBankId = element.dataset.operatingSiteBankId;
        let operatingSiteInfoColumn = element.dataset.operatingSiteInfoColumn;
        let requestUrl;

        switch (operatingSiteInfoType) {
            case 'bank':
                requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${operatingSiteBankId}/`);

                break;
            case 'rack':
                let operatingSiteRackId = element.dataset.operatingSiteRackId;
                requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${operatingSiteBankId}/racks/${operatingSiteRackId}/`);

                break;
            default:
                break;
        }

        var currentDateTime = DateTime.now();
        var currentDate = currentDateTime.toISODate();

        let monitoringListItemModalTitleEl = document.getElementById('monitoringListItemModalLabel');
        monitoringListItemModalTitleEl.innerHTML = `${operatingSiteInfoColumn} 시간별 모니터링 차트 <span class="material-icons-two-tone">watch_later</span> ${currentDate}`;

        requestUrl.searchParams.append('date', currentDate);
        requestUrl.searchParams.append('fields', `timestamp,${operatingSiteInfoColumn}`);
        requestUrl.searchParams.append('no_page', '');

        console.log(requestUrl);

        fetch(requestUrl).then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        }).then(responseData => {
            console.log(responseData);

            let data = responseData.map(element => {
                let date = new Date(element['timestamp']).getTime();
                let value = element[operatingSiteInfoColumn];

                return { date: date, value: value };
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
    let requestUrl = new URL(window.location.origin + '/api/ess/operating-sites/1/etc/latest/');

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(data => {
        let header = document.querySelector('#operatingSite1MonitoringListColumn > div:nth-child(1) > div.col > h6');
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
let operatingSite1MonitoringLogColumn = document.getElementById('operatingSite1MonitoringLogColumn');
var monitoringLogContainerElement = operatingSite1MonitoringLogColumn.querySelector('div');
var requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
requestUrl.searchParams.append('operating_site', 'operating1_local');
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
    requestUrl.searchParams.append('operating_site', 'operating1_local');
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

// - Download operating data
// Trigger the contents of the modal depending on which button was clicked
var operatingDataDownloadModal = document.getElementById('operatingDataDownloadModal');
operatingDataDownloadModal.addEventListener('show.bs.modal', function (event) {
    let button = event.relatedTarget;
    let operatingSiteId = button.getAttribute('data-operating-site-id');
    let downloadButton = operatingDataDownloadModal.querySelector('.btn-primary');
    downloadButton.setAttribute('data-operating-site-id', operatingSiteId);
});

const operatingDataDownloadModalStartDateTimePickerElement = document.getElementById('operatingDataDownloadModalStartDateTimePicker');
const operatingDataDownloadModalStartDateTimeTempusDominus = new tempusDominus.TempusDominus(operatingDataDownloadModalStartDateTimePickerElement, {
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
const operatingDataDownloadModalEndDateTimeTempusDominus = new tempusDominus.TempusDominus(document.getElementById('operatingDataDownloadModalEndDateTimePicker'), {
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
operatingDataDownloadModalStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    operatingDataDownloadModalEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// Using subscribe method
const operatingDataDownloadModalEndDateTimeTempusDominusSubscription = operatingDataDownloadModalEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    operatingDataDownloadModalStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

// Validate operating data download modal form
const operatingDataDownloadModalFormValidation = new JustValidate('#operatingDataDownloadModalForm', {
    errorFieldCssClass: 'is-invalid',
    tootip: {
        position: 'bottom'
    }
});
operatingDataDownloadModalFormValidation.addField('#operatingDataDownloadModalStartDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: 'yyyy-MM-dd HH:mm:ss'
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).addField('#operatingDataDownloadModalEndDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: 'yyyy-MM-dd HH:mm:ss'
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).addRequiredGroup(
    '#operatingDataDownloadModalDataTypeCheckboxGroup',
    '1가지 이상의 데이터 타입을 선택하세요.'
).onSuccess(event => {
    let checkedBoxElements = document.querySelectorAll('#operatingDataDownloadModalDataTypeCheckboxGroup input:checked');
    checkedBoxElements.forEach(element => {
        let operatingSiteId = document.querySelector('#operatingDataDownloadModalForm button[type=submit]').getAttribute('data-operating-site-id');
        let dataType = element.value;
        let startTime = document.getElementById('operatingDataDownloadModalStartDateTimeInput').value.replace(' ', 'T');
        let endTime = document.getElementById('operatingDataDownloadModalEndDateTimeInput').value.replace(' ', 'T');
        let requestUrl = new URL(window.location.origin + '/api/ess/download/operating-sites/' + operatingSiteId + '/' + dataType + '/');
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
var monitoringLogColumnInput = operatingSite1MonitoringLogColumn.querySelector('input');
new Tagify(monitoringLogColumnInput, {
    originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
});;

/* Event task */
// - Monitoring log level select event
var monitoringLogLoadInterval;
var monitoringLogColumnSelectElement = document.querySelector('#operatingSite1MonitoringLogColumn select');
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
    requestUrl.searchParams.append('operating_site', 'operating1_local');
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
        requestUrl.searchParams.append('operating_site', 'operating1_local');
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

    let logLevel = operatingSite1MonitoringLogColumn.querySelector('select').value;
    let logMessage = event.target.value;
    let requestUrl = new URL(window.location.origin + '/api/ess/search/data-monitoring-logs/');
    requestUrl.searchParams.append('operating_site', 'operating1_local');
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
        requestUrl.searchParams.append('operating_site', 'operating1_local');
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

// Old monitoring log view event
// Trigger the contents of the modal depending on which button was clicked
var monitoringLogViewModal = document.getElementById('monitoringLogViewModal');
monitoringLogViewModal.addEventListener('show.bs.modal', function (event) {
    let button = event.relatedTarget;
    let operatingSiteId = button.getAttribute('data-operating-site-id');
    let searchButton = monitoringLogViewModal.querySelector('.btn-primary');
    searchButton.setAttribute('data-operating-site-id', operatingSiteId);
});

const monitoringLogViewModalStartDateTimePickerElement = document.getElementById('monitoringLogViewModalStartDateTimePicker');
const monitoringLogViewModalStartDateTimeTempusDominus = new tempusDominus.TempusDominus(monitoringLogViewModalStartDateTimePickerElement, {
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
const monitoringLogViewModalEndDateTimeTempusDominus = new tempusDominus.TempusDominus(document.getElementById('monitoringLogViewModalEndDateTimePicker'), {
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
monitoringLogViewModalStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    monitoringLogViewModalEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// Using subscribe method
const monitoringLogViewModalEndDateTimeTempusDominusSubscription = monitoringLogViewModalEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    monitoringLogViewModalStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

// Validate operating data download modal form
const monitoringLogViewModalFormValidation = new JustValidate('#monitoringLogViewModalForm', {
    errorFieldCssClass: 'is-invalid',
    tootip: {
        position: 'bottom'
    }
});
monitoringLogViewModalFormValidation.addField('#monitoringLogViewModalStartDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: 'yyyy-MM-dd HH:mm:ss'
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).addField('#monitoringLogViewModalEndDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: 'yyyy-MM-dd HH:mm:ss'
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).onSuccess(event => {
    let monitoringLogViewModalGrid = document.querySelector('#monitoringLogViewModalGrid');
    let monitoringLogViewModalGridLoading = monitoringLogViewModalGrid.previousElementSibling.firstElementChild;
    let monitoringLogViewModalGridPagination = monitoringLogViewModalGrid.nextElementSibling;
    let monitoringLogViewModalGridPaginationUlElement = monitoringLogViewModalGridPagination.firstElementChild;

    monitoringLogViewModalGrid.innerHTML = '';
    monitoringLogViewModalGrid.classList.add('d-none');
    monitoringLogViewModalGridPagination.classList.add('d-none');
    monitoringLogViewModalGridLoading.classList.remove('d-none');

    let operatingSiteId = document.querySelector('#monitoringLogViewModalForm button').getAttribute('data-operating-site-id');

    let requestUrl = new URL(window.location.origin + '/api/ess-feature/protectionmap/operating-sites/' + operatingSiteId + '/');
    requestUrl.searchParams.append('start-time', document.getElementById('monitoringLogViewModalStartDateTimeInput').value.replace(' ', 'T'));
    requestUrl.searchParams.append('end-time', document.getElementById('monitoringLogViewModalEndDateTimeInput').value.replace(' ', 'T'));

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(data => {
        let columns = Object.keys(data['results'][0]).map(element => {
            return { field: element };
        });

        let rows = data['results'].map(element => {
            let row = {};

            for (const key of Object.keys(element)) {
                if (element[key]['description']) {
                    row[key] = element[key]['description'];

                    continue;
                }

                row[key] = element[key];
            }

            return row;
        });


        // let the grid know which columns and what data to use
        let gridOptions = {
            columnDefs: columns,
            rowData: rows
        };

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid(monitoringLogViewModalGrid, gridOptions);

        monitoringLogViewModalGridLoading.classList.add('d-none');
        monitoringLogViewModalGrid.classList.remove('d-none');

        if (data['previous'] || data['next']) {
            monitoringLogViewModalGridPagination.classList.remove('d-none');
            previousButtonEl = monitoringLogViewModalGridPaginationUlElement.firstElementChild;
            nextButtonEl = monitoringLogViewModalGridPaginationUlElement.lastElementChild;

            if (data['previous']) {
                previousButtonEl.classList.remove('disabled');
                previousButtonEl.firstElementChild.setAttribute('data-link', data['previous']);
            } else {
                previousButtonEl.classList.add('disabled');
            }

            if (data['next']) {
                nextButtonEl.classList.remove('disabled');
                nextButtonEl.firstElementChild.setAttribute('data-link', data['next']);
            } else {
                nextButtonEl.classList.add('disabled');
            }
        }

        // - pagination event
        monitoringLogViewModalGridPaginationUlElement.querySelectorAll('a').forEach(element => {
            element.addEventListener('click', event => {
                monitoringLogViewModalGrid.innerHTML = '';
                monitoringLogViewModalGrid.classList.add('d-none');
                monitoringLogViewModalGridPagination.classList.add('d-none');
                monitoringLogViewModalGridLoading.classList.remove('d-none');

                let requestUrl = new URL(element.getAttribute('data-link'));

                fetch(requestUrl).then(response => {
                    return response.json();
                }).then(data => {
                    let columns = Object.keys(data['results'][0]).map(element => {
                        return { field: element };
                    });

                    let rows = data['results'].map(element => {
                        let row = {};

                        for (const key of Object.keys(element)) {
                            if (element[key]['description']) {
                                row[key] = element[key]['description'];

                                continue;
                            }

                            row[key] = element[key];
                        }

                        return row;
                    });


                    // let the grid know which columns and what data to use
                    let gridOptions = {
                        columnDefs: columns,
                        rowData: rows
                    };

                    // create the grid passing in the div to use together with the columns & data we want to use
                    new agGrid.Grid(monitoringLogViewModalGrid, gridOptions);

                    monitoringLogViewModalGridLoading.classList.add('d-none');
                    monitoringLogViewModalGrid.classList.remove('d-none');

                    if (data['previous'] || data['next']) {
                        monitoringLogViewModalGridPagination.classList.remove('d-none');
                        previousButtonEl = monitoringLogViewModalGridPaginationUlElement.firstElementChild;
                        nextButtonEl = monitoringLogViewModalGridPaginationUlElement.lastElementChild;

                        if (data['previous']) {
                            previousButtonEl.classList.remove('disabled');
                            previousButtonEl.firstElementChild.setAttribute('data-link', data['previous']);
                        } else {
                            previousButtonEl.classList.add('disabled');
                        }

                        if (data['next']) {
                            nextButtonEl.classList.remove('disabled');
                            nextButtonEl.firstElementChild.setAttribute('data-link', data['next']);
                        } else {
                            nextButtonEl.classList.add('disabled');
                        }
                    }
                }).catch(error => {
                    console.log(error);

                    monitoringLogViewModalGridLoading.classList.add('d-none');
                    monitoringLogViewModalGrid.classList.remove('d-none');
                });
            });
        });
    }).catch(error => {
        console.log(error);

        monitoringLogViewModalGridLoading.classList.add('d-none');
        monitoringLogViewModalGrid.classList.remove('d-none');
    });
});

// Primary monitoring
// - Monitoring log
var primaryMonitoringLogEl = document.getElementById('primaryMonitoringLog');
var primaryMonitoringLogLoading = primaryMonitoringLogEl.querySelector('div').firstElementChild;
var primaryMonitoringLogPagination = primaryMonitoringLogEl.querySelector('nav');
var primaryMonitoringLogPaginationUlEl = primaryMonitoringLogPagination.firstElementChild;
var primaryMonitoringLogContainerEl = primaryMonitoringLogPagination.previousElementSibling;

function getPrimaryMonitoringLogAlertContainerEl(data) {
    let primaryMonitoringLogAlertContainerEl = document.createElement('div');
    let primaryMonitoringLogAlertTimeEl = document.createElement('p');
    let primaryMonitoringLogAlertEl = document.createElement('div');

    let alertMessage = '운영 사이트 ' + data['operating_site'] + ' Bank ' + data['bank_id'] + '의 Rack ' + data['rack_id'] + '에서 ' + data['error_code']['description'] + ' 발생';
    let alertLevel;

    switch (data['level']['id']) {
        case 1:
            alertLevel = 'warning';
            break;
        case 2:
            alertLevel = 'danger';
        default:
            break;
    }

    primaryMonitoringLogAlertTimeEl.setAttribute('class', 'm-b-0');
    primaryMonitoringLogAlertTimeEl.innerHTML = '<small>' + DateTime.fromISO(data['timestamp']).toFormat('yyyy-MM-dd HH:mm:ss') + '</small>';
    primaryMonitoringLogAlertEl.setAttribute('class', 'alert alert-' + alertLevel + ' p-l-10 p-t-0 p-b-0');
    primaryMonitoringLogAlertEl.innerHTML = '<p class="m-t-0 m-b-0"><small>' + alertMessage + '</small></p>';

    primaryMonitoringLogAlertContainerEl.appendChild(primaryMonitoringLogAlertTimeEl);
    primaryMonitoringLogAlertContainerEl.appendChild(primaryMonitoringLogAlertEl);

    return primaryMonitoringLogAlertContainerEl;
}

function setUpPaginationButton(data, paginationEl, paginationUlEl) {
    if (data['previous'] || data['next']) {
        paginationEl.classList.remove('d-none');
        previousButtonEl = paginationUlEl.firstElementChild;
        nextButtonEl = paginationUlEl.lastElementChild;

        if (data['previous']) {
            previousButtonEl.classList.remove('disabled');
            previousButtonEl.firstElementChild.setAttribute('data-link', data['previous']);
        } else {
            previousButtonEl.classList.add('disabled');
        }

        if (data['next']) {
            nextButtonEl.classList.remove('disabled');
            nextButtonEl.firstElementChild.setAttribute('data-link', data['next']);
        } else {
            nextButtonEl.classList.add('disabled');
        }
    }
}

var startTime = DateTime.now().toISODate();
var endTime = DateTime.now().plus({ days: 1 }).toISODate();
var requestUrl = new URL(window.location.origin + '/api/ess-feature/protectionmap');
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);

fetch(requestUrl).then(response => {
    return response.json();
}).then(data => {
    data['results'].forEach(element => {
        let primaryMonitoringLogAlertContainerEl = getPrimaryMonitoringLogAlertContainerEl(element);

        primaryMonitoringLogContainerEl.appendChild(primaryMonitoringLogAlertContainerEl);
    });

    primaryMonitoringLogLoading.classList.add('d-none');
    primaryMonitoringLogContainerEl.classList.remove('d-none');

    setUpPaginationButton(data, primaryMonitoringLogPagination, primaryMonitoringLogPaginationUlEl);

    function loadLatestProtectionMapFeature() {
        let time = DateTime.now().minus({ seconds: 2 }).toFormat('yyyy-MM-dd HH:mm:ss').replace(' ', 'T');
        let requestUrl = new URL(window.location.origin + '/api/ess-feature/protectionmap/');
        requestUrl.searchParams.append('time', time);

        fetch(requestUrl).then(response => {
            return response.json();
        }).then(data => {
            data['results'].forEach(element => {
                let primaryMonitoringLogAlertContainerEl = getPrimaryMonitoringLogAlertContainerEl(element);

                if (primaryMonitoringLogContainerEl.firstElementChild) {
                    primaryMonitoringLogContainerEl.firstElementChild.before(primaryMonitoringLogAlertContainerEl);
                } else {
                    primaryMonitoringLogContainerEl.appendChild(primaryMonitoringLogAlertContainerEl);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }

    // Load latest primary monitoring log
    let primaryMonitoringLogInterval = setInterval(loadLatestProtectionMapFeature, 1000);

    // Pagination event
    primaryMonitoringLogPaginationUlEl.querySelectorAll('a').forEach(element => {
        element.addEventListener('click', event => {
            primaryMonitoringLogContainerEl.innerHTML = '';
            primaryMonitoringLogContainerEl.classList.add('d-none');
            primaryMonitoringLogPagination.classList.add('d-none');
            primaryMonitoringLogLoading.classList.remove('d-none');

            let requestUrl = new URL(element.getAttribute('data-link'));

            // Load latest primary monitoring log in only page 1!
            if (primaryMonitoringLogInterval) {
                clearInterval(primaryMonitoringLogInterval);
            }

            if (!requestUrl.searchParams.get('page') || requestUrl.searchParams.get('page') == 1) {
                primaryMonitoringLogInterval = setInterval(loadLatestProtectionMapFeature, 1000);
            }

            fetch(requestUrl).then(response => {
                return response.json();
            }).then(data => {
                data['results'].forEach(element => {
                    let primaryMonitoringLogAlertContainerEl = getPrimaryMonitoringLogAlertContainerEl(element);

                    primaryMonitoringLogContainerEl.appendChild(primaryMonitoringLogAlertContainerEl);
                });

                primaryMonitoringLogLoading.classList.add('d-none');
                primaryMonitoringLogContainerEl.classList.remove('d-none');

                setUpPaginationButton(data, primaryMonitoringLogPagination, primaryMonitoringLogPaginationUlEl);
            }).catch(error => {
                console.log(error);

                primaryMonitoringLogLoading.classList.add('d-none');
                primaryMonitoringLog.classList.remove('d-none');
            });
        });
    });
}).catch(error => {
    console.log(error);
});

// - Monitoring log level type count visualization
function getcreateMonitoringLogLevelTypeCountChartSeriesData(data) {
    let seriesData = data.map(element => {
        let logLevelDescription;

        switch (element['level']) {
            case 1:
                logLevelDescription = '경고(Warning)';
                break;
            case 2:
                logLevelDescription = '보호(Fault)';
                break;
            default:
                break;
        }

        return {
            value: element['level_count'],
            category: logLevelDescription,
        }
    });

    return seriesData;
}

function createMonitoringLogLevelTypeCountChart(chartSeries, chartSeriesData, chartLegend) {
    chartSeries.data.setAll(chartSeriesData);

    chartLegend.data.setAll(chartSeries.dataItems);

    // Play initial series animation
    chartSeries.appear(2000, 500);
}

// Create initial monitoring log level type count chart
var primaryMonitoringLogLevelTypeCountChartRoot = am5.Root.new('primaryMonitoringLogLevelTypeCountChart');
primaryMonitoringLogLevelTypeCountChartRoot.setThemes([am5themes_Animated.new(primaryMonitoringLogLevelTypeCountChartRoot)]);

var primaryMonitoringLogLevelTypeCountChart = primaryMonitoringLogLevelTypeCountChartRoot.container.children.push(am5percent.PieChart.new(primaryMonitoringLogLevelTypeCountChartRoot, {
    layout: primaryMonitoringLogLevelTypeCountChartRoot.verticalLayout,
    innerRadius: am5.percent(50)
}));

var primaryMonitoringLogLevelTypeCountChartSeries = primaryMonitoringLogLevelTypeCountChart.series.push(am5percent.PieSeries.new(primaryMonitoringLogLevelTypeCountChartRoot, {
    valueField: "value",
    categoryField: "category",
    alignLabels: false,
    legendValueText: '{value}'
}));

primaryMonitoringLogLevelTypeCountChartSeries.get("colors").set("colors", [
    am5.color(0xffe3bb),
    am5.color(0xf9caca),
]);

primaryMonitoringLogLevelTypeCountChartSeries.labels.template.setAll({
    textType: "circular",
    inside: false,
    radius: 10
});

var primaryMonitoringLogLevelTypeCountChartLegend = primaryMonitoringLogLevelTypeCountChart.children.push(am5.Legend.new(primaryMonitoringLogLevelTypeCountChartRoot, {
    centerX: am5.percent(50),
    x: am5.percent(50),
    marginTop: 15,
    marginBottom: 15,
}));

var startTime = DateTime.now().toISODate();
var endTime = DateTime.now().plus({ days: 1 }).toISODate();
var requestUrl = new URL(window.location.origin + '/api/ess-feature/protectionmap/operating-sites/1/stats/log-level-count');
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('time-bucket-width', '1days');

fetch(requestUrl).then(response => {
    return response.json();
}).then(data => {
    let seriesData = getcreateMonitoringLogLevelTypeCountChartSeriesData(data);

    createMonitoringLogLevelTypeCountChart(primaryMonitoringLogLevelTypeCountChartSeries, seriesData, primaryMonitoringLogLevelTypeCountChartLegend);
}).catch(error => {
    console.log(error);
});

// Monitoring log level type count select event
var primaryMonitoringLogLevelTypeCountEl = document.getElementById('primaryMonitoringLogLevelTypeCount');
var primaryMonitoringLogLevelTypeCountSelectEl = primaryMonitoringLogLevelTypeCountEl.querySelector('select');
primaryMonitoringLogLevelTypeCountSelectEl.addEventListener('change', event => {
    let operatingSiteId = primaryMonitoringLogLevelTypeCountSelectEl.value;
    let startTime = DateTime.now().toISODate();
    let endTime = DateTime.now().plus({ days: 1 }).toISODate();
    let requestUrl = new URL(window.location.origin + '/api/ess-feature/protectionmap/operating-sites/' + operatingSiteId + '/stats/log-level-count');
    requestUrl.searchParams.append('start-time', startTime);
    requestUrl.searchParams.append('end-time', endTime);
    requestUrl.searchParams.append('time-bucket-width', '1days');

    fetch(requestUrl).then(response => {
        return response.json();
    }).then(data => {
        let seriesData = getcreateMonitoringLogLevelTypeCountChartSeriesData(data);

        createMonitoringLogLevelTypeCountChart(primaryMonitoringLogLevelTypeCountChartSeries, seriesData, primaryMonitoringLogLevelTypeCountChartLegend);
    }).catch(error => {
        console.log(error);
    });
});

