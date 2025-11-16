/**
 * @fileoverview Questionnaire data model for HRMLESS Zapier integration.
 * Defines field schemas for interview questions (currently not actively used).
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const utils = require('../utils/utils');

/**
 * Questionnaire model module.
 * Provides field definitions for interview questions.
 * Note: Currently commented out in Position model pending UI validation.
 * 
 * @type {Object}
 * @property {Function} fields - Returns array of field definitions for questions
 * @property {Function} mapping - Maps bundle.inputData to API request format
 */
module.exports = {
    /**
     * Generates field definitions for questionnaire items.
     * Each question has an optional name and the question text itself.
     * 
     * @param {string} [prefix=''] - Prefix to prepend to field keys
     * @param {boolean} [isInput=true] - Whether fields are for input or output
     * @param {boolean} [isArrayChild=false] - Whether fields are children of an array
     * @returns {Array<Object>} Array of field definition objects
     */
    fields: (prefix = '', isInput = true, isArrayChild = false) => {
        const {keyPrefix, labelPrefix} = utils.buildKeyAndLabel(prefix, isInput, isArrayChild)
        return [
            ...(isInput ? [] : [
                {
                    key: `${keyPrefix}id`,
                    label: `[${labelPrefix}id]`,
                    type: 'string',
                },
            ]),
            {
                key: `${keyPrefix}name`,
                label: `Question name`,
                ...(isInput && { helpText: "A short name to identify the question. (e.g. 'Question 1')" }),
                required: false,
                type: 'string',
            },
            {
                key: `${keyPrefix}value`,
                label: `Question`,
                ...(isInput && { helpText: "The text of the question being asked. (e.g. 'What is your greatest strength?')" }),
                required: false,
                type: 'string',
            },
        ]
    },
    /**
     * Maps input data from Zapier bundle to API request format for questions.
     * 
     * @param {Object} bundle - Zapier bundle object
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped questionnaire data
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'id': bundle.inputData?.[`${keyPrefix}id`],
            'name': bundle.inputData?.[`${keyPrefix}name`],
            'value': bundle.inputData?.[`${keyPrefix}value`],
        }
    },
}
