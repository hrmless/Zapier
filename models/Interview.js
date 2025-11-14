/**
 * @fileoverview Interview data model for HRMLESS Zapier integration.
 * Defines field schemas and data mapping for candidate interview records.
 * @author HRMLESS LLC
 * @version 1.0.0
 */

const utils = require('../utils/utils');

/**
 * Interview model module.
 * Provides field definitions and data mapping for interview objects.
 * 
 * @type {Object}
 * @property {Function} fields - Returns array of field definitions for Zapier forms
 * @property {Function} mapping - Maps bundle.inputData to API request format
 */
module.exports = {
    /**
     * Generates field definitions for interview data.
     * Includes interview links, transcripts, recordings, scores, feedback, and timing information.
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
                ...(isInput && { helpText: "The unique identifier of the interview." }),
            },
            {
                key: `${keyPrefix}conversation_id`,
                label: `Conversation ID`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The unique identifier of the conversation associated with the interview." }),
            },
            {
                key: `${keyPrefix}transcript_link`,
                label: `Transcript link`,
                type: 'string',
                ...(isInput && { helpText: "The link to the transcript of the interview." }),
            },
            {
                key: `${keyPrefix}recording_link`,
                label: `Recording link`,
                type: 'string',
                ...(isInput && { helpText: "The link to the recording of the interview." }),
            },
            {
                key: `${keyPrefix}start_time`,
                label: `Start time`,
                type: 'string',
                ...(isInput && { helpText: "The start time of the interview." }),
            },
            {
                key: `${keyPrefix}end_time`,
                label: `End time`,
                type: 'string',
                ...(isInput && { helpText: "The end time of the interview." }),
            },
            {
                key: `${keyPrefix}graded_at`,
                label: `Graded at`,
                type: 'string',
                ...(isInput && { helpText: "The time when the interview was graded." }),
            },
            {
                key: `${keyPrefix}last_attempted_at`,
                label: `Last attempted at`,
                type: 'string',
                ...(isInput && { helpText: "The time when the interview was last attempted." }),
            },
            {
                key: `${keyPrefix}ip_address`,
                label: `IP address`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The IP address from which the interview was conducted (used for GEO load balancing)." }),
            },
            {
                key: `${keyPrefix}location`,
                label: `Location`,
                type: 'string',
                ...(isInput && { helpText: "INTERNAL USE: The general location where the interview took place (used for GEO load balancing)." }),
            },
            {
                key: `${keyPrefix}interview_link`,
                label: `Interview link`,
                type: 'string',
                ...(isInput && { helpText: "The link to the interview." }),
            },
            {
                key: `${keyPrefix}status`,
                label: `Status`,
                type: 'string',
                ...(isInput && { helpText: "The status of the interview." }),
            },
            {
                key: `${keyPrefix}score`,
                label: `Score`,
                type: 'integer',
                ...(isInput && { helpText: "The score of the interview." }),
            },
            {
                key: `${keyPrefix}feedback`,
                label: `Feedback`,
                type: 'string',
                ...(isInput && { helpText: "The feedback for the interview." }),
            },
            {
                key: `${keyPrefix}interview_transcript`,
                label: `Interview transcript`,
                type: 'string',
                ...(isInput && { helpText: "The transcript of the interview." }),
            },
            {
                key: `${keyPrefix}candidate`,
                label: `Candidate ID`,
                type: 'string',
                ...(isInput && { helpText: "The unique identifier of the candidate associated with the interview." }),
            },
        ]
    },
    /**
     * Maps input data from Zapier bundle to API request format for interviews.
     * 
     * @param {Object} bundle - Zapier bundle object
     * @param {Object} bundle.inputData - User input from Zapier form
     * @param {string} [prefix=''] - Prefix for nested field keys
     * @returns {Object} Mapped interview data ready for API request
     */
    mapping: (bundle, prefix = '') => {
        const {keyPrefix} = utils.buildKeyAndLabel(prefix)
        return {
            'id': bundle.inputData?.[`${keyPrefix}id`],
            'conversation_id': bundle.inputData?.[`${keyPrefix}conversation_id`],
            'transcript_link': bundle.inputData?.[`${keyPrefix}transcript_link`],
            'recording_link': bundle.inputData?.[`${keyPrefix}recording_link`],
            'start_time': bundle.inputData?.[`${keyPrefix}start_time`],
            'end_time': bundle.inputData?.[`${keyPrefix}end_time`],
            'graded_at': bundle.inputData?.[`${keyPrefix}graded_at`],
            'last_attempted_at': bundle.inputData?.[`${keyPrefix}last_attempted_at`],
            'ip_address': bundle.inputData?.[`${keyPrefix}ip_address`],
            'location': bundle.inputData?.[`${keyPrefix}location`],
            'interview_link': bundle.inputData?.[`${keyPrefix}interview_link`],
            'status': bundle.inputData?.[`${keyPrefix}status`],
            'score': bundle.inputData?.[`${keyPrefix}score`],
            'feedback': bundle.inputData?.[`${keyPrefix}feedback`],
            'interview_transcript': bundle.inputData?.[`${keyPrefix}interview_transcript`],
            'candidate': bundle.inputData?.[`${keyPrefix}candidate`],
        }
    },
}
