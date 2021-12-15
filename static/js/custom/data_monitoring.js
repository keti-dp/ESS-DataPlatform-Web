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

    if (operationSiteInfoIds.length == 1) {
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'info'].join('-');
        operationSiteInfoMonitoringList.innerHTML = '<div class="col-auto offset-1 p-r-0"><i class="bi bi-circle-fill text-primary"></i></div>' +
            '<div class="col"><p>Bank ' + operationSiteInfoIds[0] + ' Info</p></div><hr>';
    } else if (operationSiteInfoIds.length == 2) {
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
            column.innerHTML = '<div class="row"><div class="col-auto p-r-0"><i class="bi bi-circle-fill text-primary"></i></div>' +
                '<div class="col text-truncate"><p><small>' + operationSiteInfoColumn + '</small></p></div></div>'

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

// Initial task

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