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
- `Phoenix`: `upsertUsersPermissions` and `upsertUsersSitemaps` utils for persisting user access directly to `dev`
- `Phoenix`: `getUser` method was added to Auth0 Management Client and used in `auth0/index.js` instead of the method in Auth0 Extension Client to pave way for auth0 ext client's removal
- `Phoenix`: Add Client update functionality (and build out delete functionality but leave it hidden)

### Changed
- `Delphi`: refactored backend to be more flexible with less hard-coding for Pathways subscription.
- `Orion`: when accounts, indications, or regimens are updated in their master lists, duplicate data fields -- `slug` for account, `name` for indication/regimen -- used in `users.nodes.resources` for validation are also updated.
- `Phoenix`: the Regional Breakdown switch in the View Control node resource modal now persists its resource, in alignment with treatment plans and accounts, to `users.nodes.resources` instead of `users.sitemaps`.
- `Phoenix`: user resources and sitemap management is now **single-user**- (CUD) and **single-team**- (UD) based, instead of operating on all users at once.
  1) guards against transaction failure when writes exceed 16MB 
  2) improves UX (involves less steps) for `Polaris` users to update permissions/sitemaps
  3) makes it faster to update permissions/sitemaps (now that writes are smaller).

### Removed
- `Polaris Backend`: removed old `client`, `role`, and `user` controllers.
- `Phoenix`: `push to dev` button has been commented out, until there's a discussion on managing admin features.

### Fixed
- `Orion`: Query Tool account dropdown now displays updated data, when accounts are CUD'd on anywhere in Orion.
- `Phoenix`: added logic to `manageDeletedTeam` frontend resolver to keep user team labels fresh.
- `Phoenix`: removed the Auth0 Authorization Extension Client from the backend, leaving only the core Auth0 functionality (Auth0 Management Client) for user CRUD
  - Team and Client resolvers now only operate on MongoDB; where auth0 was depended on to generate a `uuid` for teams and clients, we now generate our own using the `uuid` library
  - User resolvers operate on MongoDB and Auth0 core but no longer do anything related to auth0 ext linking/delinking of teams
