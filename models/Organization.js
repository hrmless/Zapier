/**
 * @fileoverview Organization data model for HRMLESS Zapier integration.
 * Defines field schemas and data mapping for organization settings.
 * @author HRMLESS LLC
 * @version 1.0.1
 */

const utils = require('../utils/utils');

/**
 * Organization model module.
 * Provides field definitions and data mapping for organization settings.
 * 
 * @type {Object}
 * @property {Function} fields - Returns array of field definitions for Zapier forms
 * @property {Function} mapping - Maps bundle.inputData to API request format
 */
module.exports = {
    /**
     * Generates field definitions for organization data.
     * Includes org name, contact details, address, and calendar settings.
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
                key: `${keyPrefix}id`,
                label: `[${labelPrefix}id]`,
                type: 'string',
                ...(isInput && { helpText: "The unique identifier of the organization." }),
            },
            {
                key: `${keyPrefix}name`,
                label: `[${labelPrefix}name]`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The name of the organization." }),
            },
            {
                key: `${keyPrefix}contact_email`,
                label: `[${labelPrefix}contact_email]`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The contact email of the organization." }),
            },
            {
                key: `${keyPrefix}contact_phone`,
                label: `[${labelPrefix}contact_phone]`,
                required: true,
                type: 'string',
                ...(isInput && { helpText: "The contact phone number of the organization." }),
            },
            {
                key: `${keyPrefix}address`,
                label: `[${labelPrefix}address]`,
                type: 'string',
                ...(isInput && { helpText: "The address of the organization." }),
            },
            {
                key: `${keyPrefix}contact_name`,
                label: `[${labelPrefix}contact_name]`,
                type: 'string',
                ...(isInput && { helpText: "The contact name of the organization." }),
            },
            {
                key: `${keyPrefix}calendar_link`,
                label: `[${labelPrefix}calendar_link]`,
                type: 'string',
                ...(isInput && { helpText: "The default calendar link of the organization." }),
            },
        ]
    },
    /**
     * Maps input data from Zapier bundle to API request format for organization settings.
     * 
     * @param {Object} bundle - Zapier bundle object
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped organization data ready for API request
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'id': bundle.inputData?.[`${keyPrefix}id`],
            'name': bundle.inputData?.[`${keyPrefix}name`],
            'contact_email': bundle.inputData?.[`${keyPrefix}contact_email`],
            'contact_phone': bundle.inputData?.[`${keyPrefix}contact_phone`],
            'address': bundle.inputData?.[`${keyPrefix}address`],
            'is_active': bundle.inputData?.[`${keyPrefix}is_active`],
            'contact_name': bundle.inputData?.[`${keyPrefix}contact_name`],
            'calendar_link': bundle.inputData?.[`${keyPrefix}calendar_link`],
        }
    },
}
