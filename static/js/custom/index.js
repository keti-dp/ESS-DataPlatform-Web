const essProtectionMap = JSON.parse(document.getElementById('ess-protection-map').textContent);
const customFullDateFormat = 'yyyy-MM-dd';
const customFullDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
const customTimeDesignatorFullDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;
const zeta = `\u03B6`;
const safeLimitSoSValue = 0.8;
const warningLimitSoSValue = Math.pow(safeLimitSoSValue, 4);

// Luxon alias 'DateTime'
let DateTime = luxon.DateTime;
let currentDateTime = DateTime.now();

let currentUrlPath = window.location.pathname;

if (currentUrlPath.includes('/en/')) {
    // Set the localization of tempus dominus
    tempusDominus.DefaultOptions.localization.locale = 'en';
}

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

function getChartRoot(elementId, option = {}) {
    let root = am5.Root.new(elementId);
    let themes = [
        am5themes_Animated.new(root),
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

    return root;
}

/**
 * Get initial line chart
 * @param {object} chartRoot 
 * @param {object} option 
 * @returns {object}
 */
function getInitialLineChart(chartRoot, option = {}) {
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
function getLineChartSeries(elementId, option = {}) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

    // Create initial axes, series
    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, Object.assign({
            baseInterval: { timeUnit: "hour", count: 1 },
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
            valueXField: "date",
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

/**
 * Get avg SoH chart series
 * @param {string} elementId 
 * @returns {object}
 */
function getAvgSoHChartSeries(elementId) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

    // Create initial axes, series
    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "day", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {}),
            dateFormats: {
                day: customFullDateFormat,
                month: 'yyyy-MM',
            },
            periodChangeDateFormats: {
                month: 'yyyy-MM',
            },
            tooltip: am5.Tooltip.new(root, {
                themeTags: ["axis"],
            }),
            tooltipDateFormat: customFullDateFormat,
        }),
    );

    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            min: 80,
            max: 100,
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {}),
        })
    );

    let series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
            name: `${i18next.t('average')} SoH`,
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "date",
            valueYField: "value",
            minDistance: 20,
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]{name}[/]\n{valueY.formatNumber('#.000')}"
            }),
        })
    );

    // Customize series
    series.strokes.template.setAll({
        strokeWidth: 3,
    });

    return series
}

/**
 * Create forecasting bank SoL chart
 */
async function createForecastingBankSoLChart() {
    let root = getChartRoot('forecastingBankSoLChart');
    let chart = getInitialLineChart(root);

    // Change chart colors
    chart.get('colors').set('colors', [
        am5.color(0x00589b), // cobalt
        am5.color(0x00a0b0), // bondi blue
        am5.color(0x00adbd), // iris blue
        am5.color(0x00adbd), // iris blue
    ]);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: 'day',
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        dateFormats: {
            day: customFullDateFormat,
            month: 'yyyy-MM',
        },
        periodChangeDateFormats: {
            month: 'yyyy-MM',
        },
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: customFullDateFormat
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 30
        })
    }));

    let observedSoLSeries = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: `${i18next.t('observed')} SoL`,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'observedSoL',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
            labelText: '[bold]{name}[/]\n{valueY}',
        })
    }));

    let forecastingSoLSeries = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: `${i18next.t('forecasting')} SoL`,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
            labelText: `[bold]{name}[/]\n${i18next.t('topLimit')} ${i18next.t('forecasting')}: {topLimitValue}\n${i18next.t('forecasting')}: {valueY}\n${i18next.t('bottomLimit')} ${i18next.t('forecasting')}: {bottomLimitValue}`,
        })
    }));

    let forecastingTopLimitSoLSeries = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: `${i18next.t('topLimit')} ${i18next.t('forecasting')} SoL`,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'topLimitValue',
        openValueYField: 'bottomLimitValue',
        valueXField: 'date',
    }));

    let forecastingBottomLimitSoLSeries = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: `${i18next.t('bottomLimit')} ${i18next.t('forecasting')} SoL`,
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

    let requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/2/banks/1/`);

    let avgBankSoHData = await loadData(requestUrl);
    avgBankSoHData.forEach(element => {
        chartData.push({
            date: DateTime.fromISO(element['date']).toMillis(),
            observedSoL: (element['value'] - 80) * 5
        });
    });

    // - Save forecasting SoL
    requestUrl = new URL(`${window.location.origin}/api/ess/stats/forecasting-sol/operating-sites/2/banks/1/`);

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

/**
 * Get main rack SoS chart series list
 * @param {object} elementId 
 * @returns {Array}
 */
function getMainRackSoSChartSeriesList(elementId, option) {
    let root = getChartRoot(elementId);
    let chartOption = {
        paddingRight: 100,
    };
    let chart = getInitialLineChart(root, chartOption);

    // Create axes and series
    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            baseInterval: {
                timeUnit: 'second',
                count: 10,
            },
            dateFormat: {
                minute: 'HH:mm',
                hour: 'HH:mm',
                day: customFullDateFormat,
                week: customFullDateFormat,
                month: 'yyyy-MM',
            },
            periodChangeDateFormats: {
                minute: 'HH:mm',
                hour: 'yyyy-MM-dd HH:mm',
                day: customFullDateFormat,
                week: customFullDateFormat,
            },
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {
                themeTags: ["axis"],
            }),
            tooltipDateFormat: customFullDateTimeFormat,
        })
    );

    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            max: 1,
            min: 0,
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );

    let seriesInfo = option['seriesInfo'];
    let seriesList = seriesInfo.map(element => {
        return chart.series.push(
            am5xy.SmoothedXLineSeries.new(root, {
                name: element['name'],
                xAxis: xAxis,
                yAxis: yAxis,
                valueXField: 'time',
                valueYField: element['value'],
                tooltip: am5.Tooltip.new(root, {
                    labelText: "[bold]{name}[/]\n{valueY.formatNumber('#.000')}",
                }),
            })
        );
    });

    // Customize series
    let firstForecastingModelName = seriesList[1].get('name');

    seriesList.forEach(element => {
        let strokesTemplateOption = {
            strokeWidth: 3
        };

        // 'Observed' series is in front of everything
        if (element.get('name') == 'Observed') {
            element.toFront();
        } else {
            if (element.get('name') != firstForecastingModelName) {
                element.hide();
            }
        }

        element.strokes.template.setAll(strokesTemplateOption);
    });

    // Add axis range
    let safeAxisRange = yAxis.createAxisRange(yAxis.makeDataItem({
        value: safeLimitSoSValue,
        endValue: warningLimitSoSValue,
    }));

    safeAxisRange.get('grid').setAll({
        stroke: am5.color(0xf5df4d),
        strokeDasharray: [3],
        strokeOpacity: 1,
        strokeWidth: 2,
    });

    let safeAxisLabel = safeAxisRange.get('label');
    safeAxisLabel.setAll({
        html: `Warning(${zeta})<br>(${safeLimitSoSValue})`,
        background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0xf5df4d),
        }),
        inside: true,
        dx: 80 // Move label additionally right by 80px
    });

    safeAxisRange.get("label").adapters.add("x", (x, target) => {
        return chart.plotContainer.width();
    });

    safeAxisRange.get('axisFill').setAll({
        fill: am5.color(0xf5df4d),
        fillOpacity: 0.2,
        visible: true,
    });

    let warningAxisRange = yAxis.createAxisRange(yAxis.makeDataItem({
        value: warningLimitSoSValue,
        endValue: 0
    }));

    warningAxisRange.get('grid').setAll({
        stroke: am5.color(0xff0000),
        strokeDasharray: [3],
        strokeOpacity: 1,
        strokeWidth: 2,
    });

    let warningAxisLabel = warningAxisRange.get('label');
    warningAxisLabel.setAll({
        html: `Unsafe(${zeta}<sup>4</sup>)<br>(${Math.pow(safeLimitSoSValue, 4).toFixed(4)})`,
        background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0xff0000),
        }),
        inside: true,
        dx: 80,
    });

    warningAxisRange.get("label").adapters.add("x", (x, target) => {
        return chart.plotContainer.width();
    });

    warningAxisRange.get('axisFill').setAll({
        fill: am5.color(0xff0000),
        fillOpacity: 0.2,
        visible: true,
    });

    let forecastingAxisRange = xAxis.createAxisRange(xAxis.makeDataItem(option['axisRangeInfo']));

    forecastingAxisRange.get('grid').setAll({
        stroke: am5.color(0x999999),
        strokeOpacity: 0.5,
        strokeDasharray: [3],
    });

    forecastingAxisRange.get('axisFill').setAll({
        fill: am5.color(0x999999),
        fillOpacity: 0.2,
        visible: true,
    });

    chart.plotContainer.onPrivate("width", () => {
        safeAxisRange.get("label").markDirtyPosition();
        warningAxisRange.get("label").markDirtyPosition();
    });

    // Set legend
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(root, {
            maxColumns: 2,
            fixedWidthGrid: true
        })
    }));

    // Event legend
    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on("pointerover", function (e) {
        let itemContainer = e.target;

        // As series list is data of a legend, dataContext is series
        let series = itemContainer.dataItem.dataContext;

        chart.series.each(function (chartSeries) {
            if (chartSeries != series) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 0.15,
                    stroke: am5.color(0x000000)
                });
            } else {
                chartSeries.strokes.template.setAll({
                    strokeWidth: 3
                });
            }
        });
    });

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on("pointerout", function (e) {
        chart.series.each(function (chartSeries) {
            chartSeries.strokes.template.setAll({
                strokeOpacity: 1,
                strokeWidth: 3,
                stroke: chartSeries.get("fill")
            });
        });
    })

    legend.data.setAll(chart.series.values);

    return seriesList;
}

/**
 * Get detail rack SoS chart series list
 * @param {object} elementId 
 * @param {object} option 
 * @returns {object}
 */
function getDetailRackSoSChartSeriesList(elementId, option) {
    class CustomTheme extends am5.Theme {
        setupDefaultRules() {
            this.rule('ColorSet').set('colors', [
                am5.color(0x00a0b0), // bondi blue
                am5.color(0xcf5c78), // cabaret
                am5.color(0x939597), // grey chateau
                am5.color(0x887244), // shadow
                am5.color(0xb9f18c), // sulu
                am5.color(0xffbd00), // amber
                am5.color(0xead5e6), // snuff
            ]);
        }
    }

    let chartRootOption = {
        customThemes: [
            CustomTheme,
        ]
    }

    let root = getChartRoot(elementId, chartRootOption);
    let chart = getInitialLineChart(root);

    chart.leftAxesContainer.set("layout", root.verticalLayout);

    // Create axes and series list
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 70 });
    xRenderer.labels.template.setAll({
        multiLocation: 0.5,
        location: 0.5,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingTop: 10
    });

    xRenderer.grid.template.set("location", 0.5);

    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "second", count: 10 },
            dateFormats: {
                minute: 'HH:mm',
                hour: 'HH:mm',
                day: customFullDateFormat,
                week: customFullDateFormat,
                month: 'yyyy-MM',
            },
            periodChangeDateFormats: {
                minute: 'HH:mm',
                hour: 'yyyy-MM-dd HH:mm',
                day: customFullDateFormat,
                week: customFullDateFormat,
            },
            tooltip: am5.Tooltip.new(root, {}),
            renderer: xRenderer
        })
    );

    // xAxis.data.setAll(chartData);

    let seriesInfo = option['seriesInfo'];

    let seriesList = seriesInfo.map(seriesInfoItem => {
        let yAxisDefaultSettings = {
            renderer: am5xy.AxisRendererY.new(root, {}),
            tooltip: am5.Tooltip.new(root, {
                animationDuration: 0,
            }),
            x: am5.p100,
            centerX: am5.p100,
            marginTop: 40 // this makes gap between axes
        }

        let yAxis;

        yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, yAxisDefaultSettings)
        );

        yAxis.axisHeader.children.push(am5.Label.new(root, {
            text: seriesInfoItem['name'].toUpperCase(),
            fontWeight: "500"
        }));

        return chart.series.push(
            am5xy.LineSeries.new(root, {
                name: seriesInfoItem['name'].toUpperCase(),
                xAxis: xAxis,
                yAxis: yAxis,
                valueXField: "time",
                valueYField: seriesInfoItem['value'],
                sequencedInterpolation: true,
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "vertical",
                    labelText: "[bold]{name}: {valueY}"
                })
            })
        );
    });

    // Customize series
    seriesList.forEach(element => {
        element.strokes.template.setAll({
            strokeWidth: 3
        });
    })

    xAxis.set("layer", 50);

    return seriesList;
}

/**
 * Get main EXSoS chart series
 * @param {string} elementId 
 * @param {object} option 
 * @returns {object}
 */
function getMainEXSoSChartSeries(elementId, option) {
    let root = getChartRoot(elementId)
    let chart = getInitialLineChart(root);

    // Create axes
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: "minute",
            count: 10
        },
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
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: customFullDateTimeFormat,
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
    }));

    // Add series
    let series = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'EXSoS',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'time',
        valueYField: 'value',
        tooltip: am5.Tooltip.new(root, {
            labelText: `${i18next.t('integratedSafety')}: {valueY}`
        })
    }));

    // Customize series
    series.strokes.template.setAll({
        strokeWidth: 3,
    });

    // Set data click event
    let bulletTemplate = am5.Template.new(root, {});
    bulletTemplate.events.on('click', event => {
        let dataItem = event.target.dataItem;
        let dataObject = dataItem.dataContext;

        option['dataObject'] = dataObject;

        changeDetailEXSoSChart(option);
        changeDetailEXSoSSafetyChart(option);
    });

    series.bullets.push(function () {
        let circle = am5.Circle.new(root, {
            radius: 7,
            fill: series.get('fill'),
            opacity: 0,
            interactive: true, // required to trigger the state on hover
        }, bulletTemplate);

        circle.states.create('default', {
            opacity: 0
        });

        circle.states.create('hover', {
            opacity: 1
        });

        return am5.Bullet.new(root, {
            sprite: circle
        });
    });

    // Set cursor event
    let cursor = chart.get("cursor");
    cursor.setAll({
        xAxis: xAxis,
        yAxis: yAxis
    });
    cursor.events.on("cursormoved", cursorMoved);

    let previousBulletSprites = [];

    function cursorMoved() {
        previousBulletSprites.forEach(previousBulletSprite => {
            previousBulletSprite.unhover();
        });

        previousBulletSprites = [];

        chart.series.each(function (series) {
            let dataItem = series.get("tooltip").dataItem;

            if (dataItem) {
                let bulletSprite = dataItem.bullets[0].get("sprite");
                bulletSprite.hover();
                previousBulletSprites.push(bulletSprite);
            }
        });
    }

    return series
}

/**
 * Get detail EXSoS chart series list
 * @param {string} elementId 
 * @returns {Array}
 */
function getDetailEXSoSChartSeriesList(elementId) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        max: 1,
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
        extraTooltipPrecision: 1
    }));
    xAxis.children.push(am5.Label.new(root, {
        text: `[bold]${i18next.t('integratedSafety')}`,
        x: am5.p50,
        centerX: am5.p50
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        max: 1,
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
        extraTooltipPrecision: 1
    }));
    yAxis.children.unshift(am5.Label.new(root, {
        rotation: -90,
        text: `[bold]${i18next.t('membership')}`,
        y: am5.p50,
        centerX: am5.p50
    })); // for the left axis, we need it to be the first child, so it's left-most of the other elements (hence unshift()).

    let negligibleSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Negligible',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'valueX',
        valueYField: 'valueY',
    }));

    let marginalSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Marginal',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'valueX',
        valueYField: 'valueY',
    }));

    let neutralSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Neutral',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'valueX',
        valueYField: 'valueY',
    }));

    let criticalSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Critical',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'valueX',
        valueYField: 'valueY',
    }));

    let catastrophicSeries = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Catastrophic',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'valueX',
        valueYField: 'valueY',
    }));

    let seriesList = [catastrophicSeries, criticalSeries, neutralSeries, marginalSeries, negligibleSeries];

    seriesList.forEach(series => {
        series.strokes.template.setAll({
            strokeWidth: 3,
        });
    });

    // Set legend
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(root, {
            fixedWidthGrid: true
        })
    }));
    legend.data.setAll(chart.series.values);

    return seriesList
}

/**
 * Get detail EXSoS safety series list
 * @param {string} elementId 
 * @param {object} option 
 * @returns {Array}
 */
function getDetailExSoSSafetySeriesList(elementId, option) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

    let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
            strictMinMax: true,
            maxDeviation: 0,
            renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
            tooltip: am5.Tooltip.new(root, {}),
            extraTooltipPrecision: 1
        })
    );
    xAxis.children.push(am5.Label.new(root, {
        html: `<strong>${option['xAxisText']}</strong>`,
        x: am5.p50,
        centerX: am5.p50
    }));

    let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            strictMinMax: true,
            maxDeviation: 0,
            renderer: am5xy.AxisRendererY.new(root, {}),
            tooltip: am5.Tooltip.new(root, {}),
            extraTooltipPrecision: 1
        })
    );
    yAxis.children.unshift(am5.Label.new(root, {
        rotation: -90,
        text: `[bold]${i18next.t('membership')}`,
        y: am5.p50,
        centerX: am5.p50
    }));

    let seriesList = option['safetyDegrees'].map(safetyDegree => {
        let name = safetyDegree['name'];
        let valueXField = safetyDegree['valueXY'][0];
        let valueYField = safetyDegree['valueXY'][1];

        return chart.series.push(am5xy.LineSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: valueYField,
            valueXField: valueXField,
        }))
    });

    seriesList.forEach(series => {
        series.strokes.template.setAll({
            strokeWidth: 3,
        });
    });

    // Set legend
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(root, {
            fixedWidthGrid: true
        })
    }));
    legend.data.setAll(chart.series.values);

    return seriesList
}

/**
 * Change detail EXSoS chart
 * @param {object} option 
 */
function changeDetailEXSoSChart(option) {
    let dataObject = option['dataObject'];
    let detailEXSoSChartInfoElement = document.getElementById('detailEXSoSChartInfo');
    detailEXSoSChartInfoElement.innerHTML = `<p>${DateTime.fromMillis(dataObject['time']).toFormat(customFullDateTimeFormat)} [${i18next.t('integratedSafety')}]: ${dataObject['value']}</p>`;

    // Set integrated safety line in detail chart
    let detailEXSoSChartSeriesList = option['detailEXSoSChartSeriesList'];

    let detailEXSoSChartXAxis = detailEXSoSChartSeriesList[0].get('xAxis');
    detailEXSoSChartXAxis.axisRanges.clear();

    let rangeDataItem = detailEXSoSChartXAxis.makeDataItem({
        value: dataObject['value']
    });

    let detailEXSoSChartXAxisRange = detailEXSoSChartXAxis.createAxisRange(rangeDataItem);

    rangeDataItem.get('grid').setAll({
        strokeWidth: 3,
        strokeOpacity: 0.5,
        strokeDasharray: [3]
    });

    let axisLabel = detailEXSoSChartXAxisRange.get('label');
    axisLabel.setAll({
        text: `${i18next.t('integratedSafety')}`,
        background: am5.RoundedRectangle.new(detailEXSoSChartSeriesList[0].root, {
            fill: am5.color(0xf5df4d),
        }),
    });

    axisLabel.toFront();

    // Draw membership degree in detail chart
    let membershipDegree = dataObject['value1'];

    detailEXSoSChartSeriesList.forEach((detailEXSoSChartSeries, index) => {
        detailEXSoSChartSeries.axisRanges.clear();

        let detailEXSoSChartYAxis = detailEXSoSChartSeriesList[index].get('yAxis');
        let seriesRangeDataItem = detailEXSoSChartYAxis.makeDataItem({
            value: membershipDegree[detailEXSoSChartSeries.get('name')],
            endValue: 0
        });

        let seriesRange = detailEXSoSChartSeries.createAxisRange(seriesRangeDataItem);
        seriesRange.fills.template.setAll({
            fill: am5.color(0xff8c00), // dark orange color
            fillOpacity: 0.5,
            visible: true
        });
    });
}

/**
 * Change detail EXSoS chart
 * @param {object} option 
 */
function changeDetailEXSoSSafetyChart(option) {
    let dataObject = option['dataObject'];
    let time = DateTime.fromMillis(dataObject['time']).toFormat(customFullDateTimeFormat);
    let membership_degree_detail = dataObject['membership_degree_detail'];
    let chargeStatus = membership_degree_detail['status'];
    let maxVoltage = membership_degree_detail['max_voltage'];
    let maxTemperature = membership_degree_detail['max_temperature'];;
    let minVoltage = membership_degree_detail['min_voltage'];
    let minTemperature = membership_degree_detail['min_temperature'];
    let voltageGap = membership_degree_detail['voltage_gap'];
    let temperatureGap = membership_degree_detail['temperature_gap'];

    let detailEXSoSSafetyStatusInfoElement = document.getElementById('detailEXSoSSafetyStatusInfo');

    let rangeDataOption = [];

    switch (chargeStatus) {
        case 0:
            detailEXSoSSafetyStatusInfoElement.innerHTML = `<p>${time} [${i18next.t('charge')} ${i18next.t('status')}]: ${maxVoltage}V, ${maxTemperature}&#8451</p>`
            detailExSoSVoltageSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['over_voltage_safety']);
            });

            detailExSoSTemperatureSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['over_temperature_safety']);
            });

            //  Clear rangeDataOption
            rangeDataOption.length = 0;

            // Change rangeDataOption
            rangeDataOption.push({
                rangeDataItemValue: maxVoltage,
                axisLabelText: `${i18next.t('max')} ${i18next.t('voltage')} ${i18next.t('average')}`
            });
            rangeDataOption.push({
                rangeDataItemValue: maxTemperature,
                axisLabelText: `${i18next.t('max')} ${i18next.t('temperature')} ${i18next.t('average')}`
            });

            break;
        case 1:
            detailEXSoSSafetyStatusInfoElement.innerHTML = `<p>${time} [${i18next.t('discharge')} ${i18next.t('status')}]: ${minVoltage}V, ${minTemperature}&#8451</p>`

            detailExSoSVoltageSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['under_voltage_safety']);
            });

            detailExSoSTemperatureSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['under_temperature_safety']);
            });

            //  Clear rangeDataOption
            rangeDataOption.length = 0;

            // Change rangeDataOption
            rangeDataOption.push({
                rangeDataItemValue: minVoltage,
                axisLabelText: `${i18next.t('min')} ${i18next.t('voltage')} ${i18next.t('average')}`
            });
            rangeDataOption.push({
                rangeDataItemValue: minTemperature,
                axisLabelText: `${i18next.t('min')} ${i18next.t('temperature')} ${i18next.t('average')}`
            });

            break;
        case 2:
            detailEXSoSSafetyStatusInfoElement.innerHTML = `<p>${time} [${i18next.t('rest')}]: ${voltageGap}V, ${temperatureGap}&#8451</p>`

            detailExSoSVoltageSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['voltage_imbalance_safety']);
            });

            detailExSoSTemperatureSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['temperature_imbalance_safety']);
            });

            //  Clear rangeDataOption
            rangeDataOption.length = 0;

            // Change rangeDataOption
            rangeDataOption.push({
                rangeDataItemValue: voltageGap,
                axisLabelText: `${i18next.t('voltageGap')} ${i18next.t('average')}`
            });
            rangeDataOption.push({
                rangeDataItemValue: temperatureGap,
                axisLabelText: `${i18next.t('temperatureGap')} ${i18next.t('average')}`
            });

            break;
        default:
            break;
    }

    // Set xAxis range
    [detailExSoSVoltageSafetySeriesList, detailExSoSTemperatureSafetySeriesList].forEach((detailExSoSSafetySeriesList, index) => {
        let detailExSoSSafetyChartXAxis = detailExSoSSafetySeriesList[0].get('xAxis');
        detailExSoSSafetyChartXAxis.axisRanges.clear();

        let rangeDataItem = detailExSoSSafetyChartXAxis.makeDataItem({
            value: rangeDataOption[index]['rangeDataItemValue']
        })

        let detailExSoSSafetyChartXAxisRange = detailExSoSSafetyChartXAxis.createAxisRange(rangeDataItem);

        rangeDataItem.get('grid').setAll({
            strokeWidth: 3,
            strokeOpacity: 0.5,
            strokeDasharray: [3]
        });

        let axisLabel = detailExSoSSafetyChartXAxisRange.get('label');
        axisLabel.setAll({
            text: rangeDataOption[index]['axisLabelText'],
            background: am5.RoundedRectangle.new(detailExSoSSafetySeriesList[0].root, {
                fill: am5.color(0xf5df4d),
            }),
        });

        axisLabel.toFront();
    });
}

/**
 * Get SoCP chart series
 * @param {string} elementId 
 * @param {object} option 
 * @returns {object}
 */
function getSoCPChartSeries(elementId, option) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);
    let chartTitle = option['chartTitle'];

    chart.children.unshift(am5.Label.new(root, {
        text: chartTitle,
        fontSize: 25,
        fontWeight: "500",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0
    }));

    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 100
        }),
        tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.children.push(
        am5.Label.new(root, {
            text: "[bold]배터리 셀 번호",
            x: am5.p50,
            centerX: am5.p50
        })
    );

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
    }));

    yAxis.children.unshift(
        am5.Label.new(root, {
            rotation: -90,
            text: "[bold]빈도수",
            y: am5.p50,
            centerX: am5.p50
        })
    );

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "cellNumber",
        valueYField: "count",
        tooltip: am5.Tooltip.new(root, {
            labelText: "배터리 셀 번호([bold]#{valueX}): {valueY}"
        })
    }));

    series.columns.template.setAll({
        strokeWidth: 5
    });

    return series;
}

/**
 * Create avg chart line
 * @param {object} chartSeries 
 */
function createAvgChartLine(chartSeries, data) {
    let totalValue = 0;

    data.forEach(element => {
        totalValue += element['value'];
    });

    let avgValue = totalValue / data.length;

    let yAxis = chartSeries.get('yAxis');
    let avgAxisRange = yAxis.createAxisRange(yAxis.makeDataItem({
        value: avgValue
    }));

    avgAxisRange.get('grid').setAll({
        stroke: am5.color(0xf5df4d),
        strokeDasharray: [3],
        strokeOpacity: 1,
        strokeWidth: 2,
    });

    let avgAxisLabel = avgAxisRange.get('label');
    avgAxisLabel.setAll({
        text: `${i18next.t('average')} ${avgAxisRange.get('value').toFixed(2)}`,
        background: am5.RoundedRectangle.new(chartSeries.root, {
            fill: am5.color(0xf5df4d),
        }),
    });

    avgAxisLabel.zIndex = 10000;
}

/**
 * Get forecasting max-min rack cell chart series list
 * @param {string} elementId 
 * @param {object} option 
 * @returns {Array}
 */
function getForecastingMaxMinRackCellSeriesList(elementId, option) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root);

    // Create axes
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: "second",
            count: 10
        },
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
        tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
    }));


    let seriesInfo = option['seriesInfo'];

    // Add series
    let seriesList = seriesInfo.map(element => {
        let tooltip;

        if (element['name'] == 'Observed') {
            tooltip = am5.Tooltip.new(root, {
                labelText: `${i18next.t('value')}: {valueY}, ${i18next.t('cellPosition')}: {observedPosition}`,
                pointerOrientation: "horizontal"
            });
        } else {
            tooltip = am5.Tooltip.new(root, {
                labelText: `${i18next.t('value')}: {valueY}`,
                pointerOrientation: "horizontal"
            });
        }

        return chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
            name: element['name'],
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: 'time',
            valueYField: element['value'],
            minDistance: 3,
            tooltip: tooltip
        }));
    });

    let firstForecastingModelName = seriesList[1].get('name');

    seriesList.forEach(element => {
        let strokesTemplateOption = {
            strokeWidth: 3
        };

        // 'Observed' series is in front of everything
        if (element.get('name') == 'Observed') {
            element.toFront();
        } else {
            if (element.get('name') != firstForecastingModelName) {
                element.hide();
            }
        }

        element.strokes.template.setAll(strokesTemplateOption);
    });

    // Set date fields
    root.dateFormatter.setAll({
        dateFormat: 'HH:mm',
        dateFields: ["valueX"]
    });

    // Set axis ranges
    let rangeDataItem = xAxis.makeDataItem(option['axisRangeInfo']);
    let range = xAxis.createAxisRange(rangeDataItem);

    rangeDataItem.get("grid").setAll({
        stroke: am5.color(0x999999), // 'nobel' color
        strokeOpacity: 0.5,
        strokeDasharray: [3]
    });

    rangeDataItem.get("axisFill").setAll({
        fill: am5.color(0x999999),
        fillOpacity: 0.2,
        visible: true
    });

    // Set legend
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(root, {
            maxColumns: 2,
            fixedWidthGrid: true
        })
    }));

    // Event legend
    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on("pointerover", function (e) {
        let itemContainer = e.target;

        // As series list is data of a legend, dataContext is series
        let series = itemContainer.dataItem.dataContext;

        chart.series.each(function (chartSeries) {
            if (chartSeries != series) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 0.15,
                    stroke: am5.color(0x000000)
                });
            } else {
                chartSeries.strokes.template.setAll({
                    strokeWidth: 3
                });
            }
        });
    });

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on("pointerout", function (e) {
        chart.series.each(function (chartSeries) {
            chartSeries.strokes.template.setAll({
                strokeOpacity: 1,
                strokeWidth: 3,
                stroke: chartSeries.get("fill")
            });
        });
    })

    legend.data.setAll(chart.series.values);

    return seriesList;
}

/**
 * Get forecasting max-min rack cell chart data
 * @param {Array} data 
 * @returns {Array}
 */
function getForecastingMaxMinRackCellChartData(data) {
    // Set observed and forecasting data objects
    let dataObject = {};

    data.forEach(element => {
        let timeObject = DateTime.fromISO(element['time']);

        if (dataObject[`${timeObject.toMillis()}`]) {
            dataObject[`${timeObject.toMillis()}`]['observed'] = element['values']['observed'];
        } else {
            dataObject[`${timeObject.toMillis()}`] = {
                observed: element['values']['observed'],
            }
        }

        dataObject[`${timeObject.plus({ minute: 10 }).toMillis()}`] = {
            catboost: element['values']['catboost'],
            linear: element['values']['linear'],
            lightgbm: element['values']['lightgbm'],
            xgboost: element['values']['xgboost'],
        }
    });

    // Set chart data
    let chartData = Object.keys(dataObject).map(element => {
        return {
            time: Number(element),
            ...dataObject[element],
        }
    });

    chartData.sort((a, b) => a['time'] - b['time']);

    return chartData;
}

/**
 * Get forecasting max-min rack cell chart option with prediction error
 * @param {Array} chartData 
 * @param {object} defaultOption 
 * @param {object} forecastingDiffObject 
 * @returns 
 */
async function getForecastingChartOption(chartData, defaultOption, forecastingDiffObject) {
    // - Deep copy
    let forecastingMaxMinRackCellChartOption = JSON.parse(JSON.stringify(defaultOption));

    chartData.forEach(element => {
        // Check all values exist
        if (element['observed'] && Object.keys(element).length > 3) {
            Object.keys(forecastingDiffObject).forEach(forecastingDiffObjectKey => {
                forecastingDiffObject[forecastingDiffObjectKey].push(element[forecastingDiffObjectKey]);
            });
        }
    });

    Object.keys(forecastingDiffObject).forEach((forecastingDiffObjectKey) => {
        if (forecastingDiffObjectKey !== 'observed') {
            const observedValues = tf.tensor(forecastingDiffObject['observed']);
            const predictionValues = tf.tensor(forecastingDiffObject[forecastingDiffObjectKey]);
            const meanAbsoluteError = tf.metrics.meanAbsoluteError(observedValues, predictionValues).dataSync()[0];
            const meanSquaredError = tf.metrics.meanSquaredError(observedValues, predictionValues).dataSync()[0];
            const rootMeanSquaredError = Math.sqrt(meanSquaredError);

            let optionSeriesInfoIndex = defaultOption['seriesInfo'].findIndex(optionSeriesInfoItem => optionSeriesInfoItem['value'] === forecastingDiffObjectKey);
            let name = defaultOption['seriesInfo'][optionSeriesInfoIndex]['name'];
            forecastingMaxMinRackCellChartOption['seriesInfo'][optionSeriesInfoIndex]['name'] = `${name}(MAE: ${meanAbsoluteError.toFixed(4)}, RMSE: ${rootMeanSquaredError.toFixed(4)})`;
        }
    });

    return forecastingMaxMinRackCellChartOption;
}

/**
 * Get multi step forecasting max cell voltage series list
 * @param {string} elementId 
 * @param {object} option 
 * @returns {Array}
 */
function getMultiStepForecastingMaxCellVoltageSeriesList(elementId, option) {
    let root = getChartRoot(elementId);
    let chart = getInitialLineChart(root, option);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: 'minute',
            count: 10
        },
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
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
    }));

    let seriesInfo = option['seriesInfo'];

    let seriesList = seriesInfo.map(element => {
        return chart.series.push(am5xy.LineSeries.new(root, {
            name: element['name'],
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: 'time',
            valueYField: element['value'],
            tooltip: am5.Tooltip.new(root, {
                labelText: `${i18next.t('value')}: {valueY}`,
                pointerOrientation: "horizontal"
            })
        }));
    });

    let firstForecastingModelName = seriesList[1].get('name');

    seriesList.forEach(element => {
        let strokesTemplateOption = {
            strokeWidth: 3
        };

        // 'Observed' series is in front of everything
        if (element.get('name') == 'Observed') {
            element.toFront();
        } else {
            if (element.get('name') != firstForecastingModelName) {
                element.hide();
            }
        }

        element.strokes.template.setAll(strokesTemplateOption);
    });

    // Set date fields
    root.dateFormatter.setAll({
        dateFormat: 'HH:mm',
        dateFields: ["valueX"]
    });

    // Set legend
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(root, {
            maxColumns: 2,
            fixedWidthGrid: true
        })
    }));

    // Event legend
    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on("pointerover", function (e) {
        let itemContainer = e.target;

        // As series list is data of a legend, dataContext is series
        let series = itemContainer.dataItem.dataContext;

        chart.series.each(function (chartSeries) {
            if (chartSeries != series) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 0.15,
                    stroke: am5.color(0x000000)
                });
            } else {
                chartSeries.strokes.template.setAll({
                    strokeWidth: 3
                });
            }
        });
    });

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on("pointerout", function (e) {
        chart.series.each(function (chartSeries) {
            chartSeries.strokes.template.setAll({
                strokeOpacity: 1,
                strokeWidth: 3,
                stroke: chartSeries.get("fill")
            });
        });
    })

    legend.data.setAll(chart.series.values);

    return seriesList;
}

/**
 * Events
 */

// Search visualization card
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
    essBankVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    essBankVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            essBankVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essBankVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essRackVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essRackVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    essRackVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`);
    essRackVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');
    essRackVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            essRackVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        essRackVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackVisualizationSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    essRackVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`)

    let operatingSiteId = essRackVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (let i = 0; i < rackCount; i++) {
            essRackVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essRackVisualizationSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        essRackVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

// - Validation ess bank type modal
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

// -- Using event listeners
essBankVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essBankVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

// -- Using subscribe method
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
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#essBankVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#essBankVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheStartTime', { ns: 'validation' })}`
        },
    ]).addField('#essBankVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheEndTime', { ns: 'validation' })}`
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

        loadData(requestUrl)
            .then(responseData => {
                let chartData = responseData.map(element => {
                    let date = new Date(element.time).getTime();
                    let value = element[visualizationType.replaceAll('-', '_')];

                    return { date: date, value: value };
                });

                visualizationCardElement.querySelector('.card-body p').textContent = `
                ${essBankVisualizationSearchModalFormOperatingSiteSelectElement.options[essBankVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId}
            `;

                let chartSeries;

                switch (visualizationType) {
                    case 'avg-bank-soc':
                        chartSeries = visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString];
                        chartSeries.data.setAll(chartData);

                        break;
                    case 'avg-rack-soc':
                        chartSeries = visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString];
                        chartSeries.data.setAll(chartData);

                        break;
                    case 'avg-bank-power':
                        chartSeries = visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString];
                        chartSeries.data.setAll(chartData);

                        // Remove previous avg chart lines
                        let yAxis = chartSeries.get('yAxis');
                        yAxis.axisRanges.each(value => {
                            yAxis.axisRanges.removeValue(value);
                        });

                        createAvgChartLine(chartSeries, chartData);

                        break;
                    default:
                        break;
                }

                chartSeries.data.setAll(chartData);

                let loadingElement = visualizationCardElement.querySelector('.card-body .spinner-border');
                loadingElement.classList.add('d-none');

                visualizationChartElement.parentNode.classList.remove('d-none');
            })
            .catch(error => console.log(error));
    });

// - Validation ess rack type modal
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


essRackVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essRackVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

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
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackVisualizationSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheStartTime', { ns: 'validation' })}`
        },
    ]).addField('#essRackVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheEndTime', { ns: 'validation' })}`
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
                ${essRackVisualizationSearchModalFormOperatingSiteSelectElement.options[essRackVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId} / Rack ${rackId}
            `;

            let chart = visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString];
            chart.data.setAll(data);

            visualizationCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
            visualizationChartElement.parentNode.classList.remove('d-none');
        }).catch(error => console.log(error));
    });

// Avg bank SoH search modal
let essBankSoHVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essBankSoHVisualizationSearchModalFormStartDateTimePicker');
let essBankSoHVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essBankSoHVisualizationSearchModalFormEndDateTimePicker');
let essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essBankSoHVisualizationSearchModalFormOperatingSiteSelect');
let essBankSoHVisualizationSearchModalFormBankSelectElement = document.getElementById('essBankSoHVisualizationSearchModalFormBankSelect');
essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essBankSoHVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essBankSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    essBankSoHVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
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
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#essBankSoHVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#essBankSoHVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: `${i18next.t('setTheStartDate', { ns: 'validation' })}`
        },
    ]).addField('#essBankSoHVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: `${i18next.t('setTheEndDate', { ns: 'validation' })}`
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
            ${essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.options[essBankSoHVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId}
        `;

        avgBankSoHChartSeries.data.setAll(chartData);

        // Off loading UI
        avgBankSoHCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
        avgBankSoHChartElement.parentNode.classList.remove('d-none');
    });

// Search avg rack SoH card
let essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essRackSoHVisualizationSearchModalFormOperatingSiteSelect');
let essRackSoHVisualizationSearchModalFormBankSelectElement = document.getElementById('essRackSoHVisualizationSearchModalFormBankSelect');
let essRackSoHVisualizationSearchModalFormRackSelectElement = document.getElementById('essRackSoHVisualizationSearchModalFormRackSelect');
let essRackSoHVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essRackSoHVisualizationSearchModalFormStartDateTimePicker');
let essRackSoHVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essRackSoHVisualizationSearchModalFormEndDateTimePicker');

essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essRackSoHVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essRackSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    essRackSoHVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    essRackSoHVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackSoHVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`);
    essRackSoHVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            essRackSoHVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        essRackSoHVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackSoHVisualizationSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    essRackSoHVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackSoHVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`)

    let operatingSiteId = essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (let i = 0; i < rackCount; i++) {
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
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackSoHVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackSoHVisualizationSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackSoHVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: `${i18next.t('setTheStartDate', { ns: 'validation' })}`
        },
    ]).addField('#essRackSoHVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: `${i18next.t('setTheEndDate', { ns: 'validation' })}`
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
            ${essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.options[essRackSoHVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId} / Rack ${rackId}
        `;

        avgRackSoHChartSeries.data.setAll(chartData);

        // Off loading UI
        avgRackSoHCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
        avgRackSoHChartElement.parentNode.classList.remove('d-none');
    });

// Search rack SoS
let essRackSoSVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essRackSoSVisualizationSearchModalFormOperatingSiteSelect');
let essRackSoSVisualizationSearchModalFormBankSelectElement = document.getElementById('essRackSoSVisualizationSearchModalFormBankSelect');
let essRackSoSVisualizationSearchModalFormRackSelectElement = document.getElementById('essRackSoSVisualizationSearchModalFormRackSelect');
let essRackSoSVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essRackSoSVisualizationSearchModalFormStartDateTimePicker');
let essRackSoSVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essRackSoSVisualizationSearchModalFormEndDateTimePicker');

essRackSoSVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    essRackSoSVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essRackSoSVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    essRackSoSVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    essRackSoSVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackSoSVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`);
    essRackSoSVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            essRackSoSVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        essRackSoSVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essRackSoSVisualizationSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    essRackSoSVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essRackSoSVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`)

    let operatingSiteId = essRackSoSVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (let i = 0; i < rackCount; i++) {
            essRackSoSVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essRackSoSVisualizationSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        essRackSoSVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

const essRackSoSVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(essRackSoSVisualizationSearchModalFormStartDateTimePickerElement, {
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

const essRackSoSVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(essRackSoSVisualizationSearchModalFormEndDateTimePickerElement, {
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

essRackSoSVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essRackSoSVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

const essRackSoSVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = essRackSoSVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    essRackSoSVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const essRackSoSVisualizationSearchModalFormValidation = new JustValidate('#essRackSoSVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
essRackSoSVisualizationSearchModalFormValidation
    .addField('#essRackSoSVisualizationSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackSoSVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackSoSVisualizationSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
        }
    ])
    .addField('#essRackSoSVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheStartTime', { ns: 'validation' })}`
        },
    ]).addField('#essRackSoSVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheEndTime', { ns: 'validation' })}`
        },
    ])
    .onSuccess(async (event) => {
        let essRackSoSVisualizationSearchModalElement = document.getElementById('essRackSoSVisualizationSearchModal');
        let rackSoSCardElement = document.getElementById('rackSoSCard');
        let mainRackSoSChartElement = document.getElementById('mainRackSoSChart');
        let loadingElement = rackSoSCardElement.querySelector('.card-body .spinner-border');

        // Off modal
        bootstrap.Modal.getInstance(essRackSoSVisualizationSearchModalElement).hide();

        // Setup loading UI
        mainRackSoSChartElement.parentNode.parentNode.classList.add('d-none');
        loadingElement.classList.remove('d-none');

        let operatingSiteId = essRackSoSVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = essRackSoSVisualizationSearchModalFormBankSelectElement.value;
        let rackId = essRackSoSVisualizationSearchModalFormRackSelectElement.value;
        let startTime = DateTime.fromFormat(essRackSoSVisualizationSearchModalFormStartDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
        let endTime = DateTime.fromFormat(essRackSoSVisualizationSearchModalFormEndDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);

        let requestUrl = new URL(`${window.location.origin}/api/ess/stats/sos/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);

        let responseData = await loadData(requestUrl);

        let mainSoSChartData = [];
        let mainSoSChartDataObject = {};
        let detailSoSChartData = [];

        // Add main & detail SoS data
        responseData.forEach(element => {
            let time = DateTime.fromISO(element['time']).toMillis();
            let detailSoSChartDataItem = {
                time: time,
            };

            detailRackSoSChartOption['seriesInfo'].forEach(seriesInfoItem => {
                detailSoSChartDataItem[seriesInfoItem['value']] = element[seriesInfoItem['name']];
            });

            detailSoSChartData.push(detailSoSChartDataItem);
        });

        let forecastingSoSRequestUrl = new URL(`${window.location.origin}/api/ess/stats/forecasting-rack-sos/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        forecastingSoSRequestUrl.searchParams.append('start-time', startTime);
        forecastingSoSRequestUrl.searchParams.append('end-time', endTime);

        let forecastingSoSResponseData = await loadData(forecastingSoSRequestUrl);
        forecastingSoSResponseData.forEach(element => {
            // Discard by 1 second unit for overlaping the observed values and forecasting values
            let fixedTime = `${element['time'].substring(0, element['time'].length - 1)}0`;

            let values = element['values'];
            let observedTime = DateTime.fromISO(fixedTime).toMillis();
            let forecastingTime = DateTime.fromISO(fixedTime).plus({ minute: 10 }).toMillis();

            if (mainSoSChartDataObject[observedTime]) {
                mainSoSChartDataObject[observedTime]['observed'] = values['observed'];
            } else {
                mainSoSChartDataObject[observedTime] = {
                    observed: values['observed']
                };
            }

            delete values['observed'];

            mainSoSChartDataObject[forecastingTime] = {
                ...values
            };
        });

        Object.keys(mainSoSChartDataObject).forEach(time => {
            mainSoSChartData.push({
                time: Number(time),
                ...mainSoSChartDataObject[time]
            });
        });

        mainSoSChartData.sort((a, b) => {
            return a['time'] - b['time'];
        });

        // Set forecastingDiffObject
        let forecastingDiffObject = {};
        forecastingMainRackSoSDefaultOption['seriesInfo'].forEach(seriesInfoItem => {
            forecastingDiffObject[seriesInfoItem['value']] = [];
        });

        mainSoSChartData.forEach(element => {
            // Check object with all models (Default key: time, observed)
            if (element['observed'] && Object.keys(element).length > 2) {
                Object.keys(forecastingDiffObject).forEach(forecastingDiffObjectKey => {
                    let forecastingDiff = Math.abs(element['observed'] - element[forecastingDiffObjectKey]);

                    element[`${forecastingDiffObjectKey}Diff`] = forecastingDiff;
                });
            }
        });

        let forecastingSoSChartOption = await getForecastingChartOption(mainSoSChartData, forecastingMainRackSoSDefaultOption, forecastingDiffObject);

        let forecastingSoSChartOptionInfoObject = {};
        forecastingSoSChartOption['seriesInfo'].forEach(element => {
            forecastingSoSChartOptionInfoObject[element['value']] = element['name'];
        });

        mainRackSoSChartSeriesList.forEach(series => {
            series.data.setAll(mainSoSChartData);

            // Change legend's name
            let seriesName = series.get('name');
            let modelName;

            if (seriesName.includes('(')) {
                let index = seriesName.indexOf('(');

                modelName = seriesName.substring(0, index).toLowerCase();
            } else {
                modelName = seriesName.toLowerCase();
            }

            series.set('name', forecastingSoSChartOptionInfoObject[modelName]);
        });

        detailRackSoSChartSeriesList.forEach(detailRackSoSChartSeries => {
            detailRackSoSChartSeries.data.setAll(detailSoSChartData);
        });

        rackSoSCardElement.querySelector('.card-body p').textContent = `
            ${essRackSoSVisualizationSearchModalFormOperatingSiteSelectElement.options[essRackSoSVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId} / Rack ${rackId}
        `;

        // Off loading UI
        rackSoSCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
        mainRackSoSChartElement.parentNode.parentNode.classList.remove('d-none');
    });

// Search EXSoS card
let essEXSoSVisualizationSearchModalFormModeSelectElement = document.getElementById('essEXSoSVisualizationSearchModalFormModeSelect');
let essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById('essEXSoSVisualizationSearchModalFormOperatingSiteSelect');
let essEXSoSVisualizationSearchModalFormBankSelectElement = document.getElementById('essEXSoSVisualizationSearchModalFormBankSelect');
let essEXSoSVisualizationSearchModalFormRackSelectElement = document.getElementById('essEXSoSVisualizationSearchModalFormRackSelect');
let essEXSoSVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById('essEXSoSVisualizationSearchModalFormStartDateTimePicker');
let essEXSoSVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById('essEXSoSVisualizationSearchModalFormEndDateTimePicker');

essEXSoSVisualizationSearchModalFormModeSelectElement.addEventListener('change', event => {
    let mode = event.target.value;
    let essEXSoSVisualizationSearchModalFormRackSelectParentElement = essEXSoSVisualizationSearchModalFormRackSelectElement.parentNode;

    switch (mode) {
        case '1':
            essEXSoSVisualizationSearchModalFormRackSelectParentElement.classList.add('d-none');

            essEXSoSVisualizationSearchModalFormValidation
                .removeField('#essEXSoSVisualizationSearchModalFormRackSelect')
            break;
        case '2':
            essEXSoSVisualizationSearchModalFormRackSelectParentElement.classList.remove('d-none');

            essEXSoSVisualizationSearchModalFormValidation
                .addField('#essEXSoSVisualizationSearchModalFormRackSelect', [
                    {
                        rule: 'required',
                        errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
                    }
                ])
            break;
        default:
            console.log(`mode: ${mode}`);
    }
});

essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', event => {
    essEXSoSVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    essEXSoSVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    essEXSoSVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    essEXSoSVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essEXSoSVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`);
    essEXSoSVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            essEXSoSVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        essEXSoSVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

essEXSoSVisualizationSearchModalFormBankSelectElement.addEventListener('change', event => {
    essEXSoSVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    essEXSoSVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`)

    let operatingSiteId = essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (let i = 0; i < rackCount; i++) {
            essEXSoSVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        essEXSoSVisualizationSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        essEXSoSVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

const essEXSoSVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(essEXSoSVisualizationSearchModalFormStartDateTimePickerElement, {
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

const essEXSoSVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(essEXSoSVisualizationSearchModalFormEndDateTimePickerElement, {
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

essEXSoSVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    essEXSoSVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

const essEXSoSVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = essEXSoSVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    essEXSoSVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const essEXSoSVisualizationSearchModalFormValidation = new JustValidate('#essEXSoSVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
essEXSoSVisualizationSearchModalFormValidation
    .addField('#essEXSoSVisualizationSearchModalFormModeSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectAMode', { ns: 'validation' })}`
        }
    ])
    .addField('#essEXSoSVisualizationSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#essEXSoSVisualizationSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#essEXSoSVisualizationSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
        }
    ])
    .addField('#essEXSoSVisualizationSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheStartTime', { ns: 'validation' })}`
        },
    ])
    .addField('#essEXSoSVisualizationSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheEndTime', { ns: 'validation' })}`
        },
    ])
    .onSuccess(async (event) => {
        let cardElement = document.getElementById('exSoSCard');
        let chartElement = document.getElementById('mainEXSoSChart');
        let chartPreviousElementSibling = chartElement.previousElementSibling;
        let loadingElement = cardElement.querySelector('.spinner-border');
        let modalElement = document.getElementById('essEXSoSVisualizationSearchModal');

        // Off modal
        bootstrap.Modal.getInstance(modalElement).hide();

        // On loading UI
        chartElement.parentNode.classList.add('d-none');
        loadingElement.classList.remove('d-none');

        let operatingSiteId = essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = essEXSoSVisualizationSearchModalFormBankSelectElement.value;
        let rackId = essEXSoSVisualizationSearchModalFormRackSelectElement.value;
        let mode = essEXSoSVisualizationSearchModalFormModeSelectElement.value;
        let startTime = DateTime.fromFormat(essEXSoSVisualizationSearchModalFormStartDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
        let endTime = DateTime.fromFormat(essEXSoSVisualizationSearchModalFormEndDateTimeInput.value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);

        let urlString;
        let chartPreviousElementSiblingString;

        switch (mode) {
            case '1':
                urlString = `${window.location.origin}/api/ess/stats/ex-sos/operating-sites/${operatingSiteId}/banks/${bankId}/`;
                chartPreviousElementSiblingString = `${essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.options[essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId}`;
                break;
            case '2':
                urlString = `${window.location.origin}/api/ess/stats/ex-sos/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}`;
                chartPreviousElementSiblingString = `${essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.options[essEXSoSVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId} / Rack ${rackId}`;
                break;
            default:
                console.log(`mode: ${mode}`);
        }

        let requestUrl = new URL(urlString);
        requestUrl.searchParams.append('mode', mode);
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);

        let responseData = await loadData(requestUrl);
        let chartData = responseData.map(element => {
            return {
                time: DateTime.fromISO(element['time']).toMillis(),
                value: element['integrated_safety'],
                value1: element['membership_degree'],
                membership_degree_detail: element['membership_degree_detail'],
            }
        });

        mainEXSoSChartSeries.data.setAll(chartData);

        chartPreviousElementSibling.innerHTML = chartPreviousElementSiblingString;

        // Clear info & data of detail EXSoS chart
        let detailEXSoSChartXAxis = detailEXSoSChartSeriesList[0].get('xAxis');
        detailEXSoSChartXAxis.axisRanges.clear();

        detailEXSoSChartSeriesList.forEach(detailEXSoSChartSeries => {
            detailEXSoSChartSeries.axisRanges.clear();
        });

        let detailEXSoSChartInfoElement = document.getElementById('detailEXSoSChartInfo');
        detailEXSoSChartInfoElement.innerHTML = '';

        [detailExSoSVoltageSafetySeriesList, detailExSoSTemperatureSafetySeriesList].forEach(detailExSoSSafetySeriesList => {
            let detailExSoSSafetyChartXAxis = detailExSoSSafetySeriesList[0].get('xAxis');
            detailExSoSSafetyChartXAxis.axisRanges.clear();
        });

        // Off loading UI
        chartElement.parentNode.classList.remove('d-none');
        loadingElement.classList.add('d-none');
    });

// Search forecasting max-min rack cell modal
let forecastingObjectVisualizationSearchModalElement = document.getElementById('forecastingObjectVisualizationSearchModal');
forecastingObjectVisualizationSearchModalElement.addEventListener('show.bs.modal', event => {
    let button = event.relatedTarget;
    let visualizationType = button.getAttribute('data-visualization-type');
    let searchButton = forecastingObjectVisualizationSearchModalElement.querySelector('.btn-primary');
    searchButton.setAttribute('data-visualization-type', visualizationType);
});

let forecastingObjectVisualizationSearchModalFormOperatingSiteSelectElement = document.getElementById(`forecastingObjectVisualizationSearchModalFormOperatingSiteSelect`);
let forecastingObjectVisualizationSearchModalFormBankSelectElement = document.getElementById(`forecastingObjectVisualizationSearchModalFormBankSelect`);
let forecastingObjectVisualizationSearchModalFormRackSelectElement = document.getElementById(`forecastingObjectVisualizationSearchModalFormRackSelect`);
let forecastingObjectVisualizationSearchModalFormStartDateTimePickerElement = document.getElementById(`forecastingObjectVisualizationSearchModalFormStartDateTimePicker`);
let forecastingObjectVisualizationSearchModalFormEndDateTimePickerElement = document.getElementById(`forecastingObjectVisualizationSearchModalFormEndDateTimePicker`);

forecastingObjectVisualizationSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    forecastingObjectVisualizationSearchModalFormBankSelectElement.innerHTML = '';
    forecastingObjectVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    forecastingObjectVisualizationSearchModalFormBankSelectElement.setAttribute('disabled', '');

    forecastingObjectVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    forecastingObjectVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`);
    forecastingObjectVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            forecastingObjectVisualizationSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        forecastingObjectVisualizationSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

forecastingObjectVisualizationSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    forecastingObjectVisualizationSearchModalFormRackSelectElement.innerHTML = '';
    forecastingObjectVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`)

    let operatingSiteId = forecastingObjectVisualizationSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (let i = 0; i < rackCount; i++) {
            forecastingObjectVisualizationSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        forecastingObjectVisualizationSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        forecastingObjectVisualizationSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

const forecastingObjectVisualizationSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(forecastingObjectVisualizationSearchModalFormStartDateTimePickerElement, {
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

const forecastingObjectVisualizationSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(forecastingObjectVisualizationSearchModalFormEndDateTimePickerElement, {
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

forecastingObjectVisualizationSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    forecastingObjectVisualizationSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

const forecastingObjectVisualizationSearchModalFormEndDateTimeTempusDominusSubscription = forecastingObjectVisualizationSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    forecastingObjectVisualizationSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const forecastingObjectVisualizationSearchModalFormValidation = new JustValidate('#forecastingObjectVisualizationSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
forecastingObjectVisualizationSearchModalFormValidation
    .addField(`#forecastingObjectVisualizationSearchModalFormOperatingSiteSelect`, [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField(`#forecastingObjectVisualizationSearchModalFormBankSelect`, [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField(`#forecastingObjectVisualizationSearchModalFormRackSelect`, [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
        }
    ])
    .addField(`#forecastingObjectVisualizationSearchModalFormStartDateTimeInput`, [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheStartTime', { ns: 'validation' })}`
        },
    ]).addField(`#forecastingObjectVisualizationSearchModalFormEndDateTimeInput`, [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateTimeFormat
            })),
            errorMessage: `${i18next.t('setTheEndTime', { ns: 'validation' })}`
        },
    ])
    .onSuccess(async (event) => {
        let forecastingObjectVisualizationSearchModalElement = document.getElementById('forecastingObjectVisualizationSearchModal');
        let visualizationType = forecastingObjectVisualizationSearchModalElement.querySelector('.btn-primary').getAttribute('data-visualization-type');
        let forecastingObject = window[`${getCamelCaseString(visualizationType)}Object`];

        let forecastingObjectName = forecastingObject['name'];
        let forecastingObjectCardElement = document.getElementById(`${forecastingObjectName}Card`);
        let forecastingObjectChartElement = document.getElementById(`${forecastingObjectName}Chart`);

        // Off modal
        bootstrap.Modal.getInstance(forecastingObjectVisualizationSearchModalElement).hide();

        // Setup loading UI
        forecastingObjectChartElement.parentNode.classList.add('d-none');
        forecastingObjectCardElement.querySelector('.card-body .spinner-border').classList.remove('d-none');

        let operatingSiteId = forecastingObjectVisualizationSearchModalFormOperatingSiteSelectElement.value;
        let bankId = forecastingObjectVisualizationSearchModalFormBankSelectElement.value;
        let rackId = forecastingObjectVisualizationSearchModalFormRackSelectElement.value;
        let fields = `timestamp,${forecastingObject['observedValue']},${forecastingObject['observedPosition']}`
        let startTime = DateTime.fromFormat(window['forecastingObjectVisualizationSearchModalFormStartDateTimeInput'].value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
        let endTime = DateTime.fromFormat(window['forecastingObjectVisualizationSearchModalFormEndDateTimeInput'].value, customFullDateTimeFormat).toFormat(customTimeDesignatorFullDateTimeFormat);

        let requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        requestUrl.searchParams.append('fields', fields);
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);
        requestUrl.searchParams.append('no_page', '');

        let observedResponseData = await loadData(requestUrl);
        let observedResponseDataObject = {};

        observedResponseData.forEach(element => {
            let time = DateTime.fromISO(element['timestamp']).toMillis();

            observedResponseDataObject[`${time}`] = {};
            observedResponseDataObject[`${time}`]['observed'] = element[`${forecastingObject['observedValue']}`];
            observedResponseDataObject[`${time}`]['observedPosition'] = element[`${forecastingObject['observedPosition']}`];
        });

        requestUrl = new URL(`${window.location.origin}/api/ess/stats/${forecastingObject['urlPath']}/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        requestUrl.searchParams.append('start-time', startTime);
        requestUrl.searchParams.append('end-time', endTime);

        let forecastingObjectResponseData = await loadData(requestUrl);

        let chartData = getForecastingMaxMinRackCellChartData(forecastingObjectResponseData);

        forecastingObjectCardElement.querySelector('.card-body p').textContent = `
            ${forecastingObjectVisualizationSearchModalFormOperatingSiteSelectElement.options[forecastingObjectVisualizationSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId} / Rack ${rackId}
        `;

        // Set forecastingDiffObject
        let forecastingDiffObject = {};
        forecastingMaxMinRackCellChartDefaultOption['seriesInfo'].forEach(seriesInfoItem => {
            forecastingDiffObject[seriesInfoItem['value']] = [];
        });

        chartData.forEach(element => {
            let time = element['time'];

            if (observedResponseDataObject[`${time}`]) {
                element['observedPosition'] = observedResponseDataObject[`${time}`]['observedPosition'];
            }

            // Check object with all models (Default key: time, observed, observedPosition)
            if (element['observed'] && Object.keys(element).length > 3) {
                Object.keys(forecastingDiffObject).forEach(forecastingDiffObjectKey => {
                    let forecastingDiff = Math.abs(element['observed'] - element[forecastingDiffObjectKey]);

                    element[`${forecastingDiffObjectKey}Diff`] = forecastingDiff;
                });
            }
        });

        let forecastingMaxMinRackCellChartOption = await getForecastingChartOption(chartData, forecastingMaxMinRackCellChartDefaultOption, forecastingDiffObject);

        window[`${forecastingObjectName}ChartSeriesList`].forEach(chartSeries => {
            chartSeries.data.setAll(chartData);

            // Change legend's name
            forecastingMaxMinRackCellChartDefaultOption['seriesInfo'].forEach(forecastingMaxMinRackCellChartDefaultOptionSeriesInfoItem => {
                if (chartSeries.get('name').includes(forecastingMaxMinRackCellChartDefaultOptionSeriesInfoItem['name'])) {
                    forecastingMaxMinRackCellChartOption['seriesInfo'].forEach(forecastingMaxMinRackCellChartOptionSeriesInfoItem => {
                        if (forecastingMaxMinRackCellChartOptionSeriesInfoItem['name'].includes(forecastingMaxMinRackCellChartDefaultOptionSeriesInfoItem['name'])) {
                            chartSeries.set('name', forecastingMaxMinRackCellChartOptionSeriesInfoItem['name']);
                        }
                    });
                }
            });
        });

        // Off loading UI
        forecastingObjectCardElement.querySelector('.card-body .spinner-border').classList.add('d-none');
        forecastingObjectChartElement.parentNode.classList.remove('d-none');
    });

// Search multi step forecasting modal
let multiStepForecastingSearchModalFormOperatingSiteSelectElement = document.getElementById('multiStepForecastingSearchModalFormOperatingSiteSelect');
let multiStepForecastingSearchModalFormBankSelectElement = document.getElementById('multiStepForecastingSearchModalFormBankSelect');
let multiStepForecastingSearchModalFormRackSelectElement = document.getElementById('multiStepForecastingSearchModalFormRackSelect');
let multiStepForecastingSearchModalFormStartDateTimePickerElement = document.getElementById('multiStepForecastingSearchModalFormStartDateTimePicker');
let multiStepForecastingSearchModalFormEndDateTimePickerElement = document.getElementById('multiStepForecastingSearchModalFormEndDateTimePicker');

multiStepForecastingSearchModalFormOperatingSiteSelectElement.addEventListener('change', (event) => {
    multiStepForecastingSearchModalFormBankSelectElement.innerHTML = '';
    multiStepForecastingSearchModalFormBankSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectABank', { ns: 'validation' })}</option>`);
    multiStepForecastingSearchModalFormBankSelectElement.setAttribute('disabled', '');

    multiStepForecastingSearchModalFormRackSelectElement.innerHTML = '';
    multiStepForecastingSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`);
    multiStepForecastingSearchModalFormRackSelectElement.setAttribute('disabled', '');

    let operatingSiteId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let bankCount = Object.keys(essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]).length;

        for (let i = 0; i < bankCount; i++) {
            multiStepForecastingSearchModalFormBankSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }

        multiStepForecastingSearchModalFormBankSelectElement.removeAttribute('disabled');
    }
});

multiStepForecastingSearchModalFormBankSelectElement.addEventListener('change', (event) => {
    multiStepForecastingSearchModalFormRackSelectElement.innerHTML = '';
    multiStepForecastingSearchModalFormRackSelectElement.insertAdjacentHTML('afterbegin', `<option value="" selected disabled>${i18next.t('selectARack', { ns: 'validation' })}</option>`)

    let operatingSiteId = multiStepForecastingSearchModalFormOperatingSiteSelectElement.value;
    let bankId = event.target.value;
    let essProtectionMapInfoRackCountObject = essProtectionMap['info']['rackCount'];

    if (essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`]) {
        let rackCount = essProtectionMapInfoRackCountObject[`operatingSite${operatingSiteId}`][`bank${bankId}`];

        for (let i = 0; i < rackCount; i++) {
            multiStepForecastingSearchModalFormRackSelectElement.insertAdjacentHTML('beforeend', `<option value="${i + 1}">${i + 1}</option>`)
        }
        multiStepForecastingSearchModalFormRackSelectElement.removeAttribute('disabled');
    } else {
        multiStepForecastingSearchModalFormRackSelectElement.setAttribute('disabled', '');
    }
});

const multiStepForecastingSearchModalFormStartDateTimeTempusDominus = new tempusDominus.TempusDominus(multiStepForecastingSearchModalFormStartDateTimePickerElement, {
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

const multiStepForecastingSearchModalFormEndDateTimeTempusDominus = new tempusDominus.TempusDominus(multiStepForecastingSearchModalFormEndDateTimePickerElement, {
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
    },
    useCurrent: false
});

multiStepForecastingSearchModalFormStartDateTimePickerElement.addEventListener(tempusDominus.Namespace.events.change, (e) => {
    multiStepForecastingSearchModalFormEndDateTimeTempusDominus.updateOptions({
        restrictions: {
            minDate: e.detail.date
        },
    });
});

const multiStepForecastingSearchModalFormEndDateTimeTempusDominusSubscription = multiStepForecastingSearchModalFormEndDateTimeTempusDominus.subscribe(tempusDominus.Namespace.events.change, (e) => {
    multiStepForecastingSearchModalFormStartDateTimeTempusDominus.updateOptions({
        restrictions: {
            maxDate: e.date
        }
    });
});

const multiStepForecastingSearchModalFormValidation = new JustValidate('#multiStepForecastingSearchModalForm', {
    errorFieldCssClass: 'is-invalid',
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
        position: 'right',
    }
});
multiStepForecastingSearchModalFormValidation
    .addField('#multiStepForecastingSearchModalFormOperatingSiteSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectAnOperatingSite', { ns: 'validation' })}`
        }
    ])
    .addField('#multiStepForecastingSearchModalFormBankSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectABank', { ns: 'validation' })}`
        }
    ])
    .addField('#multiStepForecastingSearchModalFormRackSelect', [
        {
            rule: 'required',
            errorMessage: `${i18next.t('selectARack', { ns: 'validation' })}`
        }
    ])
    .addField('#multiStepForecastingSearchModalFormStartDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: `${i18next.t('setTheStartTime', { ns: 'validation' })}`
        },
    ]).addField('#multiStepForecastingSearchModalFormEndDateTimeInput', [
        {
            plugin: JustValidatePluginDate(fields => ({
                required: true,
                format: customFullDateFormat
            })),
            errorMessage: `${i18next.t('setTheEndTime', { ns: 'validation' })}`
        },
    ])
    .onSuccess(async (event) => {
        let multiStepForecastingSearchModalElement = document.getElementById('multiStepForecastingSearchModal');
        let cardElement = document.getElementById('multiStepForecastingMaxCellVoltageCard');
        let chartElement = document.getElementById('multiStepForecastingMaxCellVoltageChart');
        let loadingElement = cardElement.querySelector('.card-body .spinner-border');

        // Off modal
        bootstrap.Modal.getInstance(multiStepForecastingSearchModalElement).hide();

        // Setup loading UI
        chartElement.parentNode.classList.add('d-none');
        loadingElement.classList.remove('d-none');

        let operatingSiteId = multiStepForecastingSearchModalFormOperatingSiteSelectElement.value;
        let bankId = multiStepForecastingSearchModalFormBankSelectElement.value;
        let rackId = multiStepForecastingSearchModalFormRackSelectElement.value;
        let startTime = DateTime.fromFormat(multiStepForecastingSearchModalFormStartDateTimeInput.value, customFullDateFormat).toFormat(customTimeDesignatorFullDateTimeFormat);
        let endTime = DateTime.fromFormat(multiStepForecastingSearchModalFormEndDateTimeInput.value, customFullDateFormat).toFormat(customTimeDesignatorFullDateTimeFormat);

        let responseDataRequestUrl = new URL(`${window.location.origin}/api/ess/stats/multi-step-forecasting-max-cell-voltage/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        responseDataRequestUrl.searchParams.append('start-time', startTime);
        responseDataRequestUrl.searchParams.append('end-time', endTime);

        let observedDataRequestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/${operatingSiteId}/banks/${bankId}/racks/${rackId}/`);
        observedDataRequestUrl.searchParams.append('fields', 'timestamp,rack_max_cell_voltage')
        observedDataRequestUrl.searchParams.append('start-time', startTime);
        observedDataRequestUrl.searchParams.append('end-time', endTime);
        observedDataRequestUrl.searchParams.append('no_page', '');

        let responseData = await loadData(responseDataRequestUrl);
        let observedData = await loadData(observedDataRequestUrl);

        let valueDataObject = {};

        observedData.forEach(element => {
            let timeMillis = DateTime.fromISO(element['timestamp']).toMillis();
            let value1 = element['rack_max_cell_voltage'];

            valueDataObject[timeMillis] = {
                value1: value1
            };
        });

        responseData.forEach(element => {
            let values = element['values'];
            let timeList = values['time'];

            timeList.forEach((time, index) => {
                let timeMillis = DateTime.fromFormat(time, customFullDateTimeFormat).toMillis();

                if (valueDataObject[timeMillis]) {
                    let value2 = values['lstm_attention'][index];

                    valueDataObject[timeMillis]['value2'] = value2;
                }
            });
        });

        let chartData = [];

        Object.keys(valueDataObject).forEach(timeMillis => {
            if (Object.keys(valueDataObject[timeMillis]).length >= 2) {
                chartData.push({
                    time: Number.parseInt(timeMillis),
                    ...valueDataObject[timeMillis]
                });
            }
        });

        multiStepForecastingMaxCellVoltageSeriesList.forEach(chartSeries => {
            chartSeries.data.setAll(chartData);
        });

        cardElement.querySelector('.card-body p').textContent = `
            ${multiStepForecastingSearchModalFormOperatingSiteSelectElement.options[multiStepForecastingSearchModalFormOperatingSiteSelectElement.selectedIndex].text} / Bank ${bankId} / Rack ${rackId}
        `;

        // Off loading UI
        loadingElement.classList.add('d-none');
        chartElement.parentNode.classList.remove('d-none');
    });

/* 
 * Initial tasks
 */

// Create initial visualization chart
// - Assign variable collection for dynamic names
let visualizationTypesObjects = {
    chartSeries: {},
    cardElement: {},
    chartElement: {},
};

let visualizationTypes = ['avg-bank-soc', 'avg-rack-soc', 'avg-bank-power'];
visualizationTypes.forEach(visualizationType => {
    let visualizationTypeCamelCaseString = getCamelCaseString(visualizationType);

    visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString] = '';
    visualizationTypesObjects['cardElement'][visualizationTypeCamelCaseString] = document.getElementById(`${visualizationTypeCamelCaseString}Card`);
    visualizationTypesObjects['chartElement'][visualizationTypeCamelCaseString] = document.getElementById(`${visualizationTypeCamelCaseString}Chart`);
});

visualizationTypes.forEach(visualizationType => {
    let startTimeObject = currentDateTime.startOf('day');
    let startTime = startTimeObject.toFormat(customTimeDesignatorFullDateTimeFormat);
    let endTime = startTimeObject.plus({ day: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);
    let requestUrl;

    if (visualizationType.includes('bank')) {
        requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/stats/${visualizationType}`);
    }

    if (visualizationType.includes('rack')) {
        requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/racks/1/stats/${visualizationType}`);
    }

    requestUrl.searchParams.append('time-bucket-width', '1hour');
    requestUrl.searchParams.append('start-time', startTime);
    requestUrl.searchParams.append('end-time', endTime);

    loadData(requestUrl)
        .then(responseData => {
            let chartData = responseData.map(element => {
                let date = new Date(element.time).getTime();
                let value = element[visualizationType.replaceAll('-', '_')];

                return { date: date, value: value };
            });

            let visualizationTypeCamelCaseString = getCamelCaseString(visualizationType);
            let chartElementId = `${visualizationTypeCamelCaseString}Chart`;
            let chartOption;

            switch (visualizationType) {
                case 'avg-bank-soc':
                    chartOption = {
                        seriesName: `${i18next.t('average')} SoC`,
                        yAxis: {
                            min: 0,
                            max: 100
                        }
                    }

                    visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString] = getLineChartSeries(chartElementId, chartOption);

                    break;
                case 'avg-rack-soc':
                    chartOption = {
                        seriesName: `${i18next.t('average')} SoC`,
                        yAxis: {
                            min: 0,
                            max: 100
                        }
                    }

                    visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString] = getLineChartSeries(chartElementId, chartOption);

                    break;
                case 'avg-bank-power':
                    chartOption = {
                        seriesName: `${i18next.t('average')} ${i18next.t('power')}`
                    }

                    visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString] = getLineChartSeries(chartElementId, chartOption);

                    createAvgChartLine(visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString], chartData);

                    break;
                default:
                    break;
            }

            let chartSeries = visualizationTypesObjects['chartSeries'][visualizationTypeCamelCaseString];
            chartSeries.data.setAll(chartData);

            let loadingElement = visualizationTypesObjects['cardElement'][visualizationTypeCamelCaseString].querySelector('.card-body .spinner-border');
            loadingElement.classList.add('d-none');

            visualizationTypesObjects['chartElement'][visualizationTypeCamelCaseString].parentNode.classList.remove('d-none');
        })
        .catch(error => console.log(error));
});

// Create avg bank SoH chart
let avgBankSoHChartSeries = getAvgSoHChartSeries('avgBankSoHChart');

let requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/2/banks/1/`);

loadData(requestUrl)
    .then(responseData => {
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
    })
    .catch(error => console.log(error));

// Create avg rack SoH chart
let avgRackSoHChartSeries = getAvgSoHChartSeries('avgRackSoHChart');

requestUrl = new URL(`${window.location.origin}/api/ess/stats/avg-soh/operating-sites/2/banks/1/racks/1/`);

loadData(requestUrl)
    .then(responseData => {
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
    })
    .catch(error => console.log(error));

// Create forecasting bank SoL chart
createForecastingBankSoLChart();

// Create rack SoS chart
let detailRackSoSChartOption = {
    'seriesInfo': [
        {
            name: 'over_voltage',
            value: 'value1'
        },
        {
            name: 'under_voltage',
            value: 'value2'
        },
        {
            name: 'voltage_unbalance',
            value: 'value3'
        },
        {
            name: 'over_current',
            value: 'value4'
        },
        {
            name: 'over_temperature',
            value: 'value5'
        },
        {
            name: 'under_temperature',
            value: 'value6'
        },
        {
            name: 'temperature_unbalance',
            value: 'value7'
        },
    ],
};

let forecastingMainRackSoSDefaultOption = {
    seriesInfo: [
        {
            name: "Observed",
            value: 'observed'
        }, {
            name: "CatBoost",
            value: 'catboost'
        }, {
            name: "Linear",
            value: 'linear'
        }, {
            name: "LightGBM",
            value: 'lightgbm'
        }, {
            name: "XGBoost",
            value: 'xgboost'
        },
    ]
};

let mainRackSoSChartSeriesList;
let detailRackSoSChartSeriesList = getDetailRackSoSChartSeriesList('detailRackSoSChart', detailRackSoSChartOption);

let startTime = currentDateTime.minus({ hour: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);
let endTime = currentDateTime.toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/stats/sos/operating-sites/2/banks/1/racks/1/`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);

loadData(requestUrl)
    .then(async (responseData) => {
        const mainRackSoSChartElementId = 'mainRackSoSChart';
        let rackSoSCardElement = document.getElementById('rackSoSCard');
        let mainSoSChartData = [];
        let detailSoSChartData = [];

        let forecastingMainRackSoSNewOption = JSON.parse(JSON.stringify(forecastingMainRackSoSDefaultOption));
        forecastingMainRackSoSNewOption['axisRangeInfo'] = {};

        // Add main & detail SoS data
        responseData.forEach((element, index) => {
            let time = DateTime.fromISO(element['time']).toMillis();

            mainSoSChartData.push({
                time: time,
                observed: element['sos_score'],
            });

            let detailSoSChartDataItem = {
                time: time,
            };

            detailRackSoSChartOption['seriesInfo'].forEach(seriesInfoItem => {
                detailSoSChartDataItem[seriesInfoItem['value']] = element[seriesInfoItem['name']];
            });

            detailSoSChartData.push(detailSoSChartDataItem);

            if (responseData.length - 1 == index) {
                forecastingMainRackSoSNewOption['axisRangeInfo']['value'] = time;
            }
        });

        let forecastingSoSRequestUrl = new URL(`${window.location.origin}/api/ess/stats/forecasting-rack-sos/operating-sites/2/banks/1/racks/1/`);
        forecastingSoSRequestUrl.searchParams.append('start-time', currentDateTime.minus({ minute: 10 }).toFormat(customTimeDesignatorFullDateTimeFormat));
        forecastingSoSRequestUrl.searchParams.append('end-time', currentDateTime.toFormat(customTimeDesignatorFullDateTimeFormat));

        let forecastingSoSResponseData = await loadData(forecastingSoSRequestUrl);
        forecastingSoSResponseData.forEach((element, index) => {
            let time = DateTime.fromISO(element['time']).plus({ minute: 10 }).toMillis();
            let values = element['values'];
            delete values['observed'];

            if (index == 0) {
                Object.keys(values).forEach(key => {
                    mainSoSChartData[mainSoSChartData.length - 1][key] = values[key];
                });
            }

            if (mainSoSChartData[mainSoSChartData.length - 1]['time'] < time) {
                mainSoSChartData.push({
                    time: time,
                    ...values
                });
            }

            if (forecastingSoSResponseData.length - 1 == index) {
                forecastingMainRackSoSNewOption['axisRangeInfo']['endValue'] = time;
            }
        });

        mainRackSoSChartSeriesList = getMainRackSoSChartSeriesList('mainRackSoSChart', forecastingMainRackSoSNewOption);
        mainRackSoSChartSeriesList.forEach(series => {
            series.data.setAll(mainSoSChartData);
        });

        detailRackSoSChartSeriesList.forEach(detailRackSoSChartSeries => {
            detailRackSoSChartSeries.data.setAll(detailSoSChartData);
        });

        // Setup loading UI
        let loadingElement = rackSoSCardElement.querySelector('.card-body .spinner-border');
        loadingElement.classList.add('d-none');

        let mainRackSoSChartElement = document.getElementById(mainRackSoSChartElementId);
        mainRackSoSChartElement.parentNode.parentNode.classList.remove('d-none');
    })
    .catch(error => console.log(error));

// Create bank EXSoS chart
let mainEXSoSChartSeries;
let detailEXSoSChartSeriesList;
let startDate = currentDateTime.toFormat(customFullDateFormat);
let endDate = DateTime.fromFormat(startDate, customFullDateFormat).plus({ day: 1 }).toFormat(customFullDateFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/stats/ex-sos/operating-sites/2/banks/1/`);
requestUrl.searchParams.append('start-time', startDate);
requestUrl.searchParams.append('end-time', endDate);
requestUrl.searchParams.append('mode', 1);

loadData(requestUrl)
    .then(responseData => {
        let chartData = responseData.map(element => {
            return {
                time: DateTime.fromISO(element['time']).toMillis(),
                value: element['integrated_safety'],
                value1: element['membership_degree'],
                membership_degree_detail: element['membership_degree_detail'],
            }
        });

        let chartElementId = 'mainEXSoSChart';
        let detailEXSoSChartData = [
            [
                {
                    valueX: 0,
                    valueY: 1
                },
                {
                    valueX: 0.25,
                    valueY: 0
                }
            ],
            [
                {
                    valueX: 0,
                    valueY: 0,
                },
                {
                    valueX: 0.25,
                    valueY: 1
                },
                {
                    valueX: 0.5,
                    valueY: 0
                }
            ],
            [
                {
                    valueX: 0.25,
                    valueY: 0,
                },
                {
                    valueX: 0.5,
                    valueY: 1
                },
                {
                    valueX: 0.75,
                    valueY: 0
                }
            ],
            [
                {
                    valueX: 0.5,
                    valueY: 0,
                },
                {
                    valueX: 0.75,
                    valueY: 1
                },
                {
                    valueX: 1,
                    valueY: 0
                }
            ],
            [
                {
                    valueX: 0.75,
                    valueY: 0
                },
                {
                    valueX: 1,
                    valueY: 1
                }
            ],
        ]

        detailEXSoSChartSeriesList = getDetailEXSoSChartSeriesList('detailEXSoSChart');
        detailEXSoSChartSeriesList.forEach((detailEXSoSChartSeries, index) => {
            detailEXSoSChartSeries.data.setAll(detailEXSoSChartData[index])
        });

        let option = {
            detailEXSoSChartSeriesList: detailEXSoSChartSeriesList,
        }

        mainEXSoSChartSeries = getMainEXSoSChartSeries(chartElementId, option);
        mainEXSoSChartSeries.data.setAll(chartData);

        // Setup loading UI
        let cardElement = document.getElementById('exSoSCard');
        cardElement.querySelector('.spinner-border').classList.add('d-none');

        let chartElement = document.getElementById(chartElementId);
        chartElement.parentNode.parentNode.classList.remove('d-none');
    })
    .catch(error => console.log(error));

let detailExSoSSafetyOption = {
    safetyDegrees: [
        {
            name: 'Negligible',
            valueXY: ['negligible_x', 'negligible_y'],
        },
        {
            name: 'Marginal',
            valueXY: ['marginal_x', 'marginal_y'],
        },
        {
            name: 'Neutral',
            valueXY: ['neutral_x', 'neutral_y'],
        },
        {
            name: 'Critical',
            valueXY: ['critical_x', 'critical_y'],
        },
        {
            name: 'Catastrophic',
            valueXY: ['catastrophic_x', 'catastrophic_y'],
        },
    ]
};
detailExSoSSafetyOption['xAxisText'] = `${i18next.t('voltage')}(V)`;

let detailExSoSVoltageSafetySeriesList = getDetailExSoSSafetySeriesList('detailEXSoSVoltageSafetyChart', detailExSoSSafetyOption);

// HTML Code 'Degree Celsius': &#8451;
detailExSoSSafetyOption['xAxisText'] = `${i18next.t('temperature')}(&#8451;)`;

let detailExSoSTemperatureSafetySeriesList = getDetailExSoSSafetySeriesList('detailEXSoSTemperatureSafetyChart', detailExSoSSafetyOption);
let staticExSoSChartData = sessionStorage.getItem('staticExSoSChartData');

if (!staticExSoSChartData) {
    requestUrl = new URL(`${window.location.origin}/api/ess/stats/static-chart-data/`)
    requestUrl.searchParams.append('chart_type', 'ExSoS');

    loadData(requestUrl)
        .then(data => {
            let staticExSoSChartDataValue = {};

            data['results'].forEach(element => {
                staticExSoSChartDataValue[element['name']] = element['values'];
            });

            sessionStorage.setItem(`staticExSoSChartData`, JSON.stringify(staticExSoSChartDataValue));
            staticExSoSChartData = sessionStorage.getItem('staticExSoSChartData');

            detailExSoSVoltageSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['over_voltage_safety']);
            });

            detailExSoSTemperatureSafetySeriesList.forEach(series => {
                series.data.setAll(JSON.parse(staticExSoSChartData)['over_temperature_safety']);
            });
        }).catch(error => console.log(error));
} else {
    detailExSoSVoltageSafetySeriesList.forEach(series => {
        series.data.setAll(JSON.parse(staticExSoSChartData)['over_voltage_safety']);
    });

    detailExSoSTemperatureSafetySeriesList.forEach(series => {
        series.data.setAll(JSON.parse(staticExSoSChartData)['over_temperature_safety']);
    });
}

// Create SoCP chart
startTime = currentDateTime.minus({ days: 1 }).toFormat(customFullDateFormat);
endTime = currentDateTime.toFormat(customFullDateFormat);
requestUrl = new URL(`${window.location.origin}/api/ess/stats/socp/operating-sites/2/banks/1/racks/1/`);
requestUrl.searchParams.append('period', 1);
requestUrl.searchParams.append('charge_status', 0);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);

loadData(requestUrl)
    .then(requestData => {
        // Set SoCP chart info
        let socpChartSourceDataInfoElement = document.getElementById('socpChartSourceDataInfo');
        socpChartSourceDataInfoElement.textContent = `판리 태양광 / Bank 1 / Rack 1 - ${currentDateTime.minus({ days: 1 }).toFormat(customFullDateFormat)}, 기간: 1일, 상태: 충전`

        // Create SoCP chart data
        let socRangeValueObject = {};

        requestData.forEach(element => {
            let socRange = Number(element['soc_range']);
            let value = element['value'];

            socRangeValueObject[socRange] = value;
        });

        for (let socRange = 0; socRange < 100; socRange = socRange + 10) {
            let chartElementId = `socRange${socRange}SoCPChart`;
            let chartOption = {
                'chartTitle': `SoC ${socRange} ~ ${socRange + 10}`
            }
            let socpChartSeries = getSoCPChartSeries(chartElementId, chartOption);

            let chartData = Object.keys(socRangeValueObject[socRange]).map(key => {
                let cellNumberStr = key;
                let count = socRangeValueObject[socRange][cellNumberStr]['count'];

                return {
                    cellNumber: Number(cellNumberStr),
                    count: count
                }
            });

            // Create SoCP Chart
            socpChartSeries.data.setAll(chartData);
        }
    })
    .catch(error => console.log(error))



// Create forecasting max-min rack cell charts
let forecastingMaxRackCellVoltageObject = {
    name: 'forecastingMaxRackCellVoltage',
    observedValue: 'rack_max_cell_voltage',
    observedPosition: 'rack_max_cell_voltage_position',
    urlPath: 'forecasting-max-cell-voltage'
};

let forecastingMinRackCellVoltageObject = {
    name: 'forecastingMinRackCellVoltage',
    observedValue: 'rack_min_cell_voltage',
    observedPosition: 'rack_min_cell_voltage_position',
    urlPath: 'forecasting-min-cell-voltage'
};

let forecastingMaxRackCellTemperatureObject = {
    name: 'forecastingMaxRackCellTemperature',
    observedValue: 'rack_max_cell_temperature',
    observedPosition: 'rack_max_cell_temperature_position',
    urlPath: 'forecasting-max-cell-temperature'
}

let forecastingMinRackCellTemperatureObject = {
    name: 'forecastingMinRackCellTemperature',
    observedValue: 'rack_min_cell_temperature',
    observedPosition: 'rack_min_cell_temperature_position',
    urlPath: 'forecasting-min-cell-temperature'
}

let forecastingObjects = [
    forecastingMaxRackCellVoltageObject,
    forecastingMinRackCellVoltageObject,
    forecastingMaxRackCellTemperatureObject,
    forecastingMinRackCellTemperatureObject,
];

let forecastingMaxMinRackCellChartDefaultOption = {
    seriesInfo: [
        {
            name: "Observed",
            value: 'observed'
        }, {
            name: "CatBoost",
            value: 'catboost'
        }, {
            name: "Linear",
            value: 'linear'
        }, {
            name: "LightGBM",
            value: 'lightgbm'
        }, {
            name: "XGBoost",
            value: 'xgboost'
        },
    ]
};

let fields = 'timestamp';

forecastingObjects.forEach(forecastingObject => {
    fields += `,${forecastingObject['observedValue']},${forecastingObject['observedPosition']}`;
});

startTime = currentDateTime.minus({ hour: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);
endTime = currentDateTime.toFormat(customTimeDesignatorFullDateTimeFormat);

requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/racks/1/`);
requestUrl.searchParams.append('fields', fields);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);
requestUrl.searchParams.append('no_page', '');

loadData(requestUrl)
    .then(observedResponseData => {
        forecastingObjects.forEach(forecastingObject => {
            let forecastingObjectName = forecastingObject['name'];
            let forecastingObjectCardElementId = `${forecastingObjectName}Card`;
            let forecastingObjectChartElementId = `${forecastingObjectName}Chart`;

            // Declare variable with dynamic name in 'window' object
            window[`${forecastingObjectName}Object`] = forecastingObject;

            let startTime = currentDateTime.minus({ minute: 10 }).toFormat(customTimeDesignatorFullDateTimeFormat);
            let endTime = currentDateTime.toFormat(customTimeDesignatorFullDateTimeFormat);

            let requestUrl = new URL(`${window.location.origin}/api/ess/stats/${forecastingObject['urlPath']}/operating-sites/2/banks/1/racks/1/`);
            requestUrl.searchParams.append('start-time', startTime);
            requestUrl.searchParams.append('end-time', endTime);

            loadData(requestUrl)
                .then(forecastingObjectResponseData => {
                    let chartDataObjects = {};

                    // Add observed response data in chart data object
                    observedResponseData.forEach((element, index) => {
                        let time = DateTime.fromISO(element['timestamp']).toMillis();

                        chartDataObjects[`${time}`] = {};
                        chartDataObjects[`${time}`]['observed'] = element[forecastingObject['observedValue']];
                        chartDataObjects[`${time}`]['observedPosition'] = element[forecastingObject['observedPosition']];

                        // Attach values of forecasting max-min response data in last observed data
                        if (index == observedResponseData.length - 1) {
                            forecastingMaxMinRackCellChartDefaultOption['seriesInfo'].forEach(info => {
                                if (info['value'] !== 'observed') {
                                    chartDataObjects[`${time}`][info['value']] = element[forecastingObject['observedValue']];
                                }
                            });
                        }
                    });

                    // Add forecasting max-min response data in chart data object
                    forecastingObjectResponseData.forEach(element => {
                        let time = DateTime.fromISO(element['time']).plus({ minute: 10 }).toMillis();
                        let values = element['values'];

                        delete values['observed'];

                        if (!chartDataObjects[`${time}`]) {
                            chartDataObjects[`${time}`] = {};

                            Object.keys(values).forEach(value => {
                                chartDataObjects[`${time}`][value] = values[value];
                            });
                        }
                    });

                    let chartData = Object.keys(chartDataObjects).map(timeString => {
                        return {
                            time: Number(timeString),
                            ...chartDataObjects[timeString]
                        }
                    });

                    // Set axis range info
                    let lastObservedChartDataTime = DateTime.fromISO(observedResponseData[observedResponseData.length - 1]['timestamp']).toMillis();
                    let lastForecastingObjectResponseDataTime = chartData[chartData.length - 1]['time'];

                    let forecastingMaxMinRackCellChartNewOption = JSON.parse(JSON.stringify(forecastingMaxMinRackCellChartDefaultOption));
                    forecastingMaxMinRackCellChartNewOption['axisRangeInfo'] = {
                        value: lastObservedChartDataTime,
                        endValue: lastForecastingObjectResponseDataTime
                    }

                    // Create chart
                    window[`${forecastingObjectName}ChartSeriesList`] = getForecastingMaxMinRackCellSeriesList(forecastingObjectChartElementId, forecastingMaxMinRackCellChartNewOption);
                    window[`${forecastingObjectName}ChartSeriesList`].forEach(chartSeries => {
                        chartSeries.data.setAll(chartData);
                    });

                    // Setup loading UI
                    let forecastingObjectCardElement = document.getElementById(forecastingObjectCardElementId);
                    forecastingObjectCardElement.querySelector('.spinner-border').classList.add('d-none');

                    let forecastingObjectChartElement = document.getElementById(forecastingObjectChartElementId);
                    forecastingObjectChartElement.parentNode.classList.remove('d-none');
                })
                .catch(error => console.log(error));
        })
    })
    .catch(error => console.log(error));


// Create multi step forecasting max cell voltage chart
let multiStepForecastingMaxCellVoltageSeriesList;
let multiStepForecastingMaxCellChartDefaultOption = {
    seriesInfo: [
        {
            name: "Observed",
            value: 'value1'
        }, {
            name: "LSTM_Attention",
            value: 'value2'
        },
    ]
};

startTime = currentDateTime.startOf('day').toFormat(customTimeDesignatorFullDateTimeFormat);
endTime = currentDateTime.startOf('day').plus({ days: 1 }).toFormat(customTimeDesignatorFullDateTimeFormat);
requestUrl = new URL(`${window.location.origin}/api/ess/stats/multi-step-forecasting-max-cell-voltage/operating-sites/2/banks/1/racks/1/`);
requestUrl.searchParams.append('start-time', startTime);
requestUrl.searchParams.append('end-time', endTime);

loadData(requestUrl)
    .then(async (responseData) => {
        let cardElementId = 'multiStepForecastingMaxCellVoltageCard';
        let chartElementId = 'multiStepForecastingMaxCellVoltageChart';
        let currentDate = currentDateTime.toFormat(customFullDateFormat);

        let observedDataRequestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/racks/1/`);
        observedDataRequestUrl.searchParams.append('fields', 'timestamp,rack_max_cell_voltage');
        observedDataRequestUrl.searchParams.append('date', currentDate);
        observedDataRequestUrl.searchParams.append('no_page', '');

        let observedData = await loadData(observedDataRequestUrl);

        let valueDataObject = {};

        observedData.forEach(element => {
            valueDataObject[DateTime.fromISO(element['timestamp']).toMillis()] = {
                value1: element['rack_max_cell_voltage']
            };
        });

        let responseDataValues = responseData[0]['values'];
        responseDataValues['time'].forEach((element, index) => {
            let timeMillis = DateTime.fromFormat(element, customFullDateTimeFormat).toMillis();
            let value2 = responseDataValues['lstm_attention'][index];

            if (valueDataObject[timeMillis]) {
                valueDataObject[timeMillis]['value2'] = value2;
            } else {
                valueDataObject[timeMillis] = {
                    value2: value2
                }
            }
        });

        let chartData = [];

        Object.keys(valueDataObject).forEach(timeMillis => {
            if (Object.keys(valueDataObject[timeMillis]).length >= 2) {
                chartData.push({
                    time: Number.parseInt(timeMillis),
                    ...valueDataObject[timeMillis]
                });
            }

            if (timeMillis > currentDateTime.toMillis()) {
                chartData.push({
                    time: Number.parseInt(timeMillis),
                    ...valueDataObject[timeMillis]
                });
            }
        });

        multiStepForecastingMaxCellVoltageSeriesList = getMultiStepForecastingMaxCellVoltageSeriesList(chartElementId, multiStepForecastingMaxCellChartDefaultOption);
        multiStepForecastingMaxCellVoltageSeriesList.forEach(chartSeries => {
            chartSeries.data.setAll(chartData);
        });

        // Setup loading UI
        let cardElement = document.getElementById(cardElementId);
        cardElement.querySelector('.spinner-border').classList.add('d-none');

        let chartElement = document.getElementById(chartElementId);
        chartElement.parentNode.classList.remove('d-none');
    })
    .catch(error => console.log(error));


//GAP chart
//차트 생성
//마우스 커서일때 이벤트
// 날짜AXIS 데이터받음
//x축 varchart과 연결
// y축 varchart과 연결
// Create root element

/**
 * Get chart's root object
 * @param {string} elementId 
 * @returns {object}
 */
function getVoltageGapChartRoot(elementId) {
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(elementId);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    return root;
}

/**
 * Get chart object
 * @param {object} chartRoot 
 * @param {object} option 
 * @returns {object}
 */
function getVoltageGapChart(chartRoot, option = {}) {
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = chartRoot.container.children.push(
        am5xy.XYChart.new(chartRoot, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
        }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(chartRoot, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    return chart
}

/**
 * Get today's string
 * @returns {string} Format: 'YYYY-MM-DD'
 */
function getTodayDateFormat() {
    let today = new Date().toISOString().split('T')[0];

    return today;
}

// Create voltageGap chart's series
let voltageGapChartRoot = getVoltageGapChartRoot('differencePowerChart');
let voltageGapChart = getVoltageGapChart(voltageGapChartRoot);

// - Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let voltageGapChartXAxis = voltageGapChart.xAxes.push(
    am5xy.DateAxis.new(voltageGapChartRoot, {
        maxDeviation: 0.5,
        baseInterval: { timeUnit: "second", count: 1 },
        renderer: am5xy.AxisRendererX.new(voltageGapChartRoot, { pan: "zoom" }),
        tooltip: am5.Tooltip.new(voltageGapChartRoot, {})
    }));

let voltageGapChartYAxis = voltageGapChart.yAxes.push(
    am5xy.ValueAxis.new(voltageGapChartRoot, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(voltageGapChartRoot, { pan: "zoom" })
    }));

let minRackCellVoltageSeries = voltageGapChart.series.push(am5xy.LineSeries.new(voltageGapChartRoot, {
    name: "minRackCellVoltageSeries",
    xAxis: voltageGapChartXAxis,
    yAxis: voltageGapChartYAxis,
    valueYField: "minRackCellVoltage",
    valueXField: "timestamp",
    stroke: am5.color(0x00589b), // 'cobalt' color
    fill: am5.color(0x00589b),
    tooltip: am5.Tooltip.new(voltageGapChartRoot, {
        labelText: `${i18next.t('min')} ${i18next.t('voltage')} ${i18next.t('value')} : {valueY} V`,
        pointerOrientation: "horizontal"
    })
}));

let maxRackCellVoltageSeries = voltageGapChart.series.push(am5xy.LineSeries.new(voltageGapChartRoot, {
    name: "maxRackCellVoltageSeries",
    xAxis: voltageGapChartXAxis,
    yAxis: voltageGapChartYAxis,
    valueYField: "maxRackCellVoltage",
    openValueYField: "minRackCellVoltage",
    valueXField: "timestamp",
    stroke: minRackCellVoltageSeries.get("stroke"),
    stroke: am5.color("#0x00589b"),
    fill: minRackCellVoltageSeries.get("stroke"),
    fill: am5.color("#0x00589b"),
    tooltip: am5.Tooltip.new(voltageGapChartRoot, {
        labelText: `${i18next.t('max')} ${i18next.t('voltage')} ${i18next.t('value')} : {valueY} V`,
        pointerOrientation: "horizontal"
    })
}));

// Create voltageGap chart
requestUrl = new URL(`${window.location.origin}/api/ess/operating-sites/2/banks/1/racks/1/?fields=timestamp,rack_max_cell_voltage,rack_min_cell_voltage&date=${getTodayDateFormat()}&no_page`)

fetch(requestUrl)
    .then((response) => response.json())
    .then((responseData) => {
        let data = responseData.map(element => {
            return {
                timestamp: new Date(element['timestamp']).getTime(),
                minRackCellVoltage: element["rack_min_cell_voltage"],
                maxRackCellVoltage: element["rack_max_cell_voltage"],
            }
        })

        minRackCellVoltageSeries.data.setAll(data);
        maxRackCellVoltageSeries.data.setAll(data);

        maxRackCellVoltageSeries.fills.template.setAll({
            fillOpacity: 0.3,
            visible: true
        });

        minRackCellVoltageSeries.strokes.template.set("strokeWidth", 2);
        maxRackCellVoltageSeries.strokes.template.set("strokeWidth", 2);

        minRackCellVoltageSeries.appear(1000);
        maxRackCellVoltageSeries.appear(1000);
        voltageGapChart.appear(1000, 100);
    })