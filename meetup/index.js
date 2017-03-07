#!/usr/bin/env node
const fs = require('fs');
const assert = require('assert');
const chalk = require('chalk');
const CSVWriter = require('csv-write-stream');


const argv = require('yargs')
    .usage('Usage: $0 [options] <search>')
    .example('$0 -k MEETUP_KEY -o ember_groups.csv emberjs', 'save groups matching emberjs to a file')
    .alias('k', 'key').nargs('k', 1).describe('k', 'Your Meetup API key')
    .alias('o', 'output').nargs('o', 1).describe('o', 'Output CSV file').default('o', 'groups.csv')
    .alias('t', 'throttle').nargs('t', 1).describe('t', 'Throttle millis').default('t', 2000).number('t')
    .alias('l', 'limit').nargs('l', 1).describe('l', 'Maximum pages to fetch').default('l', 0).number('l')
    .demandOption(['k']).alias('k', 'key').nargs('k', 1).describe('k', 'Meetup API key')
    .help('h').alias('h', 'help')
    .demandCommand(1)
    .argv;

let meetup = require('meetup-api')({
    key: argv.key
});

const limit = 200,
    throttleMillis = argv.throttle,
    maxPages = argv.limit,
    search = argv._[0],
    output = argv.output;

let pageIndex = 0;

let writer = CSVWriter({
    headers: 'id name link city state country members organizer_id organizer_name'.split(' ')
});
writer.pipe(fs.createWriteStream(output));

function getNextPage() {

    console.log(chalk.blue(`Fetching page ${pageIndex + 1} with search: ${search}`));
    meetup.findGroups({
        text: search,
        radius: 'global',
        page: limit,
        order: 'members',
        offset: pageIndex
    }, function (err, resp) {
        if (err) {
            console.error('Received API error', err);
            throw err;
        }

        ++pageIndex;
        let rows = resp.map(row => {
            return [
                row.id,
                row.name,
                row.link,
                row.city,
                row.state,
                row.country,
                row.members,
                row.organizer.id,
                row.organizer.name
            ];
        });
        rows.forEach(r => writer.write(r));

        if (rows.length < limit || (maxPages > 0 && maxPages <= pageIndex)) {
            console.log(chalk.red(`Wrote file ${output}`));
            writer.end();
        } else {
            setTimeout(function () {
                getNextPage();
            }, throttleMillis);
        }
    });
}

getNextPage();