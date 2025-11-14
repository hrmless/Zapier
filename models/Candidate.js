/**
 * @fileoverview Candidate data model for HRMLESS Zapier integration.
 * Defines field schemas and data mapping for candidate records.
 * @author HRMLESS LLC
 * @version 1.0.0
 */

const utils = require('../utils/utils');

/**
 * Candidate model module.
 * Provides field definitions and data mapping for candidate objects.
 * 
 * @type {Object}
 * @property {Function} fields - Returns array of field definitions for Zapier forms
 * @property {Function} mapping - Maps bundle.inputData to API request format
 */
module.exports = {
    /**
     * Generates field definitions for candidate data.
     * Used to define input/output fields in Zapier actions.
     * 
     * @param {string} [prefix=''] - Prefix to prepend to field keys (for nested fields)
     * @param {boolean} [isInput=true] - Whether fields are for input (true) or output (false)
     * @param {boolean} [isArrayChild=false] - Whether fields are children of an array
     * @returns {Array<Object>} Array of field definition objects
     */
    fields: (prefix = '', isInput = true, isArrayChild = false) => {
        const {keyPrefix, labelPrefix} = utils.buildKeyAndLabel(prefix, isInput, isArrayChild)
        return [
            {
                key: `${keyPrefix}id`,
                label: `ID`,
                type: 'string',
            },
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
                key: `${keyPrefix}state`,
                label: `Candidate state`,
                ...(isInput && { helpText: "The current state of the candidate in the interview process." }),
                type: 'string',
                ...(isInput && {
                    choices: [
                        'not_invited_yet',
                        'invited',
                        'attempted',
                        'completed',
                        'rejected',
                        'graded',
                        'passed',
                        'calendar_link_sent',
                    ],
                }),
            },
            {
                key: `${keyPrefix}score`,
                label: `Candidate score`,
                ...(isInput && { helpText: "The score of the candidate's interview" }),
                type: 'integer',
            },
            {
                key: `${keyPrefix}feedback`,
                label: `Candidate feedback`,
                type: 'string',
                ...(isInput && { helpText: "Feedback provided for the candidate by HRMLESS AI." }),
            },
            {
                key: `${keyPrefix}language`,
                label: `Candidate language`,
                required: true,
                type: 'string',
                ...(isInput && { default: 'en' }),
                ...(isInput && { helpText: "The language preference of the candidate. (e.g. 'en' for English)" }),
            },
            {
                key: `${keyPrefix}invited_at`,
                label: `[${labelPrefix}invited_at]`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The timestamp when the candidate was invited." }),
            },
            {
                key: `${keyPrefix}completed_at`,
                label: `[${labelPrefix}completed_at]`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The timestamp when the candidate completed the interview." }),
            },
            {
                key: `${keyPrefix}created_at`,
                label: `[${labelPrefix}created_at]`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The timestamp when the candidate record was created." }),
            },
            {
                key: `${keyPrefix}updated_at`,
                label: `[${labelPrefix}updated_at]`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The timestamp when the candidate record was last updated." }),
            },
            {
                key: `${keyPrefix}position_id`,
                label: `[${labelPrefix}position_id]`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The ID of the position the candidate is applied for." }),
            },
            {
                key: `${keyPrefix}organization_id`,
                label: `[${labelPrefix}organization_id]`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The ID of the organization the candidate belongs to." }),
            },
        ]
    },
    /**
     * Maps input data from Zapier bundle to API request format.
     * Transforms field names and structures data for HRMLESS API.
     * 
     * @param {Object} bundle - Zapier bundle object containing input data
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped candidate data ready for API request
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'id': bundle.inputData?.[`${keyPrefix}id`],
            'name': bundle.inputData?.[`${keyPrefix}name`],
            'email': bundle.inputData?.[`${keyPrefix}email`],
            'phone': bundle.inputData?.[`${keyPrefix}phone`],
            'state': bundle.inputData?.[`${keyPrefix}state`],
            'score': bundle.inputData?.[`${keyPrefix}score`],
            'feedback': bundle.inputData?.[`${keyPrefix}feedback`],
            'language': bundle.inputData?.[`${keyPrefix}language`],
            'invited_at': bundle.inputData?.[`${keyPrefix}invited_at`],
            'completed_at': bundle.inputData?.[`${keyPrefix}completed_at`],
            'created_at': bundle.inputData?.[`${keyPrefix}created_at`],
            'updated_at': bundle.inputData?.[`${keyPrefix}updated_at`],
            'position_id': bundle.inputData?.[`${keyPrefix}position_id`],
            'organization_id': bundle.inputData?.[`${keyPrefix}organization_id`],
        }
    },
}
