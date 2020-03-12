# TradePending SDK

This javascript interface to TradePending's partner API.  You must have a partner agreement with TradePending to use this library.

# Breaking Changes from API/SDK v3
* `partner_id` is now required as a parameter on `SNAP.configure`, `SNAP.configure_with_options`, `SNAP.next_attribute`, `SNAP.get_report_url`, `SNAP.get_report`, `SNAPes.search`, and `SNAPes.search_with_options`.
* `dealer_url` and `zip_code` are now required parameters on `SNAP.get_report` and `SNAP.get_report_url`.
* `dealer_id` is not longer a parameter for `SNAP.next_attribute`.
* The `callback` provided to `SNAP.configure` and `SNAP.configure_with_options` now is called with `callback(err, vehicle)` instead of `callback(error_or_vehicle_guess_which)` for consistency and usability.  Other functions like `SNAP.next_attribute` already functioned this way since v3.


# Contents

* [Typeahead SDK](#ta-sdk)
  * [Including](#ta-installing)
    * [\<script>](#ta-script)
    * [npm, webpack, etc](#ta-npm)
  * [Usage](#ta-usage)
* [Search SDK](#s-sdk)
  * [Including](#s-installing)
    * [\<script>](#s-script)
    * [npm, webpack, etc](#s-npm)
  * [Usage](#s-usage)
* [Typeahead Example Code](#ta-example)

<a name="ta-sdk"/>

## Typeahead SDK

The Typeahead SDK uses an autocomplete box to allow a user to select a `year, make, model, trim` quickly.

Additional functions help you ask the user to select additional vehicle attributes, and ultimately generate a TradePending used vehicle value report.

<a name="ta-installing"/>

## Including

<a name="ta-script"/>

#### Include as `<script>` on your site

```
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdnjs.tradepending.com/javascript/typeahead.js"></script>
<script type="text/javascript" src="https://cdnjs.tradepending.com/javascript/snap-typeahead-v4.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.tradepending.com/stylesheets/snap-typeahead.css">
```

JQuery (with AJAX support) is required.

The SDK will be made available as the `SNAP` global variable.

The stylesheet above is some basic CSS that you can use as is or copy and change.

<a name="ta-npm"/>

#### NPM dependency for use with webpack, etc.

`npm i --save @tradepending/snap-sdk`

`require('snap-sdk')` exports two variables, `SNAP` (Typeahead SDK), and `SNAPes` (Search SDK).

##### Webpack

The Typeahead SDK can be directly accessed via

`const SNAP = require(snap-sdk/dist/snap-typeahead);`

The `typeahead.js` jQuery plugin must be loaded before calling `SNAP.configure`.  How this might be accomplished depends on your setup.  The `gulpfile.js` in this repository includes a minimal webpack example using code from the `example/` directory.

<a name="ta-usage"/>

## Typeahead SDK Usage
Overview:

1. Configure snap by telling it what `<input>` element to attach autocomplete to, and provide a `callback` that will be called once the user has selected their `year, make, model, trim`.
2. Repeatedly `next_attribute` and present additional choices to the user until the vehicle is fully identified.
3. Open a value report in a new window or iframe, or obtain the report data in JSON format.

### Configuration
A `css_selector` is required to configure the SDK.

```
SNAP.configure(partner_id, css_selector, callback);
```

`css_selector` should uniquely identify the `<input>` element on the page that you want the vehicle autocomplete box to attach to.  Default is `#tradepending-vehicle-typeahead`.

Additional options can be configured as well.
```
SNAP.configure_with_options(options, callback);
```

The `options` object must include `css_selector` and `partner_id`.  Optional options are:

* `include_new_cars`: Allow selection of new cars, not just used.  Default is false.
* `country`: `US` or `CA`.  Default is `US`.
* `ymm_only`: Only select year, make, model (ignore trim). Default is false.

### Additional Attributes

After the user selects their Year/Make/Model/Trim in the autocomplete box,  there may be more vehicle attributes that are needed to sufficiently identify the vehicle.

```
SNAP.next_attribute(partner_id, vehicle, callback)
```

* `partner_id`: partner id provided by tradepending.
* `vehicle`: vehicle object from `SNAP.configure` or previous `SNAP.next_attribute` callbacks.
* `callback`: Handles asking the user for the remaining vehicle attributes.

The `callback` for `SNAP.next_attribute` is passed an error and result object.  The result object contains the following fields:

* `vehicle`: the updated version of the vehicle object.
* `attribute`: the next attribute that needs to be selected.
* `choices`: all possible choices for the attribute.

Once the vehicle has been fully identified, the `attribute` and `choices` fields will not be set on the result object.  Additionally, the `vehicle` object will have been updated to include a `vehicle.id` that is used when running the used value report.

### Trade Value Report

Two report methods are available.

* `SNAP.get_report_url(partner_id, dealer_url, vehicle, zip_code, options)`:  Creates the URL used to load the standard SNAP report in a new window or iFrame.
* `SNAP.get_report(partner_id, dealer_url, vehicle, zip_code, options, callback)`: Obtains a JSON version of the report.

* `partner_id`: partner id provided by tradepending.
* `dealer_url`: URL of the dealership.
* `vehicle`: vehicle selected using `SNAP.configure` and `SNAP.next_attribute`.  The vehicle must be fully selected (`vehicle.id` exists).
* `zip_code`: zip code of the dealership or market where the user is looking to trade their vehicle.
* `options`: Possible options:
  * `mileage`: User entered mileage to use.


<a name='s-sdk'/>

## Search SDK

The Search SDK is intended for situations were you want to provide your own UI for selecting vehicles.  It provides search methods for determining `year, make, model, and trim`.

The To perform additional actions like narrowing down vehicle attributes or running a report, the [TradePending API](https://snap-api.tradepending.com/api/v4/docs/) must be used.

<a name="s-installing"/>

## Including

<a name="s-script"/>

#### Include as `<script>` on your site

```
<script type="text/javascript" src="https://cdnjs.tradepending.com/javascript/snap-search-v4.js"></script>
```

The SDK will be made available as the `SNAPes` global variable.

<a name="s-npm"/>

#### NPM dependency for use with webpack, etc.

`npm i --save @tradpending/snap-sdk`

`require('snap-sdk')` exports two variables, `SNAP` (Typeahead SDK), and `SNAPes` (Search SDK).

##### Webpack

The Search SDK can be directly accessed via

`const SNAP = require(snap-sdk/dist/snap-search);`


<a name="s-usage"/>

## Search SDK Usage

`SNAPes.search(partner_id, search_term, callback)`

or

`SNAPes.search_with_options(options, callback)`

the `options` must include `search_term` and `partner_id`.  Other options are:

* `include_new_cars`: Allow selection of new cars, not just used.  Default is false.
* `country`: `US` or `CA`.  Default is `US`.
* `ymm_only`: Only select year, make, model (ignore trim). Default is false.

`callback` is called with `callback(err, results)` where  `results` is an array of vehicles containing `year, make, model, trim` fields.

<a name='ta-example'/>

# Examples

A simple example node server and example client is included in the `/example` directory.

To run the example server:
```
DEALER_URL=<dealer-url> PARTNER_ID=<your-partner-id> node example/example_server.js
```

Then visit `http://locahost:8081/` in your browser to view the example.
