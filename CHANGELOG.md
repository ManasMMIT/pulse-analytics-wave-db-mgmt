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

### Changed
- `Phoenix`: user resources and sitemap management is now **single-user**- (CUD) and **single-team**- (UD) based, instead of operating on all users at once.
  1) guards against transaction failure when writes exceed 16MB 
  2) improves UX (involves less steps) for `Polaris` users to update permissions/sitemaps
  3) makes it faster to update permissions/sitemaps (now that writes are smaller).

### Removed
- `Polaris Backend`: removed old `client`, `role`, and `user` controllers.
- `Phoenix`: `push to dev` button has been commented out, until there's a discussion on managing admin features.
