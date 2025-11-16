/**
 * @fileoverview CandidateCreate data model for HRMLESS Zapier integration.
 * Defines minimal field schema for creating new candidates.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const utils = require('../utils/utils');

/**
 * CandidateCreate model module.
 * Provides field definitions for creating new candidates (simplified from full Candidate model).
 * 
 * @type {Object}
 * @property {Function} fields - Returns array of field definitions for creating candidates
 * @property {Function} mapping - Maps bundle.inputData to API request format
 */
module.exports = {
    /**
     * Generates field definitions for creating a candidate.
     * Includes only required fields: name, email, phone, and language.
     * 
     * @param {string} [prefix=''] - Prefix to prepend to field keys
     * @param {boolean} [isInput=true] - Whether fields are for input or output
     * @param {boolean} [isArrayChild=false] - Whether fields are children of an array
     * @returns {Array<Object>} Array of field definition objects
     */
    fields: (prefix = '', isInput = true, isArrayChild = false) => {
        const {keyPrefix, labelPrefix} = utils.buildKeyAndLabel(prefix, isInput, isArrayChild)
        return [
            {
                key: `${keyPrefix}name`,
                label: `Candidate name`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The full name of the candidate. (e.g. 'John Doe')" }),
            },
            {
                key: `${keyPrefix}email`,
                label: `Candidate email`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The email address of the candidate. (e.g. 'john.doe@example.com')" }),
            },
            {
                key: `${keyPrefix}phone`,
                label: `Candidate phone`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The phone number of the candidate. (e.g. '+1234567890')" }),
            },
            {
                key: `${keyPrefix}language`,
                label: `Candidate language`,
                required: true,
                type: 'string',
                ...(isInput && { default: 'en' }),
                ...(isInput && { helpText: "The language preference of the candidate. (e.g. 'en' for English)" }),
            },
        ]
    },
    /**
     * Maps input data from Zapier bundle to API request format for candidate creation.
     * 
     * @param {Object} bundle - Zapier bundle object
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped candidate data for creation request
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'name': bundle.inputData?.[`${keyPrefix}name`],
            'email': bundle.inputData?.[`${keyPrefix}email`],
            'phone': bundle.inputData?.[`${keyPrefix}phone`],
            'language': bundle.inputData?.[`${keyPrefix}language`],
        }
    },
}
