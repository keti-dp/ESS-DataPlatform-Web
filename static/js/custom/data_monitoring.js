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

// Initial task
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

        // Luxon alias 'DateTime'
        var DateTime = luxon.DateTime;

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