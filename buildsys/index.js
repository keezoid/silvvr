/**
 * buildsys/index
 * Index of buildsys. Handles autoloading of all tasks and setting up environment from flags.
 * @author Keenan Staffieri
*/

var gulp = require('gulp');
var fs = require('fs');
var crypto = require('crypto');
var config = require('./config/config');
var Logger = require('./utils/Logger');
var pkg = require('../package.json');


// Grab command line arguments
var argv = require('yargs').argv;


/**
    Set build environment (dev, stage, or prod)
*/
var env = 'dev';
if      (argv.stage) { env = 'stage'; }
else if (argv.prod)  { env = 'prod';  }


/**
    Build-only mode?
*/
var buildOnlyMode = false;
if(argv.build) { buildOnlyMode = true; }


/**
    Globals
*/

// Make environment globally accessible
global.env = env;

// Make gulp globally accessible
global.gulp = gulp;

// Make Logger globally accessible
global.Logger = Logger;

// Make config globally accessible
global.config = config;

// Make build-only mode globally accessible
global.buildOnlyMode = buildOnlyMode;


/**
    Startup Banner log
*/
Logger.banner('S I L V V R  Started');
Logger.header(`${pkg.name} @version ${pkg.version}`);
Logger.header(`By ${pkg.author.name}`);


/**
    Set cachebusting unique hash value if enabled
    for current build environment
*/
global.CACHEBUST_HASH = false;
if(config.env[env].cachebustAssets) {
    let currentDate = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    global.CACHEBUST_HASH = crypto.createHash('md5').update(currentDate + random).digest('hex');;
}


/**
    Require all gulp tasks
*/
Logger.notice('Autoloading tasks...');
var tasks = fs.readdirSync('./buildsys/task/');
tasks.forEach(function (task) {
    if(/\.js/.test(task)) {
        Logger.info(`Requiring task ${task}...`);
        require(`./task/${task}`);
    }
});


/**
    Require gulp commands
*/
require('./commands');
