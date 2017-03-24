import Ember from 'ember';
import chartTheme from 'survey-analytics/themes/ember-theme';
import {TABLE_META} from 'survey-analytics/lib/constants';

const {Component, computed, ObjectProxy} = Ember;

const Responses = ObjectProxy.extend({
    data: computed("rows", function () {
        let rows = this.get("rows");
        let year = this.get("year");

        let cleanup = answers => answers.filter(s => s).map(s => s.trim().replace(/–/g, '-'));

        return rows.slice(1, rows.length).map(row => {
            let r = [];
            for (let col of TABLE_META) {
                if (col.question && col.years[year]) {
                    let yearMeta = col.years[year];

                    switch (+year) {
                        case 2015: {
                            let value = row[yearMeta.col];
                            r.push({
                                q: col.question,
                                a: cleanup(value.split(','))
                            });
                            break;
                        }
                        case 2016:
                        case 2017: {
                            r.push({
                                q: col.question,
                                a: cleanup(row.slice(yearMeta.col, yearMeta.col + (yearMeta.cols || 1)))
                            });
                            break;
                        }
                    }
                }
            }
            return r;
        });
    })
});


export default Component.extend({

    classNames: ["survey-main"],

    responseLimit: computed(function () {
        throw new Error("You must supply `responseLimit` as a parameter");
    }),

    /**
     * data[] is an array of objects with the signature {year, rows}
     *
     * @return an array of Responses objects
     */
    responses: computed("data.[]", function () {
        let data = this.get("data");
        return data.map(yearData => Responses.create({content: yearData}));
    }),

    years: computed(function () {
        return TABLE_META.filter(d => d.hasOwnProperty("years")).map(d => Object.keys(d.years)).reduce((arr, years) => {
            Array.prototype.push.apply(arr, years);
            return arr;
        }).uniq().sort()
    }),

    chartYears: computed("chartData.[]", function () {
        return this.get("chartData").mapBy("_year").sort();
    }),

    activeResponses: computed("responses", "activeQuestion", function () {
        let question = this.get("activeQuestion");
        if (question) {

            // for each year...
            return this.get("responses").map(responses => {
                let answers = [];

                // enumerate all of the answers into a single array
                responses.get("data").map(result => result.findBy("q", question)).filter(a => a)
                    .forEach(a => Array.prototype.push.apply(answers, a.a));

                // count the unique answers
                let counts = answers.reduce((map, r) => {
                    let lowered = r.toLowerCase();
                    if (!map.hasOwnProperty(lowered)) {
                        map[lowered] = {label: r, count: 1};
                    } else {
                        map[lowered].count++;
                    }
                    return map;
                }, {});

                let total = Object.keys(counts).reduce((sum, k) => sum + counts[k].count, 0);
                let answerItems = Object.keys(counts)
                    .map(k => ({a: counts[k].label, count: counts[k].count, pct: 100 * counts[k].count / total}))
                    .sortBy("count").reverse();
                return {year: responses.get("year"), answers: answerItems};
            });
        } else {
            // select the first by default
            if (this.get("questions.length")) {
                this.selectQuestion(this.get("questions.0"));
            }
            return [];
        }

    }),

    activeResponsesByYear: computed("activeResponses", function () {
        let activeResponses = this.get("activeResponses");
        // I know this is inefficient, so will come back later and fix
        let answers = [];
        activeResponses.forEach(r => {
            r.answers.forEach(a => {
                let model = answers.findBy("a", a.a);
                if (!model) {
                    model = {a: a.a, count: 0, years: {}};
                    answers.push(model);
                }
                model.years[r.year] = a.count;
                model.count += a.count;
            });
        });
        return answers.sortBy("count").reverse();
    }),


    chartData: computed("activeResponses.[]", "responseLimit", "usePercentages", {

        get() {
            let usePercentages = this.get("usePercentages");
            let activeResponses = this.get("activeResponses");

            return activeResponses.map(responses => ({
                name: `${responses.year} Data`,
                data: responses.answers.slice(0, this.get("responseLimit"))
                    .map(r => ({name: r.a, y: usePercentages ? Math.round(r.pct) : r.count})),
                _year: responses.year
            })).filter(r => r.data.length);
        },

        set(key, value) {
            return value;
        }

    }),

    chartTheme: chartTheme,

    questions: computed("selectedYears", function () {
        let selectedYears = this.get("selectedYears");
        let filter = _ => true;
        if (selectedYears && selectedYears.length) {
            filter = d => Object.keys(d.years).some(k => selectedYears.includes(k));
        }
        return TABLE_META.filter(d => d.question && filter(d)).map(d => d.question);
    }),

    selectQuestion(question){
        Ember.run.later(_ => this.get("onQuestionChange")(question), 100);
    },

    actions: {
        selectQuestion(question){
            // do this to invalidate the chart, to force a new highcharts component
            this.set("chartData", undefined);
            this.selectQuestion(question);
        }
    }

});
