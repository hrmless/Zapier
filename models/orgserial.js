/**
 * @fileoverview Organization serializer model for HRMLESS Zapier integration.
 * Wraps Organization model for API serialization format.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const utils = require('../utils/utils');
const Organization = require('./Organization');

/**
 * Organization serializer model module.
 * Wraps Organization fields under an 'org' key to match API structure.
 * 
 * @type {Object}
 * @property {Function} fields - Returns wrapped organization field definitions
 * @property {Function} mapping - Maps bundle.inputData with 'org' wrapper
 */
module.exports = {
    /**
     * Generates wrapped field definitions for organization data.
     * Reuses Organization.fields() with 'org' prefix for API compatibility.
     * 
     * @param {string} [prefix=''] - Prefix to prepend to field keys
     * @param {boolean} [isInput=true] - Whether fields are for input or output
     * @param {boolean} [isArrayChild=false] - Whether fields are children of an array
     * @returns {Array<Object>} Array of wrapped organization field definitions
     */
    fields: (prefix = '', isInput = true, isArrayChild = false) => {
        const {keyPrefix, labelPrefix} = utils.buildKeyAndLabel(prefix, isInput, isArrayChild)
        return [
            ...Organization.fields(`${keyPrefix}org`, isInput),
        ]
    },
    /**
     * Maps input data with 'org' wrapper for API serialization.
     * 
     * @param {Object} bundle - Zapier bundle object
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped data with org wrapper, empty values removed
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'org': utils.removeIfEmpty(Organization.mapping(bundle, `${keyPrefix}org`)),
        }
    },
}
