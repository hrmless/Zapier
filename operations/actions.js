/**
 * @fileoverview Action definitions and categorization for HRMLESS Zapier integration.
 * Organizes API operations into searches, creates, and triggers for Zapier.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const CandidatesApi = require('../apis/CandidatesApi');
const InterviewApi = require('../apis/InterviewApi');
const PositionApi = require('../apis/PositionApi');
const { triggerMiddleware, isTrigger, searchMiddleware, hasSearchRequisites, isSearchAction, isCreateAction, createMiddleware } = require('../utils/utils');

/**
 * Master actions object containing all available operations in the integration.
 * Each action is categorized and exported through helper functions below.
 * 
 * Actions include:
 * - Position management (list, read, update, delete)
 * - Candidate management (create, read, update, delete, list)
 * - Organization settings (read, update)
 * - Interview details (read)
 * 
 * @type {Object<string, Object>}
 */
const actions = {
    
    // orgPositionAction is used for dynamic dropdowns and registered as a search
    [PositionApi.orgPositionAction.key]: PositionApi.orgPositionAction,


    [PositionApi.orgPositionRead.key]: {
        ...PositionApi.orgPositionRead,
        display: {
            label: 'Get a Position',
            description: 'Gets a single position by its ID.',
        },
    },


    [CandidatesApi.orgPositionsRead.key]: {
        ...CandidatesApi.orgPositionsRead,
        display: {
            label: 'Get All Candidates in a Position',
            description: 'Gets a list of candidates for a specific position.',
        },
    },
    [CandidatesApi.orgPositionsCreate.key]: {
        ...CandidatesApi.orgPositionsCreate,
        display: {
            label: 'Create a Candidate',
            description: 'Create/Add a new candidate to a position.',
        },
    },

    [CandidatesApi.orgPositionsCandidatesRead.key]: {
        ...CandidatesApi.orgPositionsCandidatesRead,
        display: {
            label: 'Get a Candidates Details',
            description: 'Gets details of a specific candidate by their ID.',
        },
    },

    [CandidatesApi.orgPositionsCandidatesUpdate.key]: {
        ...CandidatesApi.orgPositionsCandidatesUpdate,
        display: {
            label: 'Update a Candidate',
            description: 'Updates details of a specific candidate by their ID.',
        },
    },

    [CandidatesApi.orgPositionsCandidatesDelete.key]: {
        ...CandidatesApi.orgPositionsCandidatesDelete,
        display: {
            label: 'Delete a Candidate',
            description: 'Deletes a specific candidate by their ID.',
        },
    },

    [InterviewApi.orgPositionsCandidatesInterview.key]: {
        ...InterviewApi.orgPositionsCandidatesInterview,
        display: {
            label: 'Get Interview Details',
            description: 'Gets interview details for a specific candidate.',
        },
    },

}

/**
 * Module exports containing action categorization functions.
 * These functions filter and transform actions into appropriate Zapier operation types.
 * 
 * @type {Object}
 * @property {Function} searchActions - Returns all search-type actions
 * @property {Function} createActions - Returns all create/update-type actions
 * @property {Function} triggers - Returns all trigger-type actions (for dynamic dropdowns)
 */
module.exports = {
    /**
     * Filters and returns all search actions.
     * Search actions are used to find existing records by ID or other criteria.
     * 
     * @returns {Object<string, Object>} Object containing all search actions with middleware applied
     */
    searchActions: () => Object.entries(actions).reduce((actions, [key, value]) => isSearchAction(key) && hasSearchRequisites(value) ? {...actions, [key]: searchMiddleware(value)} : actions, {}),
    
    /**
     * Filters and returns all create/update actions.
     * Create actions are used to create new records or update existing ones.
     * 
     * @returns {Object<string, Object>} Object containing all create/update actions with middleware applied
     */
    createActions: () => Object.entries(actions).reduce((actions, [key, value]) => isCreateAction(key) ? {...actions, [key]: createMiddleware(value)} : actions, {}),
    
    /**
     * Filters and returns all trigger actions.
     * Triggers are used for dynamic dropdowns and polling for new data.
     * 
     * @returns {Object<string, Object>} Object containing all trigger actions with middleware applied
     */
    triggers: () => Object.entries(actions).reduce((actions, [key, value]) => isTrigger(key) ? {...actions, [key]: triggerMiddleware(value)} : actions, {}),
}
