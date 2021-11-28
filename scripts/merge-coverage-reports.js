/**
 * This script merges the coverage reports from Cypress and Jest into a single
 * report in the ".nyc_output/out.json" file.
 *
 * @see https://rafaelalmeidatk.com/blog/merging-coverage-reports-from-jest-and-cypress
 */

const { execSync } = require('child_process')
const fs = require('fs-extra')

// Create the reports folder and move the reports from cypress and jest inside it
const REPORTS_FOLDER = 'reports'
fs.emptyDirSync(REPORTS_FOLDER)

fs.copyFileSync(
  'jest-coverage/coverage-final.json',
  `${REPORTS_FOLDER}/from-jest.json`
)

fs.copyFileSync(
  'cypress-coverage/coverage-final.json',
  `${REPORTS_FOLDER}/from-cypress.json`
)

const MERGED_COVERAGE_FOLDER = '.nyc_output'
fs.emptyDirSync(MERGED_COVERAGE_FOLDER)
execSync(`./node_modules/.bin/nyc merge ${REPORTS_FOLDER} .nyc_output/out.json`, { stdio: 'inherit' })

fs.emptyDirSync(REPORTS_FOLDER)
fs.rmdirSync(REPORTS_FOLDER)
// eslint-disable-next-line no-console
console.log(`intermediary folder ${REPORTS_FOLDER} deleted`)
