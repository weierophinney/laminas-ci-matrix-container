import core from '@actions/core';
import process from 'process';
import checkRequirements from './src/check-requirements.js';
import configGatherer from './src/config.js';
import createJobs from './src/create-jobs.js';

const requirements = checkRequirements(process.argv.slice(2));
const config       = configGatherer(
    requirements,
    '.laminas-ci.json',
    'composer.json',
    'composer.lock',
);

core.info(`Versions found: ${JSON.stringify(config.versions)}`);
core.info(`Using stable PHP version: ${config.stable_version}`);
core.info(`Using php extensions: ${JSON.stringify(config.extensions)}`);
core.info(`Providing php.ini settings: ${JSON.stringify(config.php_ini)}`);
core.info(`Dependency sets found: ${JSON.stringify(config.dependencies)}`);

let matrix = {include: createJobs(config)};

if (config.exclude.length) {
    matrix.exclude = config.exclude;
}

core.info(`Matrix: ${JSON.stringify(matrix)}`);
core.setOutput('matrix', JSON.stringify(matrix));
