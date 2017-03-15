export default {
    colors: [
        '#f23818',
        '#cccccc',
        '#4b4b4b'
    ],
    chart: {
        backgroundColor: '#ffffff',
        style: {
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
    },
    title: {
        style: {
            color: '#000000',
            fontSize: '20px',
            fontWeight: 'bold'
        },
        align: 'center',
        margin: 10,
        x: 30
    },
    subtitle: {
        style: {
            color: 'black'
        }
    },
    legend: {
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '14px'
        }
    },
    xAxis: {
        labels: {
            style: {
                color: '#6e6e70',
                fontSize: '12px'
            }
        },
        title: {
            style: {
                fontSize: '14px'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#6e6e70',
                fontSize: '14px'
            }
        },
        title: {
            style: {
                fontSize: '14px'
            }
        }
    },
    plotOptions: {
        series: {
            shadow: true,
            cursor: 'pointer'
        },
        candlestick: {
            lineColor: '#404048'
        }
    },
    navigator: {
        xAxis: {
            gridLineColor: '#D0D0D8'
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: 'white',
            stroke: '#C0C0C8',
            'stroke-width': 1,
            states: {
                select: {
                    fill: '#D0D0D8'
                }
            }
        }
    },
    scrollbar: {
        trackBorderColor: '#C0C0C8'
    },
    background2: '#E0E0E8',
    global: {
        timezoneOffset: new Date().getTimezoneOffset()
    },
    credits: {
        enabled: false
    }
};
