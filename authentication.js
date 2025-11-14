/**
 * @fileoverview OAuth2 authentication configuration for HRMLESS Zapier integration.
 * Handles OAuth2 flow, token management, and authorization for API requests.
 * @author HRMLESS LLC
 * @version 1.0.0
 */

const BASE_URL = process.env.BASE_URL;
const BASE_LOGIN_URL = process.env.BASE_LOGIN_URL;

/**
 * Middleware function that runs before every outbound request to add the Bearer token.
 * This ensures all API requests are properly authenticated.
 * 
 * @param {Object} request - The HTTP request object to be modified
 * @param {Object} z - The Zapier platform object
 * @param {Object} bundle - The bundle object containing authData and other context
 * @param {Object} bundle.authData - Authentication data containing access_token
 * @param {string} bundle.authData.access_token - OAuth2 access token
 * @returns {Object} The modified request object with Authorization header
 */
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
};

/**
 * Test function to verify the OAuth2 connection works.
 * Called after authentication to ensure credentials are valid.
 * 
 * @param {Object} z - The Zapier platform object
 * @param {Object} bundle - The bundle object containing authData
 * @param {Object} bundle.authData - Authentication data with access_token
 * @returns {Promise<Object>} Organization data if authentication succeeds
 * @throws {Error} If authentication test fails
 */
const test = async (z, bundle) => {
  try {
    // By the time test runs, Zapier has already exchanged the code for tokens
    // and populated bundle.authData.access_token
    const response = await z.request({
      url: `${BASE_URL}/org_id`,
    });
    
    return response.data;
  } catch (error) {
    z.console.log('Auth test failed:', error);
    z.console.log('Error details:', JSON.stringify(error, null, 2));
    throw new z.errors.Error('Authentication test failed: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Custom function to handle the OAuth2 authorization code exchange for access tokens.
 * This allows us to add extra data like org_id to authData for use throughout the integration.
 * 
 * @param {Object} z - The Zapier platform object
 * @param {Object} bundle - The bundle object containing OAuth2 authorization data
 * @param {Object} bundle.inputData - Input data from OAuth2 flow
 * @param {string} bundle.inputData.code - Authorization code from OAuth2 provider
 * @param {string} bundle.inputData.redirect_uri - Redirect URI for OAuth2 flow
 * @param {string} bundle.inputData.code_verifier - PKCE code verifier for enhanced security
 * @returns {Promise<Object>} Object containing access_token, refresh_token, and org_id
 * @returns {string} return.access_token - OAuth2 access token for API requests
 * @returns {string} return.refresh_token - OAuth2 refresh token for token renewal
 * @returns {string} [return.org_id] - Organization ID for the authenticated user
 */
const getAccessToken = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${BASE_LOGIN_URL}/realms/nervai/protocol/openid-connect/token`,
    body: {
      code: bundle.inputData.code,
      client_id: 'zapier',
      redirect_uri: bundle.inputData.redirect_uri,
      grant_type: 'authorization_code',
      code_verifier: bundle.inputData.code_verifier,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Fetch org_id and add it to authData
  try {
    const orgResponse = await z.request({
      url: `${BASE_URL}/org_id`,
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      org_id: orgResponse.data.org_id,
    };
  } catch (e) {
    // If org_id fetch fails, still return the tokens
    z.console.log('Warning: Could not fetch org_id:', e.message);
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  }
};

/**
 * Custom function to refresh the OAuth2 access token when it expires.
 * Uses the refresh token to obtain a new access token without requiring user re-authentication.
 * 
 * @param {Object} z - The Zapier platform object
 * @param {Object} bundle - The bundle object containing authData
 * @param {Object} bundle.authData - Authentication data
 * @param {string} bundle.authData.refresh_token - OAuth2 refresh token
 * @returns {Promise<Object>} Object containing new access_token and refresh_token
 * @returns {string} return.access_token - New OAuth2 access token
 * @returns {string} return.refresh_token - New OAuth2 refresh token
 */
const refreshAccessToken = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${BASE_LOGIN_URL}/realms/nervai/protocol/openid-connect/token`,
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: 'zapier',
      grant_type: 'refresh_token',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};

/**
 * OAuth2 authentication configuration object for HRMLESS integration.
 * Configures the complete OAuth2 flow including authorization, token exchange, and refresh.
 * 
 * @type {Object}
 * @property {string} type - Authentication type (oauth2)
 * @property {Function} test - Test function to verify authentication
 * @property {string} connectionLabel - Label shown in Zapier UI for the connection
 * @property {Object} oauth2Config - OAuth2 configuration settings
 * @property {Object} oauth2Config.authorizeUrl - Authorization endpoint configuration
 * @property {Function} oauth2Config.getAccessToken - Function to exchange code for tokens
 * @property {Function} oauth2Config.refreshAccessToken - Function to refresh expired tokens
 * @property {boolean} oauth2Config.autoRefresh - Whether to automatically refresh tokens
 * @property {string} oauth2Config.scope - OAuth2 scopes requested
 * @property {boolean} oauth2Config.enablePkce - Whether to use PKCE for enhanced security
 */
const authentication = {
  type: 'oauth2',
  test,
  connectionLabel: 'HRMLESS Account ({{bundle.authData.org_id}})',
  oauth2Config: {
    authorizeUrl: {
      method: 'GET',
      url: `${BASE_LOGIN_URL}/realms/nervai/protocol/openid-connect/auth`,
      params: {
        client_id: 'zapier',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken,
    refreshAccessToken,
    autoRefresh: true,
    scope: 'openid profile email',
    enablePkce: true,
  },
};

/**
 * Module exports containing authentication configuration and middleware.
 * 
 * @type {Object}
 * @property {Object} config - The authentication configuration object
 * @property {Array<Function>} befores - Array of middleware functions to run before requests
 * @property {Array<Function>} afters - Array of middleware functions to run after responses
 */
module.exports = {
  config: authentication,
  befores: [includeBearerToken],
  afters: [],
};