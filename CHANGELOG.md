# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Types of changes
- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.

## [Unreleased] - Started: 6-16-20

### Added
- `Backend/Payer Import Tool`: Built out socket.io feature to emit payer import status to frontend

## [2.8.1] - Started: 6-12-20

### Changed
- `Orion`: Edit Role Node now also cascades changes to the role's users' sitemaps.
- `Orion`: Deleting indication or regimen now cascades to users.nodes.resources in pulse-dev
- `Orion`: Excel import view is now the default landing page in orion and top of the sidebar.

## [2.8.0] - Started: 6-2-20

### Added
- `Orion`: Built out OBM Service and OBM Service Category Placards, queries, mutations.
- `Orion`: Added first relational widgets to OBM-related bo modals: service category widget on OBM Service Modal and service widget on OBM Modal
- `Sheet Management System`: Add option to allow blank rows through even if using business object validation on a field
- `Phoenix`: Added first iteration full oplog view to request arbitrary number of logs

### Fixed
- `Payer Import Tool`: Fixed import error formatting by adding a # delimiter to each line of error description
- `Orion`: Query Tool placard filters can no longer receive invalid items and are up-to-date post mutation of rows

## [2.7.0] - Started: 5-26-20

### Added
- `Orion`: Built out Phase 1 of Query Tool (Aquila) Management CRUD; limiting what fields are filterable in query tool placard field; no support yet for custom display text or default columns
- `Orion`: Query Tool now supports business object modals, limited to create and update, and not fully dynamic yet
- `Orion`: Basic Query Tool Placard View functionality wired in

### Changed
- `Orion`: Updated org deletion cascade by removing deprecated connections logic, making sure to cascade through to the `accounts` slice in `users.nodes.resources`, delete affiliated PTPs in `tdgProjects`

## [2.6.0] - Started: 5-15-20

### Added
- `Phoenix`: Built default landing page feature for roles and/or users with backend cascade updates to pulse-dev.users.sitemaps
- `Orion`: Business Object Modals Read, Create, and Update for Modals, Tabs, Sections, and Fields
- `Orion`: BOM Schema switched to live data
- `Payer Import Tool`: Installed `@date-io/date-fns` and `@material-ui/pickers` for Calendar and timestamp input components.

## [2.5.0] - Started: 5-11-20

### Added
- `Orion/General Import Tool`: Built out tools timestamp widget on import tool page for updating timestamps globally on core nodes, core teams, dev users.sitemaps; meant to replace collectionsConfig/dashboardsConfig usage in wave-app/wave-api
- `Orion`: Payer Project Updates
  - Create Payer Projects
  - Update Project PTPs via cross-product configuration modal
  - Delete selected PTPs via granular table
  - Transfer PTPs ownership between projects

### Changed
- `Polaris Frontend`: Payer Projects rose to the top of the app, next to Phoenix, Delphi, Orion.
- `Payer Import Tool`:
  - Added frontend filtering to import interface to prevent workbook from having fewer than the required three sheets
  - Refactored SheetToCore logic and added unit tests for it
  - Added deletion step to payer import flow to account for when a project deletes optional rows from its workbook such as additional criteria and policy links
  - Adjusted payer materialization pipelines to get the latest month/year within each month/year, then proceed to get the latest 1 or 6 blocks (non-ht vs ht)

## [2.4.0] - Started: 4-30-20

### Added
- `Orion`: Treatment Plans, lines, coverages, books, populations master list views w/ CRUD

### Changed
- `Polaris Backend`/`Node Scripts`: Added a `DB_CLUSTER_ENV` variable to have the API show which cluster it's connected to while not revealing the full connection string with the MongoDB password in it
- `Orion`: Restructure frontend code to match new sidebar structure
- `Import Tool`: Revise order in which imported data is processed; group ops for payer workbook import to avoid repetition

## [2.3.0] - Started: 4-22-20

### Added
- `Orion`: Business Object Management Panels -- CRUD on fields and business objects.
- `Orion`: Built CRUD functionality on business object references for fields in the Sheet Mgmt System (for dynamic validation against business objects)
- `Orion`/`Import Tool`: Built out business object validation layer that overrides manual oneOf and allows for dynamic checking against master lists on import

### Removed
- `Polaris`: Removed step of generating `payerHistoricalCombinedData` on node script import of lives; wasn't ever actually needed on the side of lives import

### Changed
- `Orion`: Rebuilt regional targeting data export placard and backend to account for team permissions; can now export state breakdown and regional breakdown data as Excel

## [2.2.0] - Started: 4-7-20

### Added
- `Orion`: Initial Payer Historical Lives Core to Dev materializations.
- `Orion`: Payer project `updatePtps` and `removePtps`

### Changed
- `Node Scripts, Polaris`: Seeding of treatment plans, org.tps, etc., now uses access collections as entry, instead of a mix of additional criteria _and_ access.
- `Orion`: Separate Lives and Access sections of historical uploadSheet resolver.
- `Orion`: Improve Payer Historical Sheet to Core validation for each sheet type.
- `Orion`: Payer project query resolver I/O changes -- no longer handling pagination on backend.

### Removed
- `Polaris`: Removed deprecated `payerCombinedStateLives` usage across the repo: old import process, new import process, custom data export for regional targeting data

## [2.1.0] - Started: 4-2-20

### Changed
- `Node Scripts, Orion`: change the data import pipeline for payer data to replace `Tricare` and `VA` books with `Federal/Other`; change payer data seed scripts to use `Federal/Other`, custom Novartis export
- `Node Scripts`: for importing payer historical non-project-based data, you can now add a flag `--ignoreConsolidatePayerData` to the terminal command to avoid that costly step until you're at the last CSV that needs to be imported

## [2.0.0] - Started: 3-11-20

### Added
- `Polaris`: Built out new Import Tool with sanitization and validation, including validation/coercion for `date` and `csv` types to go beyond parity with wave-app old import tool
- `Orion`: Built out minimum node CRUD needed for Imbruvica provider project; ability to Add Source Node and Edit Role Node
- `Orion`: Created new Pathways Accounts page that features BOM modal with the `useBom` hook
- `Polaris`: Built reusable components - `Sidebar`, `Modal`, `FieldsSectionCard`, `FieldLabel` and `Input`
- `Polaris`: Created hotfix script for easier setting of regional breakdown for a role and its users.
- `Backend`: Added projectPtps endpoint.
- `Orion`: Added export payerCombinedStateLives DRG state data button on custom exports page.
- `Phoenix`: Installed `@material-ui/lab` for material-ui's experimental/futuristic components.
- `Polaris`: Added seed scripts for seeding lines, regimens, populations, books, coverages, treatmentPlans, organizations.treatmentPlans, organizations.treatmentPlans.history, lives.history, and tdgProjects
- `Backend`: WIP on handling non-lives payer historical data import from sheet => core, and materialization from core => dev (connected to same import endpoint as general import tool)

### Changed
- `Polaris`: Upgraded packages to the latest versions, mostly minor/patch (keep papaparse the version it was due to major upgrade not being backward compatible; handful of other major upgrades were fine)
- `Orion`: Refactored the `useAquila` hook to fetch filter options and placard configs separately.
- `Orion`: Changed sheet management CRUD on oneOf to only accept quoted, comma-delimited strings but still persist to backend as array of strings

## [1.3.0] - Started: 2-25-20

### Added
- `Polaris`: Build out temporary seed scripts for `treatmentPlan`, `org.treatmentPlan`, `org.treatmentPlan.history`, and `lives.history` collections.
- `Polaris`: Installed `JSZip` for file zipping and `file-saver` for file downloading on the client side
- `Orion`: Allow merck pipe delimited csv and txt files to be downloadable from a click of a button
- `Orion`: Built sheet management CRUD system with URL-based panels and panel item selection
- `Orion`: Allow novartis csv files to be downloadable from a click of a button

### Changed
- De-nested api subapp and removed old pql subapp.
- `Orion`: Update payer quality of access throughout history and disable quality of access panel delete button.
- `Orion`: Whenever an `indication` or `regimen` is deleted, delete docs from `treatmentPlans`, `organizations.treatmentPlans`, `organization.treatmentPlans.history` (trash not delete) collections.
- `Orion`: Deleting an organization now deletes docs on `organization.treatmentPlans` and `organization.treatmentPlans.history`.

### Fixed
- `Polaris`: Fixed order of routing in express server so `/api` can be hit before serving up `index.html` for general react routing routes

## [1.2.3] - Started: 2-11-20

### Added
- `Orion`: Build out custom hook `useAquila` to make interfacing w/ `Aquila-js` api easier.
- `Orion`: Built out custom hook `useBom` (business object modal).

### Changed
- `Phoenix`: Show team and client names for Update Role Sitemap operation in OpLog
- `Polaris`: Upgrade `react-router-dom` and `react-router` to gain access to useLocation and useHistory hooks.

### Fixed
- `Phoenix`: Trim empty spaces on user's username and email on create/update
- `Phoenix`: Prevent plain text passwords from being logged to api.log file

## [1.2.2] - Started: 2-11-20

### Fixed
- `Phoenix`: Make sure OpLog always refetches log on remount

## [1.2.1] - Started: 2-11-20

### Fixed
- `Phoenix`: Fixed OpLog bug where on polling refresh, the last push to prod would disappear
- `Phoenix`: Conditionally render OpLog to only show in production environment

## [1.2.0] - Started: 2-5-20

### Added
- `Orion`: pql proof of concept backend and frontend
- `Phoenix`: oplog in StatusPanel showing what's changed since the last push to prod

### Fixed
- `Phoenix`: Team Permissions sitemap bug, where unselected tool's dashes/pages/cards would display whenever a tool without a full sitemap was selected
- `Polaris Frontend`: Logging out now redirects user to `window.location.origin` as it should, instead of `localhost:3000`

### Changed
- `Phoenix`: Styling upgrade in preparation for handoff to consultants

## [1.1.0] - Started: 1-30-20

### Added
- `Orion`: bulk export and import on organization master lists (currently only on Providers), and organization meta data on account modal
  - Add hardcoded conditional logic to hide bulk import on Provider master list except for `admin` user
  - Install `file-saver` library to support Excel export of Provider master list
  - Add data sanitization for organization import/export to strip unicode characters
- `Orion`: Add `updatedAt` timestamping to all organizations, and also `exportedAt` to all providers; revised AccountModal to show that meta information
  - Add new scalar type `GraphQLDateTime` to the GraphQL system using existing `graphql-iso-date` library
- `Polaris Backend`: Add user profile info to access token sent to the backend by leveraging Auth0 rule; add that user info to GraphQL resolver context so all resolvers can access it
- `Node Scripts`: added `append-percent-lives.js` which appends a `structuredLives` field to `payerHistoricalDrgNationalLives` and `payerHistoricalMmitNationalLives` on `pulse-dev`

### Changed
- `Phoenix`: Show user password on input instead of dots

### Removed
- Uninstall `moment` package in favor of only using `date-fns` for now
- Uninstall `json-to-csv` package

## [1.0.0] - Started: 12-23-19

### Added
- `Polaris Backend`: moved entire `pipe-delimited-script` into `Polaris
- `Polaris Frontend`: panel item style now supports pseudo-classes, such as `:hover`
- `Orion`: oncologists column in query tool
- `Phoenix`: users can now toggle on/off all treatment plans in the resources modal
- `Phoenix`: `upsertUsersPermissions` and `upsertUsersSitemaps` utils for persisting user access directly to `dev`
- `Phoenix`: `getUser` method was added to Auth0 Management Client and used in `auth0/index.js` instead of the method in Auth0 Extension Client to pave way for auth0 ext client's removal
- `Phoenix`: Build out Client update and delete functionality, but leave both hidden
- `Orion`: can now export entire Provider master list to csv _and_ backup export as `.json`
- `Orion`: can import collections for the policy scraper through `uploadScraperData` util
- `Node Scripts`: for importing payer historical project-based data, you can now add a flag `--ignoreConsolidatePayerData` to the terminal command to avoid that costly step until you're at the last CSV that needs to be imported
- `Orion`: When deleting an organization, its connections are deleted from the soon-to-be-official connections collection AS WELL AS newProviders collection in pulse-dev
- `Polaris`: Build out basic auth0 layer and tweak server code for production

### Changed
- `Orion`: refactor all connections logic, front- and back-end, for new connections collection ([link](https://github.com/pulse-data/wave-db-mgmt/pull/294))
- `Polaris Backend`: fixed/optimized payer historical data import by aggregating, deleting, and inserting for a single project.
- `Delphi`: refactored backend to be more flexible with less hard-coding for Pathways subscription.
- `Orion`: added additional fields to Provider Acc Modal: `state`, `city`, and `oncologistsCount`, and persist organization state changes on both sides of connections.
  - Also lock every provider's connections' states to be tied to that provider's headquarters's state ([link](https://github.com/pulse-data/wave-db-mgmt/pull/274)).
- `Orion`: when accounts, indications, or regimens are updated in their master lists, duplicate data fields -- `slug` for account, `name` for indication/regimen -- used in `users.nodes.resources` for validation are also updated.
- `Phoenix`: the Regional Breakdown switch in the View Control node resource modal now persists its resource, in alignment with treatment plans and accounts, to `users.nodes.resources` instead of `users.sitemaps`. Old sitemap resource merging code has been deleted from the backend, as well as really old PostgreSQL files.
- `Phoenix`: user resources and sitemap management is now **single-user**- (CUD) and **single-team**- (UD) based, instead of operating on all users at once.
  1) guards against transaction failure when writes exceed 16MB
  2) improves UX (involves less steps) for `Polaris` users to update permissions/sitemaps
  3) makes it faster to update permissions/sitemaps (now that writes are smaller).
- `Phoenix`: Resources Modal: query for organizations using tool-id-to-query-doc map for getting orgs by org type rather than all organizations
- `Phoenix`: Make sure override push sitemaps to dev button works
- `Phoenix`: Refactor and move around upsertion logic related to `users.sitemaps` and `users.nodes.resources`

### Removed
- `Polaris Backend`: removed old `client`, `role`, and `user` controllers.
- `Phoenix`: `push to dev` button has been commented out, until there's a discussion on managing admin features.
- `Phoenix`: Removed general organizations query endpoint in favor of leaving organization querying broken up by type of organization
- `Delphi`: Removed old approach code including standlone email prep node script and deprecated mutations, resolvers, typeDefs, queries

### Fixed
- `Orion`: delete account modal no longer stutters, and all relevant connections are scrubbed from cache ([link](https://github.com/pulse-data/wave-db-mgmt/pull/292))
- `Delphi`: hotfix implemented for test email user dropdown, making it network-only for freshest users to mock.
- `Orion`: Query Tool account dropdown now displays updated data, when accounts are CUD'd on anywhere in Orion.
- `Phoenix`: added logic to `manageDeletedTeam` frontend resolver to keep user team labels fresh.
- `Phoenix`: removed the Auth0 Authorization Extension Client from the backend, leaving only the core Auth0 functionality (Auth0 Management Client) for user CRUD
  - Team and Client resolvers now only operate on MongoDB; where auth0 was depended on to generate a `uuid` for teams and clients, we now generate our own using the `uuid` library
  - User resolvers operate on MongoDB and Auth0 core but no longer do anything related to auth0 ext linking/delinking of teams
- `Phoenix`: Fix combineResources util mock data after removing resources from users.sitemap logic
- `Orion`: When updating a non-provider-type org, the state field on all of that org's connections is no longer accidentally erased
