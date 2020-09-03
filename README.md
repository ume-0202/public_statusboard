# Statusboard
Status board for American Airlines IT - displays a summary of system status in a hierarchy from the product portfolio through individual infrastructure components at a glance, with optional incident messaging.

This project was bootstrapped with
 * [Runway](https://americanairlines.slack.com/archives/C0112F1JKNG).
 * [Create React App](https://github.com/facebook/create-react-app).
 * [Express](http://expressjs.com).

# Participating (Contributing)

## First things first
Run `npm i` to install the dependancies for this project.

## Running Locally
### Frontend (UI)
To run the UI locally, simply use run `npm run ui:start`.

### Backend
The Backend serves the frontend for **{{cookiecutter.component_id}}**, so make sure you build it first with `npm run ui:build` before starting the backend. When you're ready, simply run `npm run api:dev` to run the app locally.

### Editing the UI and API Simultaneously
If you plan to work on both the UI and the API simultaneously, you'll need to do so in two different tasks. Run run `npm run api:dev` to start the backend then in another tab run `npm run ui:start` to launch to UI. TODO VALIDATE: **NOTE**: You must start the backend first and then after starting the front end, enter `y` to run on a different port. While the backend is serving a version of the UI (likely on `localhost:3000`), this version of the UI _will not update_ when changes are made, so make sure to use the one created by `react-scripts` (your browser should open automatically after running `npm run ui:start`).

## Environment variables
This project is setup to be controlled using various environemnt variables. You can set these in your environemnt (for example in a deployment) or using a local `.env` file.

### FORCE_SSO
Set FORCE_SSO to true (`FORCE_SSO=true`) to test with SSO. Otherwise, SSO is only enabled for production (`NODE_ENVIRONMENT == production`).

## TODO
* Describe tests and coverage
* Link to design documents

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
