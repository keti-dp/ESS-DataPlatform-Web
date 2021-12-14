

const essProtectionMap = JSON.parse(document.getElementById('ess-protection-map').textContent);

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

    var operationSiteInfo = '';

    if (operationSiteInfoIds.length == 1) {
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'info'].join('-');
    } else if (operationSiteInfoIds.length == 2) {
        operationSiteInfo = [operationSiteId, 'bank' + operationSiteInfoIds[0], 'rack' + operationSiteInfoIds[1], 'info'].join('-');
    }

    let isWarningOfOperationSiteInfo = false;
    let operationSiteInfoMonitoringList = document.getElementById([operationSiteInfo, 'monitoring', 'list'].join('-'));
    let operationSiteInfoMonitoringListIcon = operationSiteInfoMonitoringList.querySelector('i');
    let operationSiteInfoTypeObject = essProtectionMap['dataType'][operationSiteId][operationSiteInfoType];

    for (const column of Object.keys(operationSiteInfoTypeObject)) {
        let lowerCaseColumn = column.toLowerCase();
        let operationSiteInfoColumn = document.getElementById([operationSiteInfo, column, 'column'].join('-'));
        var operationSiteInfoColumnIcon = operationSiteInfoColumn.querySelector('i');

        switch (operationSiteInfoTypeObject[column]['type']) {
            case 'number':
                var splitedOperationSiteInfoTypeObjectColumnValue = operationSiteInfoTypeObject[column]['value'].split('~');

                if (splitedOperationSiteInfoTypeObjectColumnValue.length == 1 && splitedOperationSiteInfoTypeObjectColumnValue[0] != '-') {
                    if (data[lowerCaseColumn] >= Number(splitedOperationSiteInfoTypeObjectColumnValue[0])) {
                        isWarningOfOperationSiteInfo = true;
                        console.log('a', column, operationSiteInfoType);
                        operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-secondary');
                        operationSiteInfoColumnIcon.classList.add('text-danger');
                    } else {
                        operationSiteInfoColumnIcon.classList.remove('text-primary', 'text-danger');
                        operationSiteInfoColumnIcon.classList.add('text-secondary');
                    }
                } else if (splitedOperationSiteInfoTypeObjectColumnValue.length == 2) {
                    if ((data[lowerCaseColumn] <= Number(splitedOperationSiteInfoTypeObjectColumnValue[0])) || (data[lowerCaseColumn] >= Number(splitedOperationSiteInfoTypeObjectColumnValue[1]))) {
                        isWarningOfOperationSiteInfo = true;
                        console.log('b', column, operationSiteInfoType);
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
                    console.log('c', column, operationSiteInfoType);
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

var opertaionSiteMonitoringListColumn = document.getElementById('operationSite1-monitoring-list-column');
opertaionSiteMonitoringListColumn.appendChild(getOperationSiteInfoMonitoringList('operationSite1', 'bank', [1]));

for (i = 1; i <= 8; i++) {
    opertaionSiteMonitoringListColumn.appendChild(getOperationSiteInfoMonitoringList('operationSite1', 'rack', [1, i]));
}