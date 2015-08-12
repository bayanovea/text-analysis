var Graphics = (function() {
    var
        _isInit = false;

    /**
     * Инициализация
     */
    function init() {
        _isInit = true;
        _setTheme();
    };

    /**
     * Установка темы Highcharts
     */
    function _setTheme() {
        if (!_isInit)
            return new Error('Graphics not init');

        Highcharts.theme = {
            colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            chart: {
                backgroundColor: null,
                style: { fontFamily: "Signika, serif" }
            },
            title: {
                style: {
                    color: 'black',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                style: { color: 'black' }
            },
            tooltip: { borderWidth: 0 },
            legend: {
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '13px'
                }
            },
            xAxis: {
                labels: {
                    style: { color: '#6e6e70' }
                }
            },
            yAxis: {
                labels: {
                    style: { color: '#6e6e70' }
                }
            },
            plotOptions: {
                series: { shadow: true },
                candlestick: { lineColor: '#404048' },
                map: { shadow: false }
            },
            // Highstock specific
            navigator: {
                xAxis: {  gridLineColor: '#D0D0D8' }
            },
            rangeSelector: {
                buttonTheme: {
                    fill: 'white',
                    stroke: '#C0C0C8',
                    'stroke-width': 1,
                    states: {
                        select: { fill: '#D0D0D8' }
                    }
                }
            },
            scrollbar: { trackBorderColor: '#C0C0C8' },
            // General
            background2: '#E0E0E8'
        };

        // Применение темы
        Highcharts.setOptions(Highcharts.theme);
    };

    /**
     * Построение кругового графика по категориям
     *
     * @param {object} selector Селектор где строим график
     * @param {array} series Массив с данными для графика
     */
    function plotCategoriesPie(selector, series) {
        if (!_isInit)
            return new Error('Graphics not init');

        selector.highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: { color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black' },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Процент',
                data: series
            }]
        });
    };

    /**
     * Построение линейного графика по принадлежности материалов к категории
     *
     * @param {object} selector Селектор где строим график
     * @param {array} series Массив с данными для графика
     */
    function plotMaterialsLine(selector, series) {
        if (!_isInit)
            return new Error('Graphics not init');

        selector.highcharts({
            chart: { type: 'spline' },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: { text: 'Дата' }
            },
            yAxis: {
                title: { text: 'Количество' },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
            },
            plotOptions: {
                spline: {
                    marker: { enabled: true }
                }
            },
            series: series
        });
    }

    return {
        init: init,
        plotCategoriesPie: plotCategoriesPie,
        plotMaterialsLine: plotMaterialsLine,
    };
})();