import * as commonUtil from "./common_util.js";

const customTimeDesignatorFullDateTimeFormat = commonUtil.customTimeDesignatorFullDateTimeFormat;

let DateTime = commonUtil.DateTime;
let loadData = commonUtil.loadData;
let getLineChartSeries = commonUtil.getLineChartSeries;

/**
 * Create initial sample charts
 */

let chartOption = {
    // When cards are shuffeld, prevent charts from getting smaller
    'rootAutoResize': false,
}

// Create high SoC Chart
let startTime = '2022-10-12T00:00:00';
let endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

let requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,bank_soc');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('highSoCCard');
    let chartElementId = 'highSoCChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['bank_soc'],
        }
    });

    chartOption['seriesName'] = 'SoC';

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');

    // When class attribute of chart container element(div) has a 'd-none', 'root.autoResize = false' not working 
    // chartElement.parentNode.classList.remove('d-none');
})
.catch(error => console.log(error));

// Create low temperature charge chart
startTime = '2022-03-18T00:00:00';
endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,min_cell_temperature_of_bank');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('lowTemperatureChargeCard');
    let chartElementId = 'lowTemperatureChargeChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['min_cell_temperature_of_bank'],
        }
    });

    chartOption['seriesName'] = i18next.t('temperature');

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');
})
.catch(error => console.log(error));

// Create over discharge chart
startTime = '2022-07-04T00:00:00';
endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/2/`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,min_cell_voltage_of_bank');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('overDischargeCard');
    let chartElementId = 'overDischargeChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['min_cell_voltage_of_bank'],
        }
    });

    chartOption['seriesName'] = i18next.t('voltage');

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');
})
.catch(error => console.log(error));

// Create over voltage chart
startTime = '2022-07-06T00:00:00';
endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,max_cell_voltage_of_bank');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('overVoltageCard');
    let chartElementId = 'overVoltageChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['max_cell_voltage_of_bank'],
        }
    });

    chartOption['seriesName'] = i18next.t('voltage');

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');
})
.catch(error => console.log(error));

// Create voltage unbalancing chart
startTime = '2022-10-12T00:00:00';
endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/racks/2`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,rack_cell_voltage_gap');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('voltageUnbalancingCard');
    let chartElementId = 'voltageUnbalancingChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['rack_cell_voltage_gap'],
        }
    });

    chartOption['seriesName'] = i18next.t('maxMinVoltageGap');

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');
})
.catch(error => console.log(error));

// Create temperature unbalancing chart
startTime = '2022-10-08T00:00:00';
endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/racks/2`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,rack_cell_temperature_gap');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('temperatureUnbalancingCard');
    let chartElementId = 'temperatureUnbalancingChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['rack_cell_temperature_gap'],
        }
    });

    chartOption['seriesName'] = i18next.t('maxMinTemperatureGap');

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');
})
.catch(error => console.log(error));

// Create temperature unbalancing chart
startTime = '2022-07-12T00:00:00';
endTime = DateTime.fromISO(startTime).plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/1/banks/1/racks/2`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('fields', 'timestamp,rack_max_cell_temperature');
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
.then(responseData => {
    let cardElement = document.getElementById('highTemperatureCard');
    let chartElementId = 'highTemperatureChart';
    let chartElement = document.getElementById(chartElementId);
    let loadingElement = cardElement.querySelector('.spinner-border');

    let chartData = responseData.map(element => {
        return {
            time: DateTime.fromISO(element['timestamp']).toMillis(),
            value: element['rack_max_cell_temperature'],
        }
    });

    chartOption['seriesName'] = i18next.t('temperature');

    let chartSeries = getLineChartSeries(chartElementId, chartOption);
    chartSeries.data.setAll(chartData);

    // Setup loading UI
    loadingElement.classList.add('d-none');
    chartElement.previousElementSibling.classList.remove('d-none');
})
.catch(error => console.log(error));