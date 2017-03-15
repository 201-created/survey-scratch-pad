import Ember from 'ember';
import Highcharts from 'ember-highcharts/components/high-charts';

const {computed, computed: {alias}} = Ember;

export default Highcharts.extend({

    classNames: ["viz-bar"],

    chartOptions: computed(function () {
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: this.get("title") || ''
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.get("yAxisLabel")
                }
            },
            legend: {
                enabled: this.get("showLegend") || false
            },
            tooltip: {
                crosshairs: true
            }
        };
    }),

    content: alias("data"),

    contentDidChange: Ember.observer('content.@each.isLoaded', function () {
        let chart = this.get('chart');
        // this allows the caller to change properties live
        chart.setTitle({text: this.get("title") || ''}, null, false);
        chart.yAxis[0].setTitle({text: this.get("yAxisLabel") || ''}, false);
        chart.redraw();
    })

});
