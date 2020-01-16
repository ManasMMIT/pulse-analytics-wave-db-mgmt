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

## [Unreleased] - Started: 12-23-19

### Added
- `Polaris Frontend`: panel item style now supports pseudo-classes, such as `:hover`
- `Orion`: oncologists column in query tool
- `Phoenix`: users can now toggle on/off all treatment plans in the resources modal
- `Phoenix`: `upsertUsersPermissions` and `upsertUsersSitemaps` utils for persisting user access directly to `dev`
- `Phoenix`: `getUser` method was added to Auth0 Management Client and used in `auth0/index.js` instead of the method in Auth0 Extension Client to pave way for auth0 ext client's removal
- `Phoenix`: Build out Client update and delete functionality but leave both hidden
- `Orion`: can import collections for the policy scraper through `uploadScraperData` util
- `Node Scripts`: for importing payer historical project-based data, you can now add a flag `--ignoreConsolidatePayerData` to the terminal command to avoid that costly step until you're at the last CSV that needs to be imported
- `Orion`: When deleting an organization, its connections are deleted from the soon-to-be-official connections collection AS WELL AS newProviders collection in pulse-dev

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
