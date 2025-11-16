/**
 * @fileoverview Candidate API operations for HRMLESS Zapier integration.
 * Handles CRUD operations for candidates including create, read, update, and delete.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const samples = require('../samples/CandidatesApi');
const Candidate = require('../models/Candidate');
const CandidateCreate = require('../models/CandidateCreate');
const utils = require('../utils/utils');
const CandidateUpdate = require('../models/CandidateUpdate');
const BASE_URL = process.env.BASE_URL;

/**
 * Candidate API operations module.
 * Contains all Zapier actions for managing candidates.
 * 
 * @type {Object}
 * @property {Object} orgPositionsCandidatesDelete - Delete a candidate by ID
 * @property {Object} orgPositionsCandidatesRead - Get candidate details by ID
 * @property {Object} orgPositionsCandidatesUpdate - Update candidate details
 * @property {Object} orgPositionsCreate - Create a new candidate in a position
 * @property {Object} orgPositionsRead - List all candidates in a position
 */
module.exports = {
    /**
     * Delete Candidate action.
     * Removes a candidate from a position.
     * 
     * @type {Object}
     */
    orgPositionsCandidatesDelete: {
        key: 'orgPositionsCandidatesDelete',
        noun: 'Candidates',
        display: {
            label: 'Delete Candidate',
            description: 'Delete a candidate by id',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
                {
                    key: 'position_id',
                    label: 'Position',
                    type: 'string',
                    required: true,
                    dynamic: 'orgPositionAction.id.name',
                },
                {
                    key: 'candidate_id',
                    label: 'Candidate ID',
                    type: 'string',
                    required: true,
                },
            ],
            outputFields: [
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/positions/${bundle.inputData.position_id}/candidates/${bundle.inputData.candidate_id}/`,
                    method: 'DELETE',
                    removeMissingValuesFrom: { params: true, body: true },
                    headers: {
                        'Content-Type': '',
                        'Accept': '',
                    },
                    params: {
                    },
                    body: {
                    },
                }
                return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
                    if (response.status === 404) {
                        throw new z.errors.Error('Candidate not found. Please verify the candidate ID and position ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    // If 204, return a dummy object
                    if (response.status === 204 || !response.content) {
                        return { success: true };
                    }
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionsCandidatesDelete', response.json);
                    return results || { success: true };
                })
            },
            sample: { success: true }
        }
    },

    /**
     * Get Candidate Details action.
     * Retrieves detailed information about a specific candidate.
     * 
     * @type {Object}
     */
    orgPositionsCandidatesRead: {
        key: 'orgPositionsCandidatesRead',
        noun: 'Candidates',
        display: {
            label: 'Get a Candidate',
            description: 'Get a single candidate by id',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
                {
                    key: 'position_id',
                    label: 'Position',
                    type: 'string',
                    required: true,
                    dynamic: 'orgPositionAction.id.name',
                },
                {
                    key: 'candidate_id',
                    label: 'Candidate ID',
                    type: 'string',
                    required: true,
                },
            ],
            outputFields: [
                ...Candidate.fields('', false),
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/positions/${bundle.inputData.position_id}/candidates/${bundle.inputData.candidate_id}/`,
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
                        throw new z.errors.Error('Candidate not found. Please verify the candidate ID and position ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionsCandidatesRead', response.json);
                    const { communications, hired, tags, ...filtered } = results;
                    return filtered;
                })
            },
            sample: samples['CandidateSample']
        }
    },
    /**
     * Update Candidate Details action.
     * Updates information for an existing candidate.
     * 
     * @type {Object}
     */
    orgPositionsCandidatesUpdate: {
        key: 'orgPositionsCandidatesUpdate',
        noun: 'Candidates',
        display: {
            label: 'Update a Candidate',
            description: 'Update a single candidate by id',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
                {
                    key: 'position_id',
                    label: 'Position',
                    type: 'string',
                    required: true,
                    dynamic: 'orgPositionAction.id.name',
                },
                {
                    key: 'candidate_id',
                    label: 'Candidate ID',
                    type: 'string',
                    required: true,
                },
                ...CandidateCreate.fields(),
            ],
            outputFields: [
                ...Candidate.fields('', false),
            ],
            perform: async (z, bundle) => {
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/positions/${bundle.inputData.position_id}/candidates/${bundle.inputData.candidate_id}/`,
                    method: 'PUT',
                    removeMissingValuesFrom: { params: true, body: true },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    params: {
                    },
                    body: {
                        ...CandidateUpdate.mapping(bundle),
                    },
                }
                return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
                    if (response.status === 404) {
                        throw new z.errors.Error('Candidate not found. Please verify the candidate ID and position ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionsCandidatesUpdate', response.json);
                    const { communications, hired, tags, ...filtered } = results;
                    return filtered;
                })
            },
            sample: samples['CandidateCreateSample']
        }
    },
    /**
     * Create Candidate action.
     * Adds a new candidate to a position.
     * 
     * @type {Object}
     */
    orgPositionsCreate: {
        key: 'orgPositionsCreate',
        noun: 'Candidates',
        display: {
            label: 'Create a Candidate',
            description: 'Adds a new candidate to a position',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
                {
                    key: 'position_id',
                    label: 'Position',
                    type: 'string',
                    required: true,
                    dynamic: 'orgPositionAction.id.name',
                },
                ...CandidateCreate.fields(),
            ],
            outputFields: [
                ...Candidate.fields('', false),
            ],
            perform: async (z, bundle) => {
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/positions/${bundle.inputData.position_id}/`,
                    method: 'POST',
                    removeMissingValuesFrom: { params: true, body: true },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    params: {
                    },
                    body: {
                        ...CandidateCreate.mapping(bundle),
                    },
                }
               
                return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
                    if (response.status === 404) {
                        throw new z.errors.Error('Candidates not found. Please verify the position ID you are trying to create the candidate under', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionsCreate', response.json);
                    const { communications, hired, tags, ...filtered } = results[0];
                    return filtered;
                })
            },
            sample: samples['CandidateCreateSample']
        }
    },
    /**
     * List Candidates action.
     * Retrieves all candidates for a specific position.
     * 
     * @type {Object}
     */
    orgPositionsRead: {
        key: 'orgPositionsRead',
        noun: 'Candidates',
        display: {
            label: 'Get All Candidates',
            description: 'List all candidates for a position',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
                {
                    key: 'position_id',
                    label: 'Position',
                    type: 'string',
                    required: true,
                    dynamic: 'orgPositionAction.id.name',
                },
            ],
            outputFields: [
                ...Candidate.fields('', false),
            ],
            perform: async (z, bundle) => {
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/positions/${bundle.inputData.position_id}/`,
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
                        throw new z.errors.Error('Candidates not found. Please verify the position ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionsRead', response.json);
                    const { communications, hired, tags, ...filtered } = results;
                    return filtered;
                })
            },
            sample: samples['CandidateSample']
        }
    }
}
