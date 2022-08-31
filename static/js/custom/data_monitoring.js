// Luxon alias 'DateTime'
var DateTime = luxon.DateTime;
const essProtectionMap = JSON.parse(document.getElementById('ess-protection-map').textContent);
const essMonitoringLogLevel = {
    'all': '0',
    'warning': '1',
    'danger': '2',
}
const customFullDateFormat = 'yyyy-MM-dd';
const customTimeFormat = 'HH:mm:ss';
const customFullDateTimeFormat = `yyyy-MM-dd HH:mm:ss`;
const customTimeDesignatorFullDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;

const normalFullMonitoringLogUrl = `${window.location.origin}/api/ess-feature/protectionmap/`;
const testFullMonitoringLogUrl = `${window.location.origin}/api/ess-feature/test/protectionmap/`;

async function loadData(requestUrl) {
    let response = await fetch(requestUrl);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(response.status);
}

function getOperatingSiteBankTitleRow(bankId) {
    let rowElement = document.createElement('div');
    rowElement.setAttribute('class', 'row');

    rowElement.innerHTML = `
        <div class="col-auto p-r-0"><i class="bi bi-circle-fill text-success"></i></div>
        <div class="col">
            <h6>Bank ${bankId}</h6>
        </div>
        <hr>
    `;

    return rowElement;
}

function getOperatingSiteInfoRows(operatingSiteInfoTypeObject) {
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
                <i class="bi bi-circle-fill text-secondary"></i>
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
                <i class="bi bi-circle-fill text-secondary"></i>
            </div>
            <div class="col">
                <p>Rack ${operatingSiteInfoIds[1]} Info</p>
            </div>
            <hr>
        `;
    }

    operatingSiteInfoMonitoringList.setAttribute('id', [operatingSiteInfo, 'monitoring', 'list'].join('-'));

    let operatingSiteInfoTypeObject = essProtectionMap['dataType'][operatingSiteId][operatingSiteInfoType];
    let operatingSiteInfoRows = getOperatingSiteInfoRows(operatingSiteInfoTypeObject);

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
                            <i class="bi bi-circle-fill text-secondary"></i>
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
                            <i class="bi bi-circle-fill text-secondary"></i>
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
                        operatingSiteInfoColumnIcon.classList.remove('text-secondary', 'text-success');
                        operatingSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operatingSiteInfoColumnIcon.classList.remove('text-secondary', 'text-danger');
                        operatingSiteInfoColumnIcon.classList.add('text-success');
                    }
                } else if (splitedoperatingSiteInfoTypeObjectColumnValue.length == 2) {
                    if ((data[lowerCaseColumn] <= Number(splitedoperatingSiteInfoTypeObjectColumnValue[0])) || (data[lowerCaseColumn] >= Number(splitedoperatingSiteInfoTypeObjectColumnValue[1]))) {
                        isWarningOfoperatingSiteInfo = true;
                        operatingSiteInfoColumnIcon.classList.remove('text-secondary', 'text-success');
                        operatingSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operatingSiteInfoColumnIcon.classList.remove('text-secondary', 'text-danger');
                        operatingSiteInfoColumnIcon.classList.add('text-success');
                    }
                }

                break;
            case 'boolean':
                if (data[lowerCaseColumn] == 1) {
                    isWarningOfoperatingSiteInfo = true;
                    operatingSiteInfoColumnIcon.classList.remove('text-secondary', 'text-success');
                    operatingSiteInfoColumnIcon.classList.add('text-danger');
                } else {
                    operatingSiteInfoColumnIcon.classList.remove('text-secondary', 'text-danger');
                    operatingSiteInfoColumnIcon.classList.add('text-success');
                }

                break;
            default:
                console.log('operatingSiteInfoTypeObjectColumn is invalid type');
                break;
        }
    }

    if (isWarningOfoperatingSiteInfo) {
        operatingSiteInfoMonitoringListIcon.classList.remove('text-secondary', 'text-success');
        operatingSiteInfoMonitoringListIcon.classList.add('text-danger');
    } else {
        operatingSiteInfoMonitoringListIcon.classList.remove('text-secondary', 'text-danger');
        operatingSiteInfoMonitoringListIcon.classList.add('text-success');
    }

    return isWarningOfoperatingSiteInfo;
}

/* Alert element functions */

/**
 * Return an alert element of primary monitoring log
 * @param {object} data 
 * @returns element
 */
function getPrimaryMonitoringLogAlertElement(data) {
    let primaryMonitoringLogAlertElement = document.createElement('div');
    let alertMessage = `운영 사이트 ${data['operating_site']} / Bank ${data['bank_id']} / Rack ${data['rack_id']} - ${data['error_code']['description']} 발생`;
    let alertLevel;

    switch (data['level']['id'].toString()) {
        case essMonitoringLogLevel['warning']:
            alertLevel = 'warning';

            break;
        case essMonitoringLogLevel['danger']:
            alertLevel = 'danger';

            break;
        default:
            alertLevel = 'primary';

            break;
    }

    let alert = `
        <p class="m-b-0"><small>${DateTime.fromISO(data['timestamp']).toFormat(customFullDateTimeFormat)}</small></p>
        <div class="alert alert-${alertLevel} p-l-10 p-t-0 p-b-0">
            <p class="m-t-0 m-b-0"><small> ${alertMessage} </small></p>
        </div>
    `;
    primaryMonitoringLogAlertElement.innerHTML = alert;

    return primaryMonitoringLogAlertElement;
}

/**
 * Return an alert element of monitoring log
 * @param {object} data 
 * @returns element
 */
function getMonitoringLogAlertElement(data) {
    let monitoringLogAlertElement = document.createElement('div');
    monitoringLogAlertElement.innerHTML=`
        <p class="text-truncate m-t-0 m-b-0">
            <small>${DateTime.fromISO(data['timestamp']).toFormat(customFullDateTimeFormat)}</small>
        </p>
    `

    let alertElement = document.createElement('div');
    let alertClass;

    switch (data['level']['id']) {
        case 1:
            alertClass = 'alert-warning'

            break;
        case 2:
            alertClass = 'alert-danger'

            break;
        default:
            alertClass = 'alert-primary'

            break;
    }

    alertElement.setAttribute('class', `alert ${alertClass} m-b-5 p-l-10 p-t-0 p-b-0`);
    alertElement.setAttribute('role', 'alert');
    alertElement.setAttribute('title', data['description']);
    alertElement.innerHTML = `
        <p class="text-truncate m-t-0 m-b-0">
            <small>Bank ${data['bank_id']} / Rack ${data['rack_id']}</small>
        </p>
        <p class="text-truncate m-t-0 m-b-0">
            <small>${data['description']}</small>
        </p>
    `;

    monitoringLogAlertElement.appendChild(alertElement);

    return monitoringLogAlertElement;
}

/**
 * Return an alert element with success message
 * @param {string} message 
 * @returns element
 */
function getSuccessAlertElement(message) {
    let alertElement = document.createElement('div');
    alertElement.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show p-l-10" role="alert">
            <p class="m-t-0 m-b-0"><small>${message}</small></p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `

    return alertElement;
}

/* Monitoring log functions */

/**
 * Create monitoring log alerts in HTML element
 * @param {string} elementId 
 * @param {Array} data 
 * @param {Function} getAlertElementFunc
 */
 function createMonitoringLog(elementId, data, getAlertElementFunc) {
    let element = document.getElementById(elementId);

    if (Array.isArray(data) && data.length == 0) {
        let message = `${DateTime.now().toFormat(customFullDateTimeFormat)}<br><strong>금일 정상 운영 중입니다.</strong>`;

        element.appendChild(getSuccessAlertElement(message));
    } else {
        data.forEach(item => {
            element.appendChild(getAlertElementFunc(item));
        });
    }
}

/**
 * Create alert in HTML element
 * @param {string} elementId 
 * @param {string} url 
 * @param {Function} getAlertElementFunc
 */
function loadLatestMonitoringLog(elementId, url, getAlertElementFunc) {
    let element = document.getElementById(elementId);
    let time = DateTime.now().minus({ seconds: 2 }).toFormat(customTimeDesignatorFullDateTimeFormat);
    let requestUrl = new URL(url);
    requestUrl.searchParams.append('time', time);

    loadData(requestUrl)
    .then(responseData => {
        data = responseData['results'];
        data.forEach(item => {
            let alertElement = getAlertElementFunc(item);

            if (element.firstElementChild) {
                element.firstElementChild.before(alertElement);
            } else {
                element.appendChild(alertElement);
            }
        });
    }).catch(error => console.log(error));
}

/* */

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
            valueXField: "time",
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

function setUpPaginationButton(data, paginationEl, paginationUlEl) {
    if (data['previous'] || data['next']) {
        paginationEl.classList.remove('d-none');
        previousButtonElement = paginationUlEl.firstElementChild;
        nextButtonElement = paginationUlEl.lastElementChild;

        if (data['previous']) {
            previousButtonElement.classList.remove('disabled');
            previousButtonElement.firstElementChild.setAttribute('data-link', data['previous']);
        } else {
            previousButtonElement.classList.add('disabled');
        }

        if (data['next']) {
            nextButtonElement.classList.remove('disabled');
            nextButtonElement.firstElementChild.setAttribute('data-link', data['next']);
        } else {
            nextButtonElement.classList.add('disabled');
        }
    }
}

function loadPrimaryMonitoringLogPagination() {
    primaryMonitoringLogPaginationUlElement.querySelectorAll('a').forEach(primaryMonitoringLogPaginationButtonElement => {
        primaryMonitoringLogPaginationButtonElement.addEventListener('click', event => {
            primaryMonitoringLogColumnContainerElement.innerHTML = '';
            primaryMonitoringLogColumnContainerElement.classList.add('d-none');
            primaryMonitoringLogPagination.classList.add('d-none');
            primaryMonitoringLogLoadingElement.classList.remove('d-none');

            let url = primaryMonitoringLogPaginationButtonElement.getAttribute('data-link');
            let requestUrl = new URL(url);

            // Load latest primary monitoring log in only page 1!
            if (primaryMonitoringLogInterval) {
                clearInterval(primaryMonitoringLogInterval);
            }

            if (!requestUrl.searchParams.get('page') || requestUrl.searchParams.get('page') == 1) {
                primaryMonitoringLogInterval = setInterval(loadLatestMonitoringLog(primaryMonitoringLogColumnContainerElement.id, url, getPrimaryMonitoringLogAlertElement), 1000);
            }

            loadData(requestUrl)
            .then(data => {
                data['results'].forEach(element => {
                    let primaryMonitoringLogAlertContainerElement = getPrimaryMonitoringLogAlertElement(element);

                    primaryMonitoringLogColumnContainerElement.appendChild(primaryMonitoringLogAlertContainerElement);
                });

                setUpPaginationButton(data, primaryMonitoringLogPagination, primaryMonitoringLogPaginationUlElement);
            })
            .catch(error => console.log(error))
            .finally(() => {
                primaryMonitoringLogColumnContainerElement.classList.remove('d-none');
                primaryMonitoringLogLoadingElement.classList.add('d-none');
            });
        });
    });
}

/* Handler Functions */

/**
 * Create event hanler of primary monitoring log level type count select change
 * @param {*} event 
 * @param {string} mod - 'normal' or 'test'
 */
async function primaryMonitoringLogLevelTypeCountSelectHandler(event, mod) {
    if (mod !== 'normal' && mod !== 'test') {
        console.log("'mod' parameter value must be 'normal' or 'test'");

        return false;
    }

    primaryMonitoringLogLevelTypeCountElement.querySelectorAll('.alert').forEach(element => {
        primaryMonitoringLogLevelTypeCountElement.removeChild(element.parentNode);
    });

    primaryMonitoringLogLevelTypeCountChartElement.classList.add('d-none');
    primaryMonitoringLogLevelTypeCountLoadingElement.classList.remove('d-none');

    let operatingSiteId = event.target.value;
    let startDate = DateTime.now().toISODate();
    let endDate = DateTime.now().plus({ days: 1 }).toISODate();
    let requestUrl;

    switch(mod) {
        case 'normal':
            requestUrl = new URL(`${window.location.origin}/api/ess-feature/protectionmap/operating-sites/${operatingSiteId}/stats/log-level-count/`);
            break;
        case 'test':
            requestUrl = new URL(`${window.location.origin}/api/ess-feature/test/protectionmap/operating-sites/${operatingSiteId}/stats/log-level-count/`);
            break;
        default:
            break;
    }

    requestUrl.searchParams.append('start-time', startDate);
    requestUrl.searchParams.append('end-time', endDate);
    requestUrl.searchParams.append('time-bucket-width', '1days');

    let data = await loadData(requestUrl);
    if (Array.isArray(data) && data.length == 0) {
        let message = `${DateTime.now().toFormat(customFullDateTimeFormat)} <strong>금일 정상 운영 중입니다.</strong>`
        let alertElement = getSuccessAlertElement(message);

        primaryMonitoringLogLevelTypeCountSelectElement.after(alertElement);
    } else {
        let seriesData = getPrimaryMonitoringLogLevelTypeCountChartSeriesData(data);

        createPrimaryMonitoringLogLevelTypeCountChart(primaryMonitoringLogLevelTypeCountChartSeries, seriesData, primaryMonitoringLogLevelTypeCountChartLegend);
        primaryMonitoringLogLevelTypeCountChartElement.classList.remove('d-none');
    }

    primaryMonitoringLogLevelTypeCountLoadingElement.classList.add('d-none');
}

/**
 * Create event handler of monitoring log column select change
 * @param {*} event 
 * @param {string} url 
 */
async function monitoringLogColumnSelectHandler(event, url) {
    let selectElement = event.target;
    let monitoringLogColumnElement = selectElement.parentElement;
    let monitoringLogColumnId = monitoringLogColumnElement.id;
    let monitoringLogColumnInputElement = monitoringLogColumnElement.querySelector('input');
    let monitoringLogColumnContainerElement = document.getElementById(`${monitoringLogColumnId}LogContainer`);
    let loadingElement = monitoringLogColumnElement.querySelector('.spinner-border');

    monitoringLogColumnContainerElement.innerHTML = '';
    loadingElement.classList.remove('d-none');

    // Clear initial monitoring log load interval
    if (initialMonitoringLogLoadInterval[monitoringLogColumnId]) {
        clearInterval(initialMonitoringLogLoadInterval[monitoringLogColumnId]);
    }

    // Clear previous monitoring log load interval
    if (monitoringLogLoadInterval[monitoringLogColumnId]) {
        clearInterval(monitoringLogLoadInterval[monitoringLogColumnId]);
    }

    let logLevel = selectElement.value;
    let logMessage = monitoringLogColumnInputElement.value;
    let startDate = DateTime.now().toFormat(customFullDateFormat);
    let endDate = DateTime.now().plus({ days: 1 }).toFormat(customFullDateFormat);
    let requestUrl = new URL(url);
    requestUrl.searchParams.append('start-time', startDate);
    requestUrl.searchParams.append('end-time', endDate);

    if (logLevel !== essMonitoringLogLevel['all']) {
        requestUrl.searchParams.append('level', logLevel);
    }

    if (logMessage) {
        requestUrl.searchParams.append('message', logMessage);
    }

    let responseData = await loadData(requestUrl);
    let data = responseData['results'];
    
    createMonitoringLog(`${monitoringLogColumnId}LogContainer`, data, getMonitoringLogAlertElement);
    loadingElement.classList.add('d-none');

    monitoringLogLoadInterval[monitoringLogColumnId] = setInterval(async () => {
        // After wait for save time of monitoring log data, lazy request
        let time = DateTime.now().minus({ seconds: 2 }).toFormat(customTimeDesignatorFullDateTimeFormat);
        let requestUrl = new URL(url);
        requestUrl.searchParams.append('time', time);

        if (logLevel !== essMonitoringLogLevel['all']) {
            requestUrl.searchParams.append('level', logLevel);
        }

        if (logMessage) {
            requestUrl.searchParams.append('message', logMessage);
        }

        let responseData = await loadData(requestUrl);
        let data = responseData['results'];
        data.forEach(element => {
            let alertElement = getMonitoringLogAlertElement(element);

            if (monitoringLogColumnContainerElement.firstElementChild) {
                monitoringLogColumnContainerElement.firstElementChild.before(alertElement);
            } else {
                monitoringLogColumnContainerElement.appendChild(alertElement);
            }
        });
    }, 1000);
}

/**
 * Create event handler of monitoring log column input change
 * @param {*} event 
 * @param {string} url 
 */
async function monitoringLogColumnInputHandler(event, url) {
    let inputElement = event.target;
    let monitoringLogColumnElement = inputElement.parentElement;
    let monitoringLogColumnId = monitoringLogColumnElement.id;
    let monitoringLogColumnSelectElement = monitoringLogColumnElement.querySelector('select');
    let monitoringLogColumnContainerElement = document.getElementById(`${monitoringLogColumnId}LogContainer`);
    let loadingElement = monitoringLogColumnElement.querySelector('.spinner-border');

    monitoringLogColumnContainerElement.innerHTML = '';
    loadingElement.classList.remove('d-none');

    // Clear initial monitoring log load interval
    if (initialMonitoringLogLoadInterval[monitoringLogColumnId]) {
        clearInterval(initialMonitoringLogLoadInterval[monitoringLogColumnId]);
    }

    // Clear previous monitoring log load interval
    if (monitoringLogLoadInterval[monitoringLogColumnId]) {
        clearInterval(monitoringLogLoadInterval[monitoringLogColumnId]);
    }

    let logLevel = monitoringLogColumnSelectElement.value;
    let logMessage = inputElement.value;
    let startDate = DateTime.now().toFormat(customFullDateFormat);
    let endDate = DateTime.now().plus({ days: 1 }).toFormat(customFullDateFormat);
    let requestUrl = new URL(url);
    requestUrl.searchParams.append('start-time', startDate);
    requestUrl.searchParams.append('end-time', endDate);

    if (logLevel !== essMonitoringLogLevel['all']) {
        requestUrl.searchParams.append('level', logLevel);
    }

    if (logMessage) {
        requestUrl.searchParams.append('message', logMessage);
    }

    let responseData = await loadData(requestUrl);
    let data = responseData['results'];

    createMonitoringLog(`${monitoringLogColumnId}LogContainer`, data, getMonitoringLogAlertElement);
    loadingElement.classList.add('d-none');

    monitoringLogLoadInterval[monitoringLogColumnId] = setInterval(async () => {
        // After wait for save time of monitoring log data, lazy request
        let time = DateTime.now().minus({ seconds: 2 }).toFormat(customTimeDesignatorFullDateTimeFormat);
        let requestUrl = new URL(url);
        requestUrl.searchParams.append('time', time);

        if (logLevel !== essMonitoringLogLevel['all']) {
            requestUrl.searchParams.append('level', logLevel);
        }

        if (logMessage) {
            requestUrl.searchParams.append('message', logMessage);
        }

        let responseData = await loadData(requestUrl);
        let data = responseData['results'];
        data.forEach(element => {
            let alertElement = getMonitoringLogAlertElement(element);

            if (monitoringLogColumnContainerElement.firstElementChild) {
                monitoringLogColumnContainerElement.firstElementChild.before(alertElement);
            } else {
                monitoringLogColumnContainerElement.appendChild(alertElement);
            }
        });
    }, 1000);
}

/* Initial task */
// - Create monitoring list
var operatingSiteMonitoringListColumnIds = ['operatingSite1MonitoringListColumn', 'operatingSite2MonitoringListColumn'];
operatingSiteMonitoringListColumnIds.forEach((operatingSiteMonitoringListColumnId, operatingSiteMonitoringListColumnIdIndex) => {
    let operatingSite = operatingSiteMonitoringListColumnId.replace('MonitoringListColumn', '');
    let operatingSiteId = operatingSiteMonitoringListColumnIdIndex + 1;
    let rackCount = essProtectionMap['info']['rackCount'][operatingSite];
    let operatingSiteMonitoringListColumnElement = document.getElementById(operatingSiteMonitoringListColumnId);

    Object.keys(rackCount).forEach((operatingSiteBank, operatingSiteBankIndex) => {
        // Create initial monitoring list(only column)
        let number = operatingSiteBankIndex + 1;
        operatingSiteMonitoringListColumnElement.appendChild(getOperatingSiteBankTitleRow(number));
        operatingSiteMonitoringListColumnElement.appendChild(getOperatingSiteInfoMonitoringList(operatingSite, 'bank', [number]));

        let rackCountOfBank = essProtectionMap['info']['rackCount'][operatingSite][operatingSiteBank];

        for (i = 1; i <= rackCountOfBank; i++) {
            operatingSiteMonitoringListColumnElement.appendChild(getOperatingSiteInfoMonitoringList(operatingSite, 'rack', [number, i]));
        }

        // - Create room sensor of bank header in monitoring list
        setInterval(() => {
            let requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/etc/latest/`);

            fetch(requestUrl).then(response => {
                return response.json();
            }).then(data => {
                let header = document.querySelector(`#${operatingSiteMonitoringListColumnId} > div:nth-child(1) > div.col > h6`);
                let oldSmall = header.querySelector('small');

                if (oldSmall) {
                    header.removeChild(oldSmall);
                }

                let newSmall = document.createElement('small');
                // Degree Celsius HTML Code '&#8451;'
                newSmall.innerHTML = ` <span class="material-icons-two-tone">thermostat</span>${data['sensor1_temperature'] + '&#8451;'} <span class="material-icons-two-tone">water_drop</span> ${data['sensor1_humidity'] + '%'}`;

                header.appendChild(newSmall);
            }).catch(error => {
                console.log(error);
            });
        }, 1000);

        // - Draw monitoring list(icon signal)
        setInterval(async () => {
            let operatingSiteWarningFlagList = [];

            // Bank info draw monitoring list
            let readLatestBankRequestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${number}/latest/`);

            await loadData(readLatestBankRequestUrl)
                .then(data => {
                    let operatingSiteWarningFlag = drawMonitoringListAndGetoperatingSiteInfoWarningFlag(operatingSite, 'bank', [number], data);
                    operatingSiteWarningFlagList.push(operatingSiteWarningFlag);
                }).catch(error => {
                    console.log(error);
                });

            // Rack info draw monitoring list
            for (let i = 1; i <= rackCountOfBank; i++) {
                let readLatestRackRequestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${number}/racks/${i}/latest/`);

                await loadData(readLatestRackRequestUrl)
                    .then(data => {
                        let operatingSiteWarningFlag = drawMonitoringListAndGetoperatingSiteInfoWarningFlag(operatingSite, 'rack', [number, i], data);
                        operatingSiteWarningFlagList.push(operatingSiteWarningFlag);
                    }).catch(error => {
                        console.log(error);
                    });
            }

            // Bank draw monitoring list
            let isWarningOfoperatingSite = operatingSiteWarningFlagList.some(element => element);
            let operatingSiteMonitoringListBankIcon = document.getElementById(`${operatingSite}-bank${number}-info-monitoring-list`).previousElementSibling.querySelector('i');

            if (isWarningOfoperatingSite) {
                operatingSiteMonitoringListBankIcon.classList.remove('text-secondary', 'text-success');
                operatingSiteMonitoringListBankIcon.classList.add('text-danger');
            } else {
                operatingSiteMonitoringListBankIcon.classList.remove('text-secondary', 'text-danger');
                operatingSiteMonitoringListBankIcon.classList.add('text-success');
            }
        }, 1000);
    });
});

// - Create monitoring list item chart
let monitoringListItemChart;
let monitoringListItemModalElement = document.getElementById('monitoringListItemModal');
let monitoringListItemModalFormElement = document.getElementById('monitoringListItemModalForm');

let monitoringListItemModalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-target="#monitoringListItemModal"]'));
monitoringListItemModalTriggerList.forEach(element => {
    element.addEventListener('click', event => {
        let loadingElement = monitoringListItemModalElement.querySelector('.lds-ripple');
        loadingElement.classList.remove('d-none');
        monitoringListItemModalFormElement.classList.add('d-none');

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

        let currentDate = DateTime.now().toISODate();

        let monitoringListItemModalTitleEl = document.getElementById('monitoringListItemModalLabel');
        monitoringListItemModalTitleEl.innerHTML = `${operatingSiteInfoColumn} 시간별 모니터링 차트 <span class="material-icons-two-tone">watch_later</span> ${currentDate}`;

        requestUrl.searchParams.append('date', currentDate);
        requestUrl.searchParams.append('fields', `timestamp,${operatingSiteInfoColumn}`);
        requestUrl.searchParams.append('no_page', '');

        fetch(requestUrl).then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        }).then(responseData => {
            let data = responseData.map(element => {
                let time = new Date(element['timestamp']).getTime();
                let value = element[operatingSiteInfoColumn];

                return { time: time, value: value };
            });

            if (monitoringListItemChart && 'data' in monitoringListItemChart) {
                monitoringListItemChart.data.setAll(data);
            } else {
                monitoringListItemChart = getLineChart('monitoringListItemChart', data);
            }

            loadingElement.classList.add('d-none');
            monitoringListItemModalFormElement.classList.remove('d-none');
        }).catch(error => {
            console.log(error);
        });
    });
});

// - Create monitoring log
let initialMonitoringLogLoadInterval = {};

var monitoringLogColumnIds = ['operatingSite1MonitoringLogColumn', 'operatingSite2MonitoringLogColumn'];
monitoringLogColumnIds.forEach(async (monitoringLogColumnId, index) => {
    let operatingSiteId = index + 1;
    let monitoringLogColumnElement = document.getElementById(monitoringLogColumnId);
    let monitoringLogColumnContainerElementId = `${monitoringLogColumnId}LogContainer`;
    let monitoringLogLoadingElement = monitoringLogColumnElement.querySelector('.spinner-border');
    let requestUrl = new URL(`${window.location.origin}/api/ess-feature/protectionmap/operating-sites/${operatingSiteId}/`);
    requestUrl.searchParams.append('start-time', DateTime.now().toFormat(customFullDateFormat));
    requestUrl.searchParams.append('end-time', DateTime.now().plus({ days: 1 }).toFormat(customFullDateFormat));

    let responseData = await loadData(requestUrl);
    let data = responseData['results'];

    createMonitoringLog(`${monitoringLogColumnId}LogContainer`, data, getMonitoringLogAlertElement);
    monitoringLogLoadingElement.classList.add('d-none');

    initialMonitoringLogLoadInterval[monitoringLogColumnId] = setInterval(async () => {
        // After wait for save time of monitoring log data, lazy request
        let url = `${window.location.origin}/api/ess-feature/protectionmap/operating-sites/${operatingSiteId}/`;

        loadLatestMonitoringLog(monitoringLogColumnContainerElementId, url, getMonitoringLogAlertElement);
    }, 1000);
});

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

/* Event task */
let monitoringLogLoadInterval = {};
let normalMonitoringLogSelectHandlers = {};
let normalMonitoringLogInputHandlers = {};

monitoringLogColumnIds.forEach((monitoringLogColumnId, index) => {
    let operatingSiteId = index + 1;
    let monitoringLogColumnElement = document.getElementById(monitoringLogColumnId);
    let monitoringLogColumnSelectElement = monitoringLogColumnElement.querySelector('select');
    let monitoringLogColumnInputElement = monitoringLogColumnElement.querySelector('input');

    // - Tagging monitoring log message search input
    new Tagify(monitoringLogColumnInputElement, {
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
    });;
    // - Monitoring log select and input event
    let url = `${window.location.origin}/api/ess-feature/protectionmap/operating-sites/${operatingSiteId}/`;
    normalMonitoringLogSelectHandlers[monitoringLogColumnId] = (event) => monitoringLogColumnSelectHandler(event, url);
    normalMonitoringLogSelectHandlers[monitoringLogColumnId] = (event) => monitoringLogColumnInputHandler(event, url);
    monitoringLogColumnSelectElement.addEventListener('change', normalMonitoringLogSelectHandlers[monitoringLogColumnId]);
    monitoringLogColumnInputElement.addEventListener('change', normalMonitoringLogInputHandlers[monitoringLogColumnId]);
});

// Old monitoring log view event
// Trigger the contents of the modal depending on which button was clicked
let testModSwitchElement = document.getElementById('testModSwitch');
let monitoringLogViewModal = document.getElementById('monitoringLogViewModal');
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
            format: customFullDateTimeFormat
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).addField('#monitoringLogViewModalEndDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: customFullDateTimeFormat
        })),
        errorMessage: '날짜를 선택하세요.'
    },
]).onSuccess(event => {
    let monitoringLogViewModalGrid = document.getElementById('monitoringLogViewModalGrid');
    let monitoringLogViewModalGridPagination = monitoringLogViewModalGrid.nextElementSibling;
    let monitoringLogViewModalGridPaginationUlElement = monitoringLogViewModalGridPagination.firstElementChild;
    let loadingElement = monitoringLogViewModal.querySelector('.spinner-border');

    monitoringLogViewModalGrid.innerHTML = '';
    monitoringLogViewModalGrid.classList.add('d-none');
    monitoringLogViewModalGridPagination.classList.add('d-none');
    loadingElement.classList.remove('d-none');

    let operatingSiteId = monitoringLogViewModal.querySelector('.btn-primary').getAttribute('data-operating-site-id');
    let url;

    if (testModSwitchElement.checked) {
        url = `${window.location.origin}/api/ess-feature/test/protectionmap/operating-sites/${operatingSiteId}/`;
    } else {
        url = `${window.location.origin}/api/ess-feature/protectionmap/operating-sites/${operatingSiteId}/`;
    }

    let requestUrl = new URL(url);
    requestUrl.searchParams.append('start-time', DateTime.fromFormat(monitoringLogViewModalStartDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat));
    requestUrl.searchParams.append('end-time', DateTime.fromFormat(monitoringLogViewModalEndDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat));

    loadData(requestUrl)
    .then(responseData => {
        let data = responseData['results'];
        let columns;

        if (Array.isArray(data) && data.length > 0) {
            columns = Object.keys(data[0]).map(element => {
                return { field: element };
            });
        }

        let rows = data.map(element => {
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

        loadingElement.classList.add('d-none');
        monitoringLogViewModalGrid.classList.remove('d-none');

        if (responseData['previous'] || responseData['next']) {
            monitoringLogViewModalGridPagination.classList.remove('d-none');
            previousButtonElement = monitoringLogViewModalGridPaginationUlElement.firstElementChild;
            nextButtonElement = monitoringLogViewModalGridPaginationUlElement.lastElementChild;

            if (responseData['previous']) {
                previousButtonElement.classList.remove('disabled');
                previousButtonElement.firstElementChild.setAttribute('data-link', responseData['previous']);
            } else {
                previousButtonElement.classList.add('disabled');
            }

            if (responseData['next']) {
                nextButtonElement.classList.remove('disabled');
                nextButtonElement.firstElementChild.setAttribute('data-link', responseData['next']);
            } else {
                nextButtonElement.classList.add('disabled');
            }
        }

        // - pagination event
        monitoringLogViewModalGridPaginationUlElement.querySelectorAll('a').forEach(element => {
            element.addEventListener('click', async (event) => {
                monitoringLogViewModalGrid.innerHTML = '';
                monitoringLogViewModalGrid.classList.add('d-none');
                monitoringLogViewModalGridPagination.classList.add('d-none');
                loadingElement.classList.remove('d-none');

                let requestUrl = new URL(element.getAttribute('data-link'));

                let responseData = await loadData(requestUrl);
                let data = responseData['results'];
                let columns = Object.keys(data[0]).map(element => {
                    return { field: element };
                });

                let rows = data.map(element => {
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

                if (responseData['previous'] || responseData['next']) {
                    monitoringLogViewModalGridPagination.classList.remove('d-none');
                    previousButtonElement = monitoringLogViewModalGridPaginationUlElement.firstElementChild;
                    nextButtonElement = monitoringLogViewModalGridPaginationUlElement.lastElementChild;

                    if (responseData['previous']) {
                        previousButtonElement.classList.remove('disabled');
                        previousButtonElement.firstElementChild.setAttribute('data-link', responseData['previous']);
                    } else {
                        previousButtonElement.classList.add('disabled');
                    }

                    if (responseData['next']) {
                        nextButtonElement.classList.remove('disabled');
                        nextButtonElement.firstElementChild.setAttribute('data-link', responseData['next']);
                    } else {
                        nextButtonElement.classList.add('disabled');
                    }
                }

                monitoringLogViewModalGrid.classList.remove('d-none');
                loadingElement.classList.add('d-none');
            });
        });
    })
    .catch(error => console.log(error))
    .finally(() => {
        monitoringLogViewModalGrid.classList.remove('d-none');
        loadingElement.classList.add('d-none');
    });
});

// - Monitoring list item modal search event
let monitoringListItemModal = document.getElementById('monitoringListItemModal');
monitoringListItemModal.addEventListener('show.bs.modal', function (event) {
    let monitoringListItemElement = event.relatedTarget;
    let operatingSiteInfoType = monitoringListItemElement.getAttribute('data-operating-site-info-type');
    let operatingSiteId = monitoringListItemElement.getAttribute('data-operating-site-id');
    let bankId = monitoringListItemElement.getAttribute('data-operating-site-bank-id');
    let dataColumn = monitoringListItemElement.getAttribute('data-operating-site-info-column');

    let searchButton = monitoringListItemModal.querySelector('.btn-primary');
    searchButton.setAttribute('data-operating-site-info-type', operatingSiteInfoType);
    searchButton.setAttribute('data-operating-site-id', operatingSiteId);
    searchButton.setAttribute('data-operating-site-bank-id', bankId);
    searchButton.setAttribute('data-operating-site-info-column', dataColumn);

    if (operatingSiteInfoType == 'rack') {
        let rackId = monitoringListItemElement.getAttribute('data-operating-site-rack-id');

        searchButton.setAttribute('data-operating-site-rack-id', rackId);
    }
});

const monitoringListItemModalStartDateTimePickerElement = document.getElementById('monitoringListItemModalStartDateTimePicker');
const monitoringListItemModalStartDateTimeTempusDominus = new tempusDominus.TempusDominus(monitoringListItemModalStartDateTimePickerElement, {
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
const monitoringListItemModalEndDateTimeTempusDominus = new tempusDominus.TempusDominus(document.getElementById('monitoringListItemModalEndDateTimePicker'), {
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
monitoringListItemModalStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    monitoringListItemModalEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// Using subscribe method
const monitoringListItemModalEndDateTimeTempusDominusSubscription = monitoringListItemModalEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    monitoringListItemModalStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

// Validate operating data download modal form
const monitoringListItemModalFormValidation = new JustValidate('#monitoringListItemModalForm', {
    errorFieldCssClass: 'is-invalid',
    tootip: {
        position: 'bottom'
    }
});
monitoringListItemModalFormValidation.addField('#monitoringListItemModalStartDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: customFullDateTimeFormat
        })),
        errorMessage: '시간을 선택하세요.'
    },
]).addField('#monitoringListItemModalEndDateTimeInput', [
    {
        plugin: JustValidatePluginDate(fields => ({
            required: true,
            format: customFullDateTimeFormat
        })),
        errorMessage: '시간을 선택하세요.'
    },
]).onSuccess(async (event) => {
    monitoringListItemModalFormElement.classList.add('d-none');

    let loadingElement = monitoringListItemModalElement.querySelector('.lds-ripple');
    loadingElement.classList.remove('d-none');

    let monitoringListItemModalSearchDataSet = monitoringListItemModalElement.querySelector('.btn-primary').dataset;
    let operatingSiteInfoType = monitoringListItemModalSearchDataSet.operatingSiteInfoType;
    let operatingSiteId = monitoringListItemModalSearchDataSet.operatingSiteId;
    let bankId = monitoringListItemModalSearchDataSet.operatingSiteBankId;
    let dataColumn = monitoringListItemModalSearchDataSet.operatingSiteInfoColumn;
    let startTime = DateTime.fromFormat(monitoringListItemModalStartDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
    let endTime = DateTime.fromFormat(monitoringListItemModalEndDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
    let requestUrl;

    switch (operatingSiteInfoType) {
        case 'bank':
            requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${bankId}/`);

            break;
        case 'rack':
            let rackId = monitoringListItemModalSearchDataSet.operatingSiteRackId;
            requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);

            break;
        default:
            break;
    }

    requestUrl.searchParams.append('fields', `timestamp,${dataColumn}`);
    requestUrl.searchParams.append('start-time', startTime);
    requestUrl.searchParams.append('end-time', endTime);
    requestUrl.searchParams.append('no_page', '');

    let responseData = await loadData(requestUrl);
    let data = responseData.map(element => {
        let time = DateTime.fromISO(element['timestamp']).toMillis();
        let value = element[dataColumn];

        return {time: time, value: value};
    });

    monitoringListItemChart.data.setAll(data);

    loadingElement.classList.add('d-none');
    monitoringListItemModalFormElement.classList.remove('d-none');
});

// Primary monitoring
// - Monitoring log
let primaryMonitoringLogElement = document.getElementById('primaryMonitoringLog');
let primaryMonitoringLogLoadingElement = primaryMonitoringLogElement.querySelector('.spinner-border');
let primaryMonitoringLogColumnContainerElement = document.getElementById('primaryMonitoringLogContainer');
let primaryMonitoringLogPagination = primaryMonitoringLogElement.querySelector('nav');
let primaryMonitoringLogPaginationUlElement = primaryMonitoringLogPagination.firstElementChild;

let primaryMonitoringLogInterval;

let startTime = DateTime.now().toISODate();
let endTime = DateTime.now().plus({ days: 1 }).toISODate();
requestUrl = new URL(normalFullMonitoringLogUrl);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);

fetch(requestUrl).then(response => {
    if (response.ok) {
        return response.json();
    }

    throw new Error(response.statusText);
}).then(responseData => {
    let data = responseData['results'];
    createMonitoringLog(primaryMonitoringLogColumnContainerElement.id, data, getPrimaryMonitoringLogAlertElement);

    primaryMonitoringLogLoadingElement.classList.add('d-none');
    primaryMonitoringLogColumnContainerElement.classList.remove('d-none');

    setUpPaginationButton(responseData, primaryMonitoringLogPagination, primaryMonitoringLogPaginationUlElement);

    // Load latest primary monitoring log
    primaryMonitoringLogInterval = setInterval(loadLatestMonitoringLog(primaryMonitoringLogColumnContainerElement.id, normalFullMonitoringLogUrl, getPrimaryMonitoringLogAlertElement), 1000);

    // Pagination event
    loadPrimaryMonitoringLogPagination();
}).catch(error => {
    console.log(error);
});

// - Monitoring log level type count visualization
function getPrimaryMonitoringLogLevelTypeCountChartSeriesData(data) {
    let seriesData = data.map(element => {
        let logLevelDescription;

        switch (element['level'].toString()) {
            case essMonitoringLogLevel['warning']:
                logLevelDescription = '경고(Warning)';

                break;
            case essMonitoringLogLevel['danger']:

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

function createPrimaryMonitoringLogLevelTypeCountChart(chartSeries, chartSeriesData, chartLegend) {
    chartSeries.data.setAll(chartSeriesData);

    chartLegend.data.setAll(chartSeries.dataItems);

    // Play initial series animation
    chartSeries.appear(2000, 500);
}

// Create initial monitoring log level type count chart
let primaryMonitoringLogLevelTypeCountElement = document.getElementById('primaryMonitoringLogLevelTypeCount');
let primaryMonitoringLogLevelTypeCountLoadingElement = primaryMonitoringLogLevelTypeCountElement.querySelector('.spinner-border');
let primaryMonitoringLogLevelTypeCountChartElement = document.getElementById('primaryMonitoringLogLevelTypeCountChart');
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

var startDate = DateTime.now().toISODate();
var endDate = DateTime.now().plus({ days: 1 }).toISODate();
var requestUrl = new URL(`${window.location.origin}/api/ess-feature/protectionmap/operating-sites/1/stats/log-level-count/`);
requestUrl.searchParams.append('start-time', startDate);
requestUrl.searchParams.append('end-time', endDate);
requestUrl.searchParams.append('time-bucket-width', '1days');

fetch(requestUrl).then(response => {
    if (response.ok) {
        return response.json();
    }

    throw new Error(response.statusText);
}).then(responseData => {
    if (Array.isArray(responseData) && responseData.length == 0) {
        let message = `${DateTime.now().toFormat(customFullDateTimeFormat)} <strong>금일 정상 운영 중입니다.</strong>`
        let alertElement = getSuccessAlertElement(message);

        primaryMonitoringLogLevelTypeCountElement.appendChild(alertElement);
    } else {
        let seriesData = getPrimaryMonitoringLogLevelTypeCountChartSeriesData(responseData);

        createPrimaryMonitoringLogLevelTypeCountChart(primaryMonitoringLogLevelTypeCountChartSeries, seriesData, primaryMonitoringLogLevelTypeCountChartLegend);
        primaryMonitoringLogLevelTypeCountChartElement.classList.remove('d-none');
    }

    
    primaryMonitoringLogLevelTypeCountLoadingElement.classList.add('d-none');
}).catch(error => {
    console.log(error);
});

let normalPrimaryMonitoringLogLevelTypeCountSelectHandler = (event) => primaryMonitoringLogLevelTypeCountSelectHandler(event, 'normal');
let primaryMonitoringLogLevelTypeCountSelectElement = primaryMonitoringLogLevelTypeCountElement.querySelector('select');
primaryMonitoringLogLevelTypeCountSelectElement.addEventListener('change', normalPrimaryMonitoringLogLevelTypeCountSelectHandler);

// Test mod Event
let testMonitoringLogSelectHandlers = {};
let testMonitoringLogInputHandlers = {};
let testPrimaryMonitoringLogLevelTypeCountSelectHandler = (event) => primaryMonitoringLogLevelTypeCountSelectHandler(event, 'test');

testModSwitchElement.addEventListener('change', event => {
    // Init tasks
    primaryMonitoringLogColumnContainerElement.innerHTML = '';

    primaryMonitoringLogColumnContainerElement.classList.add('d-none');
    primaryMonitoringLogPagination.classList.add('d-none');
    primaryMonitoringLogLoadingElement.classList.remove('d-none');

    primaryMonitoringLogLevelTypeCountChartElement.classList.add('d-none');
    primaryMonitoringLogLevelTypeCountLoadingElement.classList.remove('d-none');

    if (primaryMonitoringLogInterval) {
        clearInterval(primaryMonitoringLogInterval);
    }

    monitoringLogColumnIds.forEach(monitoringLogColumnId => {
        let monitoringLogColumnElement = document.getElementById(monitoringLogColumnId);
        let monitoringLogColumnSelectElement = monitoringLogColumnElement.querySelector('select');
        let monitoringLogColumnInputElement = monitoringLogColumnElement.querySelector('input');
        let monitoringLogColumnContainerElement = document.getElementById(`${monitoringLogColumnId}LogContainer`);
        let loadingElement = monitoringLogColumnElement.querySelector('.spinner-border');

        primaryMonitoringLogLevelTypeCountSelectElement.value = 1;
        monitoringLogColumnSelectElement.value = 0;
        monitoringLogColumnInputElement.value = '';
        monitoringLogColumnContainerElement.innerHTML = '';

        loadingElement.classList.remove('d-none');

        if (initialMonitoringLogLoadInterval[monitoringLogColumnId]) {
            clearInterval(initialMonitoringLogLoadInterval[monitoringLogColumnId]);
        }

        if (monitoringLogLoadInterval[monitoringLogColumnId]) {
            clearInterval(monitoringLogLoadInterval[monitoringLogColumnId]);
        }
    });

    // Test mod switch event
    let switchButton = event.target;
    
    if (switchButton.checked) {
        // Primary monitoring
        let startDate = DateTime.now().toISODate();
        let endDate = DateTime.now().plus({ days: 1 }).toISODate();
        let requestUrl = new URL(testFullMonitoringLogUrl);
        requestUrl.searchParams.append('start-time', startDate);
        requestUrl.searchParams.append('end-time', endDate);

        loadData(requestUrl)
        .then(responseData => {
            let data = responseData['results'];

            createMonitoringLog(primaryMonitoringLogColumnContainerElement.id, data, getPrimaryMonitoringLogAlertElement);

            if (Array.isArray(data) && data.length > 0) {
                setUpPaginationButton(responseData, primaryMonitoringLogPagination, primaryMonitoringLogPaginationUlElement);
            }

            // Load latest primary monitoring log
            primaryMonitoringLogInterval = setInterval(() => {
                loadLatestMonitoringLog(primaryMonitoringLogColumnContainerElement.id, testFullMonitoringLogUrl, getPrimaryMonitoringLogAlertElement);
            }, 1000);

            // Pagination event
            loadPrimaryMonitoringLogPagination();
        })
        .catch(error => console.log(error))
        .finally(() => {
            primaryMonitoringLogColumnContainerElement.classList.remove('d-none');
            primaryMonitoringLogLoadingElement.classList.add('d-none');
        });

        // Monitoring log level type count visualization
        requestUrl = new URL(`${window.location.origin}/api/ess-feature/test/protectionmap/operating-sites/1/stats/log-level-count/`);
        requestUrl.searchParams.append('start-time', startDate);
        requestUrl.searchParams.append('end-time', endDate);
        requestUrl.searchParams.append('time-bucket-width', '1days');

        loadData(requestUrl)
        .then(responseData => {
            if (Array.isArray(responseData) && responseData.length == 0) {
                let message = `${DateTime.now().toFormat(customFullDateTimeFormat)} <strong>금일 정상 운영 중입니다.</strong>`
                let alertElement = getSuccessAlertElement(message);
        
                primaryMonitoringLogLevelTypeCountElement.appendChild(alertElement);
            } else {
                primaryMonitoringLogLevelTypeCountElement.querySelectorAll('.alert').forEach(element => {
                    primaryMonitoringLogLevelTypeCountElement.removeChild(element.parentNode);
                });

                let seriesData = getPrimaryMonitoringLogLevelTypeCountChartSeriesData(responseData);
        
                createPrimaryMonitoringLogLevelTypeCountChart(primaryMonitoringLogLevelTypeCountChartSeries, seriesData, primaryMonitoringLogLevelTypeCountChartLegend);
            }
        })
        .catch(error => console.log(error))
        .finally(() => {
            primaryMonitoringLogLevelTypeCountChartElement.classList.remove('d-none');
            primaryMonitoringLogLevelTypeCountLoadingElement.classList.add('d-none');
        });

        primaryMonitoringLogLevelTypeCountSelectElement.removeEventListener('change', normalPrimaryMonitoringLogLevelTypeCountSelectHandler);
        primaryMonitoringLogLevelTypeCountSelectElement.addEventListener('change', testPrimaryMonitoringLogLevelTypeCountSelectHandler);

        // Monitoring log
        monitoringLogColumnIds.forEach(async (monitoringLogColumnId, index) => {
            let operatingSiteId = index + 1;
            let monitoringLogColumnElement = document.getElementById(monitoringLogColumnId);
            let monitoringLogColumnSelectElement = monitoringLogColumnElement.querySelector('select');
            let monitoringLogColumnInputElement = monitoringLogColumnElement.querySelector('input');
            let monitoringLogColumnContainerElementId = `${monitoringLogColumnId}LogContainer`;
            let loadingElement = monitoringLogColumnElement.querySelector('.spinner-border');

            let startDate = DateTime.now().toFormat(customFullDateFormat).toString();
            let endDate = DateTime.now().plus({ days: 1 }).toFormat(customFullDateFormat).toString();
            let url = `${window.location.origin}/api/ess-feature/test/protectionmap/operating-sites/${operatingSiteId}`;
            let requestUrl = new URL(url);
            requestUrl.searchParams.append('start-time', startDate);
            requestUrl.searchParams.append('end-time', endDate);

            let responseData = await loadData(requestUrl);
            let data = responseData['results'];

            createMonitoringLog(monitoringLogColumnContainerElementId, data, getMonitoringLogAlertElement);
            loadingElement.classList.add('d-none');

            // Set interval of initial monitoring log
            initialMonitoringLogLoadInterval[monitoringLogColumnId] = setInterval(async () => {
                loadLatestMonitoringLog(monitoringLogColumnContainerElementId, url, getMonitoringLogAlertElement);
            }, 1000);

            // Event log search & tag
            testMonitoringLogSelectHandlers[monitoringLogColumnId] = (event) => monitoringLogColumnSelectHandler(event, url);
            testMonitoringLogInputHandlers[monitoringLogColumnId] = (event) => monitoringLogColumnInputHandler(event, url);
            monitoringLogColumnSelectElement.removeEventListener('change', normalMonitoringLogSelectHandlers[monitoringLogColumnId]);
            monitoringLogColumnSelectElement.addEventListener('change', testMonitoringLogSelectHandlers[monitoringLogColumnId]);
            monitoringLogColumnInputElement.removeEventListener('change', normalMonitoringLogInputHandlers[monitoringLogColumnId]);
            monitoringLogColumnInputElement.addEventListener('change', testMonitoringLogInputHandlers[monitoringLogColumnId]);
        });
    } else {
        // primary monitoring
        let startDate = DateTime.now().toISODate();
        let endDate = DateTime.now().plus({ days: 1 }).toISODate();
        let requestUrl = new URL(normalFullMonitoringLogUrl);
        requestUrl.searchParams.append('start-time', startDate);
        requestUrl.searchParams.append('end-time', endDate);

        loadData(requestUrl)
        .then(responseData => {
            let data = responseData['results'];

            createMonitoringLog(primaryMonitoringLogColumnContainerElement.id, data, getPrimaryMonitoringLogAlertElement);

            if (Array.isArray(data) && data.length > 0) {
                setUpPaginationButton(responseData, primaryMonitoringLogPagination, primaryMonitoringLogPaginationUlElement);
            }

            // Load latest primary monitoring log
            primaryMonitoringLogInterval = setInterval(loadLatestMonitoringLog(primaryMonitoringLogColumnContainerElement.id, normalFullMonitoringLogUrl, getPrimaryMonitoringLogAlertElement), 1000);

            // Pagination event
            loadPrimaryMonitoringLogPagination();
        })
        .catch(error => console.log(error))
        .finally(() => {
            primaryMonitoringLogColumnContainerElement.classList.remove('d-none');
            primaryMonitoringLogLoadingElement.classList.add('d-none');
        });

        // Monitoring log level type count visualization
        requestUrl = new URL(`${window.location.origin}/api/ess-feature/protectionmap/operating-sites/1/stats/log-level-count/`);
        requestUrl.searchParams.append('start-time', startDate);
        requestUrl.searchParams.append('end-time', endDate);
        requestUrl.searchParams.append('time-bucket-width', '1days');

        loadData(requestUrl)
        .then(responseData => {
            if (Array.isArray(responseData) && responseData.length == 0) {
                let message = `${DateTime.now().toFormat(customFullDateTimeFormat)} <strong>금일 정상 운영 중입니다.</strong>`
                let alertElement = getSuccessAlertElement(message);
        
                primaryMonitoringLogLevelTypeCountElement.appendChild(alertElement);
            } else {
                primaryMonitoringLogLevelTypeCountElement.querySelectorAll('.alert').forEach(element => {
                    primaryMonitoringLogLevelTypeCountElement.removeChild(element.parentNode);
                });

                let seriesData = getPrimaryMonitoringLogLevelTypeCountChartSeriesData(responseData);
        
                createPrimaryMonitoringLogLevelTypeCountChart(primaryMonitoringLogLevelTypeCountChartSeries, seriesData, primaryMonitoringLogLevelTypeCountChartLegend);
                
                primaryMonitoringLogLevelTypeCountChartElement.classList.remove('d-none');
            }
        })
        .catch(error => console.log(error))
        .finally(() => {
            primaryMonitoringLogLevelTypeCountLoadingElement.classList.add('d-none');
        });

        primaryMonitoringLogLevelTypeCountSelectElement.removeEventListener('change', normalPrimaryMonitoringLogLevelTypeCountSelectHandler);
        primaryMonitoringLogLevelTypeCountSelectElement.addEventListener('change', testPrimaryMonitoringLogLevelTypeCountSelectHandler);

        // Monitoring log
        monitoringLogColumnIds.forEach(async (monitoringLogColumnId, index) => {
            let operatingSiteId = index + 1;
            let monitoringLogColumnElement = document.getElementById(monitoringLogColumnId);
            let monitoringLogColumnSelectElement = monitoringLogColumnElement.querySelector('select');
            let monitoringLogColumnInputElement = monitoringLogColumnElement.querySelector('input');
            let monitoringLogColumnContainerElementId = `${monitoringLogColumnId}LogContainer`;
            let loadingElement = monitoringLogColumnElement.querySelector('.spinner-border');

            let startDate = DateTime.now().toFormat(customFullDateFormat);
            let endDate = DateTime.now().plus({ days: 1 }).toFormat(customFullDateFormat);
            let url = `${window.location.origin}/api/ess-feature/protectionmap/operating-sites/${operatingSiteId}`;
            let requestUrl = new URL(url);
            requestUrl.searchParams.append('start-time', startDate);
            requestUrl.searchParams.append('end-time', endDate);

            let responseData = await loadData(requestUrl);
            let data = responseData['results'];

            createMonitoringLog(monitoringLogColumnContainerElementId, data, getMonitoringLogAlertElement);
            loadingElement.classList.add('d-none');

            initialMonitoringLogLoadInterval[monitoringLogColumnId] = setInterval(async () => {
                loadLatestMonitoringLog(monitoringLogColumnContainerElementId, url, getMonitoringLogAlertElement);
            }, 1000);

            // Event log search & tag
            normalMonitoringLogSelectHandlers[monitoringLogColumnId] = (event) => monitoringLogColumnSelectHandler(event, url);
            normalMonitoringLogInputHandlers[monitoringLogColumnId] = (event) => monitoringLogColumnInputHandler(event, url);
            monitoringLogColumnSelectElement.removeEventListener('change', testMonitoringLogSelectHandlers[monitoringLogColumnId]);
            monitoringLogColumnSelectElement.addEventListener('change', normalMonitoringLogSelectHandlers[monitoringLogColumnId]);
            monitoringLogColumnInputElement.removeEventListener('change', testMonitoringLogInputHandlers[monitoringLogColumnId]);
            monitoringLogColumnInputElement.addEventListener('change', normalMonitoringLogInputHandlers[monitoringLogColumnId]);
        });
    }
});