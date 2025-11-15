/**
 * @fileoverview Position API operations for HRMLESS Zapier integration.
 * Handles CRUD operations for job positions including list, read, update, and delete.
 * @author HRMLESS LLC
 * @version 1.0.0
 */

const samples = require('../samples/PositionApi');
const Position = require('../models/Position');
const utils = require('../utils/utils');
const BASE_URL = process.env.BASE_URL;

/**
 * Position API operations module.
 * Contains all Zapier actions for managing job positions.
 * 
 * @type {Object}
 * @property {Object} orgPositionAction - Trigger for dynamic dropdown of positions
 * @property {Object} orgPositionList - List all positions in organization
 * @property {Object} orgPositionDelete - Delete a position by ID
 * @property {Object} orgPositionRead - Get position details by ID
 * @property {Object} orgPositionUpdate - Update position details
 */
module.exports = {

    /**
     * List Positions trigger action.
     * Used for dynamic dropdowns in Zapier to select positions.
     * Hidden from main action list as it's used internally for UI.
     * 
     * @type {Object}
     */
    orgPositionAction: {
        key: 'orgPositionAction',
        noun: 'Position',
        display: {
            label: 'List Positions',
            description: 'Get All Positions',
            hidden: true, // Hidden because it's used as a trigger for dynamic dropdown
        },
        operation: {
            cleanInputData: false,
            inputFields: [
            ],
            outputFields: [
                { key: 'id', label: 'Position ID' },
                { key: 'name', label: 'Position Name' },
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/position`,
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
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionAction', response.json);

                    const items = results.items || [];
                    return items.map(position => ({
                        id: position.id,
                        name: position.name
                    }));
                })
            },
            sample: samples['PositionSample']
        }
    },

    /**
     * Get All Positions action.
     * Retrieves a complete list of positions in the organization.
     * 
     * @type {Object}
     */
    orgPositionList: {
        key: 'orgPositionList',
        noun: 'Position',
        display: {
            label: 'Get Positions',
            description: 'Get All Positions',
            hidden: false,
        },
        operation: {
            cleanInputData: false,
            inputFields: [
            ],
            outputFields: [
            ],
            perform: async (z, bundle) => {
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/position`,
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
                        throw new z.errors.Error('Positions not found. Please verify the organization ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionList', response.json);
                    return results;
                })
            },
            sample: samples['PositionSample']
        }
    },

    /**
     * Get Position by ID action.
     * Retrieves detailed information about a specific position.
     * 
     * @type {Object}
     */
    orgPositionRead: {
        key: 'orgPositionRead',
        noun: 'Position',
        display: {
            label: 'Get a Position',
            description: 'Get a Position Object by ID',
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
                ...Position.fields('', false),
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/position/${bundle.inputData.position_id}`,
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
                        throw new z.errors.Error('Positions not found. Please verify the position ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }

                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionRead', response.json);
                    return results;
                })
            },
            sample: samples['PositionByIdSample']
        }
    },
    /**
     * Update Position action.
     * Updates details of an existing position.
     * 
     * @type {Object}
     */
    orgPositionUpdate: {
        key: 'orgPositionUpdate',
        noun: 'Position',
        display: {
            label: 'Update Position by ID',
            description: 'Update/Partial-Update Position Object By ID',
            hidden: false,
        },
        operation: {
            cleanInputData: true,
            inputFields: [
                {
                    key: 'position_id',
                    label: 'Position',
                    type: 'string',
                    required: true,
                    dynamic: 'orgPositionAction.id.name',
                },
                ...Position.fields(),
            ],
            outputFields: [
                ...Position.fields('', false),
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/position/${bundle.inputData.position_id}`,
                    method: 'PUT',
                    removeMissingValuesFrom: { params: true, body: true },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    params: {
                    },
                    body: {
                        ...Position.mapping(bundle),
                    },
                }
                return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
                    if (response.status === 404) {
                        throw new z.errors.Error('Positions not found. Please verify the position ID.', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }
                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionUpdate', response.json);
                    return results;
                })
            },
            sample: samples['PositionCreateSample']
        }
    },

    //////////////////////////////////////////////////////////////////////
    // Commented out until questionaire stage can be fully handled.
    // can be done via API, but needs further validation for zapier UI. 
    //////////////////////////////////////////////////////////////////////    
    // orgPositionCreate: {
    //     key: 'orgPositionCreate',
    //     noun: 'Position',
    //     display: {
    //         label: '',
    //         description: 'Add Position Object',
    //         hidden: false,
    //     },
    //     operation: {
    //         cleanInputData: false,
    //         inputFields: [
    //             ...Position.fields(),
    //         ],
    //         outputFields: [
    //             ...Position.fields('', false),
    //         ],
    //         perform: async (z, bundle) => {
    //             const org_id = bundle.authData.org_id;
    //             const options = {
    //                 url: `${BASE_URL}/org/${bundle.authData.org_id}/position`,
    //                 method: 'POST',
    //                 removeMissingValuesFrom: { params: true, body: true },
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': 'application/json',
    //                 },
    //                 params: {
    //                 },
    //                 body: {
    //                     ...Position.mapping(bundle),
    //                 },
    //             }
    //             return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
    //                 if (response.status === 404) {
    //                     throw new z.errors.Error('Organization not found. Please verify the organization ID.', 'NotFound', 404);
    //                 }
    //                 if (response.status === 401) {
    //                     throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
    //                 }
    //                 response.throwForStatus();
    //                 const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionCreate', response.json);
    //                 return results;
    //             })
    //         },
    //         sample: samples['PositionCreateSample']
    //     }
    // },
    /**
     * Delete Position action.
     * Removes a position from the organization.
     * 
     * @type {Object}
     */
    // orgPositionDelete: {
    //     key: 'orgPositionDelete',
    //     noun: 'Position',
    //     display: {
    //         label: 'Delete a Position',
    //         description: 'Delete a Position Object by ID',
    //         hidden: false,
    //     },
    //     operation: {
    //         cleanInputData: false,
    //         inputFields: [
    //             {
    //                 key: 'position_id',
    //                 label: 'Position',
    //                 type: 'string',
    //                 required: true,
    //                 dynamic: 'orgPositionAction.id.name',
    //             },
    //         ],
    //         outputFields: [
    //         ],
    //         perform: async (z, bundle) => {
    //             const org_id = bundle.authData.org_id;
    //             const options = {
    //                 url: `${BASE_URL}/org/${bundle.authData.org_id}/position/${bundle.inputData.position_id}`,
    //                 method: 'DELETE',
    //                 removeMissingValuesFrom: { params: true, body: true },
    //                 headers: {
    //                     'Content-Type': '',
    //                     'Accept': '',
    //                 },
    //                 params: {},
    //                 body: {},
    //             };
    //             return z.request(utils.requestOptionsMiddleware(z, bundle, options)).then((response) => {
    //                 if (response.status === 404) {
    //                     throw new z.errors.Error('Positions not found. Please verify the position ID.', 'NotFound', 404);
    //                 }
    //                 if (response.status === 401) {
    //                     throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
    //                 }

    //                 // If 204, return a dummy object
    //                 if (response.status === 204 || !response.content) {
    //                     return { success: true };
    //                 }
    //                 response.throwForStatus();
    //                 const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionDelete', response.json);
    //                 return results || { success: true };
    //             });
    //         },
    //         sample: { success: true }
    //     }
    // },
}
