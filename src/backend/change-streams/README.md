The files in this folder are named after the collection that will be updated, not the actual collections that are listening for changes.

For example, the `providerProfiles` change stream is listening to multiple collections to update -- `providerKeyAccountsList` and `providerPathwaysOverview`, at the time this was written. If one of these listening collections is updated, it triggers an update to `providerProfiles`.

At the moment, it's not clear if you can have multiple change streams for the same collection, so the logic outlined above is subject to change; basically, it may have to be flipped to track each collection that's listening.