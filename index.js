/**
 * @fileoverview Main entry point for the HRMLESS Zapier integration.
 * This file exports the app configuration including authentication, actions, searches, and triggers.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const { searchActions, createActions, triggers } = require('./operations/actions');

const {
  config: authentication,
  befores = [],
  afters = [],
} = require('./authentication');

/**
 * Main Zapier app definition object.
 * Exports all configuration necessary for the HRMLESS Zapier integration.
 * 
 * @type {Object}
 * @property {string} version - The version of this integration from package.json
 * @property {string} platformVersion - The version of zapier-platform-core being used
 * @property {Object} authentication - OAuth2 authentication configuration
 * @property {Array<Function>} beforeRequest - Middleware functions to run before each API request
 * @property {Array<Function>} afterResponse - Middleware functions to run after each API response
 * @property {Object} resources - Resource definitions (currently empty)
 * @property {Object} searches - Search action definitions for finding existing records
 * @property {Object} creates - Create action definitions for creating or updating records
 * @property {Object} triggers - Trigger definitions for dynamic dropdowns
 */
module.exports = {
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,
    authentication: authentication,
    beforeRequest: [...befores],
    afterResponse: [...afters],
    resources: {},
    searches: searchActions(),
    creates: createActions(),
    triggers: triggers(),
};
