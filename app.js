'use strict';

const config  = require('config');
const request = require('request');
const exec    = require('child_process').exec;


/**
 * configs
 **/

const threshold = config.get('threshold');
const command   = config.get('command');
const url       = config.get('endpoint') + config.get('wallet');


/**
 * loooop
 **/

function check() {
    
    request(url, (err, response, body) => {

        const data     = JSON.parse(body);
        const worker   = data.workers[config.get('worker')];
        const hashrate = parseInt(worker.hashrate.replace('H/s', ''), 10);

        console.log(Date.now(), worker.worker, hashrate, threshold);
        
        if ( hashrate < threshold ) {
            exec(command);
        } else {
            setTimeout(check, 3000);
        }

    });
    
}

// delayed start
setTimeout(check, 60 * 1000 * 10);
