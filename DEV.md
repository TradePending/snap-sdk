Overview:


## Build

`npx gulp build`

1. Pulls down the `snap-typeahead-v4.js`, `typeahead.js`, and `snap-search.js` from the production plugin server.

2. Wraps the results in [UMD](https://github.com/eduardolundgren/gulp-umd).

3. Saves them in the `dist` folder.

4. Runs webpack on the example client.

## Test Example

The example in `example/` can be used to test to make sure (some) things are working.

`DEALER_URL=<dealerUrl> PARTNER_ID=<partnerId> node example/example/server`

[http://localhost:8081/](http://localhost:8081) is the example running the webpacked files.

[http://localhost:8081/global](http://localhost:8081/global) is the example running without webpack (just including the SDK via `<script>` tags).

## Publish

1. `npm version patch -m "Upgrade to %s for reasons"` To bump the version number and commit any changes picked up by `gulp build`.

2. `npm publish` using the tradepending account.
