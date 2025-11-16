/**
 * @fileoverview Organization API operations for HRMLESS Zapier integration.
 * Handles organization settings retrieval and updates.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const samples = require('../samples/OrganizationApi');
const Organization = require('../models/Organization');
const orgserial = require('../models/orgserial');
const utils = require('../utils/utils');
const BASE_URL = process.env.BASE_URL;

/**
 * Organization API operations module.
 * Contains all Zapier actions for managing organization settings.
 * 
 * @type {Object}
 * @property {Object} orgSettingsList - Get organization settings
 * @property {Object} orgSettingsUpdate - Update organization settings
 */
module.exports = {

    /**
     * Get Organization Settings action.
     * Retrieves all settings for the authenticated organization.
     * 
     * @type {Object}
     */
    orgSettingsList: {
        key: 'orgSettingsList',
        noun: 'Organization',
        display: {
            label: 'Get Org Settings',
            description: 'Get all settings for your organization',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
            ],
            outputFields: [
                ...orgserial.fields('', false),
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/settings/`,
                    method: 'GET',
                    removeMissingValuesFrom: { params: true, body: true },
                    headers: {
                        'Content-Type': '',
                        'Accept': 'application/json',
                    },
                    params: {
                    },
                    body: {
                    },
                }
                return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
                    if (response.status === 404) {
                        throw new z.errors.Error('Organization not found. Please verify the organization ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }

                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgSettingsList', response.json);
                    return results;
                })
            },
            sample: samples['orgserialSample']
        }
    },

    /**
     * Update Organization Settings action.
     * Updates organization configuration including name, contact info, and calendar link.
     * 
     * @type {Object}
     */
    orgSettingsUpdate: {
        key: 'orgSettingsUpdate',
        noun: 'Organization',
        display: {
            label: 'Update Org Settings',
            description: 'Update organization settings including name, contact info, and calendar link',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
                ...Organization.fields(),
            ],
            outputFields: [
                ...Organization.fields('', false),
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/settings/`,
                    method: 'PUT',
                    removeMissingValuesFrom: { params: true, body: true },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    params: {
                    },
                    body: {
                        ...Organization.mapping(bundle),
                    },
                }
                return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
                    if (response.status === 404) {
                        throw new z.errors.Error('Organization not found. Please verify the organization ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgSettingsUpdate', response.json);
                    return results;
                })
            },
            sample: samples['OrganizationSample']
        }
    }
}
