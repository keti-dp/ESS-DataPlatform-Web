export const customFullDateFormat = 'yyyy-MM-dd';
export const customFullDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
export const customTimeDesignatorFullDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;
export const DateTime = luxon.DateTime;

export async function loadData(requestUrl) {
    let response = await fetch(requestUrl);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(response.status);
}

export function getChartRoot(elementId, option = {}) {
    let root = am5.Root.new(elementId);
    let themes = [
        am5themes_Animated.new(root),
        am5themes_Responsive.new(root),
    ];

    let customThemes = option['customThemes'];

    if (Array.isArray(customThemes) && customThemes.length > 0) {
        themes = themes.concat(customThemes.map(element => element.new(root)));
    } else {
        let customTheme = am5.Theme.new(root);
        customTheme.rule('ColorSet').set('colors', [
            // Color naming site: https://www.htmlcsscolor.com/
            // Color palettes site: https://coolors.co/
            am5.color(0x00589b), // cobalt
            am5.color(0x00a0b0), // bondi blue
            am5.color(0xcf5c78), // cabaret
            // am5.color(0xf5df4d), // energy yellow
            // am5.color(0xf0eee9), // romance
            // am5.color(0x939597), // grey chateau
            am5.color(0x887244), // shadow
            am5.color(0xb9f18c), // sulu
            // am5.color(0xffbd00), // amber
            am5.color(0xead5e6), // snuff
        ]);

        themes.push(customTheme);
    }

    root.setThemes(themes);

    if (!option['rootAutoResize']) {
        root.autoResize = false;
    }

    return root;
}

/**
 * Get initial line chart
 * @param {object} chartRoot 
 * @param {object} option 
 * @returns {object}
 */
export function getInitialLineChart(chartRoot, option = {}) {
    let root = chartRoot;
    let chart = root.container.children.push(
        am5xy.XYChart.new(root, Object.assign({
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout,
        }, option))
    );

    chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none",
    }));

    return chart;
}

/**
 * Get line chart series
 * @param {string} elementId 
 * @param {object} option 
 * @returns {object}
 */
 export function getLineChartSeries(elementId, option = {}) {
    let root = getChartRoot(elementId, option);
    let chart = getInitialLineChart(root, option);

    // Create initial axes, series
    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, Object.assign({
            baseInterval: { timeUnit: "second", count: 1 },
            dateFormats: {
                hour: 'HH:mm',
                day: customFullDateFormat,
                week: customFullDateFormat,
                month: 'yyyy-MM',
            },
            renderer: am5xy.AxisRendererX.new(root, {}),
            periodChangeDateFormats: {
                hour: 'yyyy-MM-dd HH:mm',
                day: customFullDateFormat,
                week: customFullDateFormat,
            },
            tooltip: am5.Tooltip.new(root, {
                themeTags: ["axis"],
            }),
            tooltipDateFormat: customFullDateTimeFormat,
        }, option['xAxis']))
    );

    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, Object.assign({
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {})
        }, option['yAxis']))
    );

    let series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
            name: option['seriesName'],
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "time",
            valueYField: "value",
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]{name}[/]\n{valueY.formatNumber('#.000')}"
            }),
        })
    );

    // Customize series
    series.strokes.template.setAll({
        strokeWidth: 3,
    });
    
    return series;
}