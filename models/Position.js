/**
 * @fileoverview Position data model for HRMLESS Zapier integration.
 * Defines field schemas and data mapping for job position records.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const { min } = require('lodash');
const utils = require('../utils/utils');
const Questionnaire = require('./Questionnaire');

/**
 * Position model module.
 * Provides field definitions and data mapping for job position objects.
 * 
 * @type {Object}
 * @property {Function} fields - Returns array of field definitions for Zapier forms
 * @property {Function} mapping - Maps bundle.inputData to API request format
 */
module.exports = {
    /**
     * Generates field definitions for position data.
     * Includes position details like name, state, department, location, and scoring criteria.
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
                label: `Position name`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The name of the position." }),
            },
            {
                key: `${keyPrefix}state`,
                label: `Position state`,
                type: 'string',
                ...(isInput && { helpText: "The state of the position." }),
                ...(isInput ? { choices: ['active', 'draft', 'inactive'] } : {}),
            },
            {
                key: `${keyPrefix}department`,
                label: `Position department`,
                type: 'string',
                ...(isInput && { helpText: "The department for the position." }),
            },
            {
                key: `${keyPrefix}location`,
                label: `Position location`,
                type: 'string',
                ...(isInput && { helpText: "The location of the position." }),
            },
            {
                key: `${keyPrefix}min_score`,
                label: `Minimum passing`,
                type: 'integer',
                ...(isInput && { helpText: "The minimum passing score for the position (0-10)." }),
                ...(isInput && { default: '5' }),
            },
            {
                key: `${keyPrefix}role_description`,
                label: `Position role description`,
                type: 'string',
                ...(isInput && { helpText: "The role description of the position." }),
            },
            {
                key: `${keyPrefix}position_calender_link`,
                label: `Position calendar link`,
                type: 'string',
                ...(isInput && { helpText: "The calendar link of the position." }),
            },
            {
                key: `${keyPrefix}questionaire`,
                label: `Position questions`,
                children: Questionnaire.fields(`${keyPrefix}questionaire[]`, isInput, true),
            },
            ...(isInput ? [] : [
                {
                    key: `${keyPrefix}created_at`,
                    label: `[${labelPrefix}created_at]`,
                    type: 'string',
                },
                {
                    key: `${keyPrefix}updated_at`,
                    label: `[${labelPrefix}updated_at]`,
                    type: 'string',
                },
                {
                    key: `${keyPrefix}agent_id`,
                    label: `[${labelPrefix}agent_id]`,
                    type: 'string',
                },
            ]),
        ]
    },
    /**
     * Maps input data from Zapier bundle to API request format for positions.
     * 
     * @param {Object} bundle - Zapier bundle object
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped position data ready for API request
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'id': bundle.inputData?.[`${keyPrefix}id`],
            'name': bundle.inputData?.[`${keyPrefix}name`],
            'state': bundle.inputData?.[`${keyPrefix}state`],
            'department': bundle.inputData?.[`${keyPrefix}department`],
            'location': bundle.inputData?.[`${keyPrefix}location`],
            'min_score': bundle.inputData?.[`${keyPrefix}min_score`],
            'role_description': bundle.inputData?.[`${keyPrefix}role_description`],
            'position_calender_link': bundle.inputData?.[`${keyPrefix}position_calender_link`],
            'created_at': bundle.inputData?.[`${keyPrefix}created_at`],
            'updated_at': bundle.inputData?.[`${keyPrefix}updated_at`],
            'agent_id': bundle.inputData?.[`${keyPrefix}agent_id`],
            'questionaire': utils.childMapping(bundle.inputData?.[`${keyPrefix}questionaire`], `${keyPrefix}questionaire`, Questionnaire),
        }
    },
}
