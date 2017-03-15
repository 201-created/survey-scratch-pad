import Ember from 'ember';
import {csvParseRows} from 'd3-dsv';
import {storageFor} from 'ember-local-storage';

const {inject, Route, RSVP: {Promise}} = Ember;

// TODO can't fetch from google due to CORS
// const RESULTS_2015_URL =
// 'https://docs.google.com/spreadsheets/d/13WjIlh6j4srKx8wDSsYUgULOiUZw3vKBJRLxESXNFW0/export?format=csv&id=13WjIlh6j4srKx8wDSsYUgULOiUZw3vKBJRLxESXNFW0&gid=1513921926';
const RESULTS_2015_URL = '/assets/ember-survey-2015.csv';
const RESULTS_2016_URL = 'http://emberjs.com/ember-community-survey-2016/ember-community-survey-2016-results.csv';

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
