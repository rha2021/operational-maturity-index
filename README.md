# Organisational Chaos Index

Client-side operational maturity diagnostic built with React, Vite, and Tailwind.

## Features

- Intro and explainer flow for the Operational Maturity Index
- 16-question diagnostic across workflow, documentation, reporting, and roles
- Automatic maturity scoring, dimension breakdowns, and weakest-dimension detection
- Rule-based recommendations rendered in-app and in the printable report
- Lead capture flow that posts submissions to a Google Apps Script endpoint
- Browser-generated PDF workflow via the print dialog

## Configuration

Create a `.env` file from `.env.example` and set:

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycby-qN7HZI2ETHu3I0RsDpU2AVH1PmVG6kpwzschgdR1zhLpY6jRo99hbdPvd5BFp2XI7w/exec
```

The app will block report downloads until that endpoint is configured.

## Google Sheets payload

The frontend POSTs JSON with:

- `timestamp`
- `first_name`
- `last_name`
- `email`
- `organisation`
- `overall_score`
- `maturity_level`
- `weakest_dimension`
- `workflow_score`
- `documentation_score`
- `reporting_score`
- `roles_score`
- `dimension_scores`
- `answers`
- `all_answers_JSON`

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```
