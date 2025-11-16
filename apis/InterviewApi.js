/**
 * @fileoverview Interview API operations for HRMLESS Zapier integration.
 * Handles retrieval of interview details for candidates.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const samples = require('../samples/InterviewApi');
const utils = require('../utils/utils');
const interview = require('../models/Interview');
const BASE_URL = process.env.BASE_URL;


/**
 * Interview API operations module.
 * Contains all Zapier actions for accessing candidate interview data.
 * 
 * @type {Object}
 * @property {Object} orgPositionsCandidatesInterview - Get candidate interview details
 */
module.exports = {
    /**
     * Get Candidate Interview Details action.
     * Retrieves interview information including transcript, recording, and scores.
     * 
     * @type {Object}
     */
    orgPositionsCandidatesInterview: {
        key: 'orgPositionsCandidatesInterview',
        noun: 'Candidates',
        display: {
            label: 'Get Interview Details',
            description: 'Get interview details for a candidate',
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
                ...interview.fields('', false),
            ],
            perform: async (z, bundle) => {
                const org_id = bundle.authData.org_id;
                const options = {
                    url: `${BASE_URL}/org/${bundle.authData.org_id}/positions/${bundle.inputData.position_id}/candidates/${bundle.inputData.candidate_id}/interview/`,
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
                        throw new z.errors.Error('Candidate not found. Please verify the position ID and Candidate ID', 'NotFound', 404);
                    }
                    if (response.status === 401) {
                        throw new z.errors.Error('Unauthorized. Please verify your organization ID and OAUTH credentials.', 'Unauthorized', 401);
                    }

                    response.throwForStatus();
                    const results = utils.responseOptionsMiddleware(z, bundle, 'orgPositionsCandidatesInterviewList', response.json);
                    // API returns an array with one candidate, extract the first item
                    return Array.isArray(results) && results.length > 0 ? results[0] : [results];
                })
            },
            sample: samples['InterviewSample']
        }
    },
}
