# HRMLESS Zapier Integration
![HRMLESS Logo](./img/logo-micro-120x120.png)

**Version:** 1.0.0  
**Platform:** Zapier Platform v18.0.1  
**Author:** HRMLESS LLC  
**Support:** contactus@hrmless.com

## Overview

The HRMLESS Zapier integration enables seamless automation of your AI-powered recruitment workflow. Connect HRMLESS with 5,000+ apps to streamline candidate management, position creation, interview tracking, and organizational settings—all without writing a single line of code.

HRMLESS revolutionizes hiring with AI-driven candidate screening and interview automation. This integration allows you to build powerful workflows that sync candidate data, and keep your recruiting pipeline connected to your favorite tools.

### What is HRMLESS?

HRMLESS is an AI-powered Human Resources Management platform that automates the entire candidate screening and interview process. With intelligent conversational AI, automated scoring, and integrations into your existing ATS, HRMLESS is helping organizations find the right resources faster with little impact to existing workflows. 

## Documentation
All Documentation for this zapier integration can be found at: https://docs.hrmless.com/developer/zapier

---

## 📚 Resources
- [HRMLESS Documentation](https://docs.hrmless.com)
- [Zapier CLI Documentation](https://docs.zapier.com/platform/build-cli/overview)

---

## Development

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/hrmless/nervai-zapier.git
cd nervai-zapier/integration

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your configuration

# Required environment variables:
# BASE_URL=https://nervai.hrmless.com/api/v1
# BASE_LOGIN_URL=https://login.hrmless.com
# CLIENT_ID=zapier
```

### Testing

```bash
# Run all tests
npm test

# Test authentication
zapier test --debug

# Test specific action
zapier test --action=orgPositionsList

# Validate integration
zapier validate
```

### Deployment

```bash
# Build integration
zapier build

# Push to Zapier
zapier push

# Promote to production
zapier promote 1.0.0
```

### Project Structure

```
integration/
├── apis/
│   ├── CandidatesApi.js      # Candidate operations
│   ├── InterviewApi.js        # Interview operations
│   ├── OrganizationApi.js     # Organization operations
│   └── PositionApi.js         # Position operations
├── models/
│   ├── Candidate.js           # Candidate data model
│   ├── CandidateCreate.js     # Candidate create data model
│   ├── CandidateUpdate.js     # Candidate update data model
│   ├── Position.js            # Position data model
│   ├── Questionaire.js        # Questionaire data model
│   ├── Interview.js           # Interview data model
│   ├── orgserial.js           # Organization update data model
│   └── Organization.js        # Organization data model
├── operations/
│   └── actions.js             # Action routing and middleware
├── samples/
│   ├── CandidatesApi.js       # Sample candidate data
│   ├── PositionApi.js         # Sample position data
│   └── OrganizationApi.js     # Sample organization data
├── utils/
│   └── utils.js               # Helper functions
├── authentication.js           # Authentication configuration
├── definition.json            # App definition (generated)
├── index.js                   # Main entry point
└── package.json               # Dependencies
```

### Key Files

**`index.js`**: Main integration file that registers authentication, actions, and triggers.

**`authentication.js`**: Session-based OAuth implementation with automatic token refresh.

**`operations/actions.js`**: Routes actions to appropriate API handlers and applies middleware.

**`utils/utils.js`**: Helper functions for request/response handling and data transformation.

---