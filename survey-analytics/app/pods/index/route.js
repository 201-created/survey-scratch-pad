import Ember from 'ember';
import {csvParseRows} from 'd3-dsv';
import {storageFor} from 'ember-local-storage';
import config from 'survey-analytics/config/environment';

const {inject, Route, RSVP: {Promise}} = Ember;

const RESULTS_2015_URL = `${config.rootURL}/assets/ember-survey-2015.csv`.replace(/\/\//g, '/');
const RESULTS_2016_URL = `${config.rootURL}/assets/ember-survey-2016.csv`.replace(/\/\//g, '/');

export default Route.extend({

    ajax: inject.service(),
    settings: storageFor('settings'),

    model(){

        return Promise.all([RESULTS_2015_URL, RESULTS_2016_URL].map(url => {
            return this.get("ajax").request(url, {
                method: 'GET',
                mimeType: 'text/csv',
                dataType: 'text',
            }).then(results => csvParseRows(results));
        })).then(([rows2015, rows2016]) => {
            return [
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
            this.setProperties({
                "settings.question": question
            });
        }
    }

});
