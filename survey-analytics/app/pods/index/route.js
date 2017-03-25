import Ember from 'ember';
import {csvParseRows} from 'd3-dsv';
import {storageFor} from 'ember-local-storage';
import config from 'survey-analytics/config/environment';

const {inject, Route, RSVP: {Promise}} = Ember;

const URLS = [2015, 2016, 2017].map(
    year => `${config.rootURL}/assets/ember-survey-${year}.csv`.replace(/\/\//g, '/'));

export default Route.extend({

    ajax: inject.service(),
    settings: storageFor('settings'),

    model(){

        return Promise.all(URLS.map(url => {
            return this.get("ajax").request(url, {
                method: 'GET',
                mimeType: 'text/csv',
                dataType: 'text',
            }).then(results => csvParseRows(results));
        })).then(([rows2015, rows2016, rows2017]) => {
            return [
                {year: "2017", rows: rows2017},
                {year: "2016", rows: rows2016},
                {year: "2015", rows: rows2015}
            ];
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set("settings", this.get("settings"));
    },

    actions: {
        changeQuestion(question){
            this.set("settings.question", question);
        },

        changeFilter(response){
            this.set("settings.filter", response ? {q: this.get("settings.question"), a: response.a} : undefined);
        }
    }

});
