/**
 * @fileoverview Utility functions for HRMLESS Zapier integration.
 * Provides helper functions for data transformation, action categorization, and field mapping.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const _ = require('lodash')

/**
 * Replaces path parameters in a URL template with Zapier bundle references.
 * Converts URL patterns like `/org/{org_id}/position/{position_id}` 
 * to `/org/{{bundle.inputData.org_id}}/position/{{bundle.inputData.position_id}}`
 * 
 * @param {string} url - URL template with path parameters in {paramName} format
 * @returns {string} URL with parameters replaced by Zapier bundle references
 * @example
 * replacePathParameters('/org/{org_id}/position/{id}')
 * // Returns: '/org/{{bundle.inputData.org_id}}/position/{{bundle.inputData.id}}'
 */
const replacePathParameters = (url) => url.replace(/{([^{}]+)}/g, (keyExpr, key) => `{{bundle.inputData.${key}}}`)

/**
 * Maps an array of objects using a model's mapping function.
 * Used for transforming nested arrays of data according to model schemas.
 * 
 * @param {Array<Object>} objectsArray - Array of objects to map
 * @param {string} prefix - Prefix to prepend to field keys
 * @param {Object} model - Model object with a mapping method
 * @returns {Array<Object>|undefined} Mapped array or undefined if input is falsy
 */
const childMapping = (objectsArray, prefix, model) => objectsArray ? objectsArray.map(object => model.mapping({inputData: object}, prefix)) : undefined

/**
 * Removes an object if it's empty after JSON stringification.
 * Useful for cleaning up request bodies and removing undefined/null values.
 * 
 * @param {Object} obj - Object to check
 * @returns {Object|undefined} The object if not empty, undefined otherwise
 */
const removeIfEmpty = (obj) => _.isEmpty(JSON.parse(JSON.stringify(obj))) ? undefined : obj

/**
 * Builds key and label prefixes for form fields.
 * Handles nested field naming conventions for both input and output fields.
 * 
 * @param {string} prefix - The prefix to build upon
 * @param {boolean} [isInput=true] - Whether this is for an input field
 * @param {boolean} [isArrayChild=false] - Whether this field is within an array
 * @returns {Object} Object with keyPrefix and labelPrefix properties
 * @returns {string} return.keyPrefix - Prefix for the field key
 * @returns {string} return.labelPrefix - Prefix for the field label
 */
const buildKeyAndLabel = (prefix, isInput = true, isArrayChild = false) => {
    const keyPrefix = !_.isEmpty(prefix) && (!isArrayChild || isInput) ? `${prefix}${isInput ? '.' : '__'}` : prefix
    const labelPrefix = !_.isEmpty(keyPrefix) ? keyPrefix.replaceAll('__', '.') : ''
    return {
        keyPrefix: keyPrefix,
        labelPrefix: labelPrefix,
    }
}

/**
 * Array of action keys that should be categorized as search actions.
 * Search actions are used to find existing records in Zapier.
 * 
 * @constant {Array<string>}
 */
const SEARCH_ACTION_KEYS = [
    'orgPositionRead',              // Find Position by ID
    'orgPositionsRead',             // Find Candidates in a Position
    'orgPositionsCandidatesRead',   // Find Candidate by ID
    'orgPositionsCandidatesInterview' // Find Candidate Interview Details
];

/**
 * Array of action keys that should be categorized as trigger actions.
 * Triggers are used for dynamic dropdowns in Zapier.
 * 
 * @constant {Array<string>}
 */
const TRIGGER_ACTION_KEYS = ['orgPositionAction'];

/**
 * Checks if an action key corresponds to a search action.
 * 
 * @param {string} key - The action key to check
 * @returns {boolean} True if the key is a search action, false otherwise
 */
const isSearchAction = (key) => SEARCH_ACTION_KEYS.includes(key);

/**
 * Checks if an action has at least one input field (required for search actions).
 * 
 * @param {Object} action - The action object to check
 * @param {Object} action.operation - The operation configuration
 * @param {Array} action.operation.inputFields - Array of input field definitions
 * @returns {boolean} True if action has input fields, false otherwise
 */
const hasASearchField = action => action.operation.inputFields.length > 0

/**
 * Checks if an action returns an array of objects (has children in output fields).
 * 
 * @param {Object} action - The action object to check
 * @param {Object} action.operation - The operation configuration
 * @param {Array} action.operation.outputFields - Array of output field definitions
 * @returns {boolean} True if action returns objects with children, false otherwise
 */
const returnsObjectsArray = action => !!action.operation.outputFields.find(field => 'children' in field)

/**
 * Checks if an action has the required fields to be used as a search action.
 * 
 * @param {Object} action - The action object to validate
 * @returns {boolean} True if action meets search requirements, false otherwise
 */
const hasSearchRequisites = action => hasASearchField(action);

/**
 * Middleware function for search actions.
 * Currently passes actions through unchanged but provides extension point for future customization.
 * 
 * @param {Object} action - The search action to process
 * @returns {Object} The action object (unmodified)
 */
const searchMiddleware = (action) => {
    // No custom transformation required
    // Passed through as-is
    return action
}

/**
 * Checks if an action key corresponds to a create/update action.
 * Create actions are those that aren't search actions or triggers.
 * 
 * @param {string} key - The action key to check
 * @returns {boolean} True if the key is a create action, false otherwise
 */
const isCreateAction = (key) => {
    return !isSearchAction(key) && !isTrigger(key);
}

/**
 * Middleware function for create/update actions.
 * Currently passes actions through unchanged but provides extension point for future customization.
 * 
 * @param {Object} action - The create action to process
 * @returns {Object} The action object (unmodified)
 */
const createMiddleware = (action) => {
    // No custom transformation required
    // Passed through as-is
    return action
}

/**
 * Checks if an action key corresponds to a trigger action.
 * 
 * @param {string} key - The action key to check
 * @returns {boolean} True if the key is a trigger action, false otherwise
 */
const isTrigger = (key) => {
    return TRIGGER_ACTION_KEYS.includes(key);
}

/**
 * Middleware function for trigger actions.
 * Currently passes actions through unchanged but provides extension point for future customization.
 * 
 * @param {Object} action - The trigger action to process
 * @returns {Object} The action object (unmodified)
 */
const triggerMiddleware = (action) => {
    // No custom transformation required
    // Passed through as-is
    return action
}

/**
 * Middleware to transform request options before sending.
 * Provides extension point for custom request transformations.
 * 
 * @param {Object} z - The Zapier platform object
 * @param {Object} bundle - The bundle object containing request context
 * @param {Object} requestOptions - The request options to transform
 * @returns {Object} The request options (currently unmodified)
 */
const requestOptionsMiddleware = (z, bundle, requestOptions) => {
    // No custom transformation required
    // Passed through as-is
  return requestOptions
}

/**
 * Middleware to transform response data after receiving.
 * Provides extension point for custom response transformations.
 * 
 * @param {Object} z - The Zapier platform object
 * @param {Object} bundle - The bundle object containing request context
 * @param {string} key - The action key that generated this response
 * @param {Object} json - The JSON response data
 * @returns {Object} The response data (currently unmodified)
 */
const responseOptionsMiddleware = (z, bundle, key, json) => {
    // No custom transformation required
    // Passed through as-is
  return json
}

module.exports = {
    replacePathParameters: replacePathParameters,
    childMapping: childMapping,
    removeIfEmpty: removeIfEmpty,
    buildKeyAndLabel: buildKeyAndLabel,
    hasSearchRequisites: hasSearchRequisites,
    isSearchAction: isSearchAction,
    searchMiddleware: searchMiddleware,
    requestOptionsMiddleware: requestOptionsMiddleware,
    responseOptionsMiddleware: responseOptionsMiddleware,
    isTrigger: isTrigger,
    triggerMiddleware: triggerMiddleware,
    isCreateAction: isCreateAction,
    createMiddleware: createMiddleware,
}
