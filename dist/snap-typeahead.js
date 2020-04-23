;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.SNAP = factory(root.jQuery);
  }
}(this, function(jQuery) {
var SNAP;
(function() {
  var build_report_params;

  SNAP = {
    snap_api_url: "https://snap-api.tradepending.com",
    elasticsearch_url: 'https://snap-api.tradepending.com/api/v4/search',

    set_api_url: function(url) {
      if ((url != null ? url.length : void 0) > 0) {
        return this.snap_api_url = url;
      }
    },
    set_es_url: function(url) {
      if ((url != null ? url.length : void 0) > 0) {
        return this.elasticsearch_url = url;
      }
    },
    configure: function(partner_id, css_selector, callback) {
      return SNAP.configure_with_options({
        partner_id: partner_id,
        css_selector: css_selector,
        include_new_cars: false,
        country: 'US'
      }, callback);
    },
    configure_with_options: function(options, callback) {
      var partner_id, country, css_selector, include_new_cars, self, timeout, ymm_only;
      self = this;
      partner_id = options.partner_id;
      css_selector = options.css_selector;
      include_new_cars = options.include_new_cars;
      country = options.country;
      ymm_only = options.ymm_only;
      if (!partner_id) {
        return callback(new Error("partner_id is required"));
      }
      if (typeof callback !== 'function') {
        return callback(new Error("callback function is required"));
      }
      if ((css_selector == null) || css_selector.length < 1) {
        css_selector = "#tradepending-vehicle-typeahead";
        console.log("No CSS Selector specified so using default typeahead selector of: " + css_selector);
      }
      if (country == null) {
        country = 'US';
      }
      timeout = null;
      jQuery(css_selector).typeaheadTP({
        highlight: true,
        hint: false
      }, {
        name: "vehicle-search",
        displayKey: "ymmt",
        source: function(query, callback) {
          var current_year, q;
          if (ymm_only) {
            q = {
              query: {
                bool: {
                  must: {
                    match: {
                      ymm: {
                        query: query,
                        operator: "and"
                      }
                    }
                  }
                }
              },
              aggs: {
                vehicles: {
                  terms: {
                    field: "ymm.raw"
                  },
                  aggs: {
                    dedup_docs: {
                      top_hits: {
                        size: 1
                      }
                    }
                  }
                }
              }
            };
          } else {
            q = {
              size: 10,
              query: {
                bool: {
                  must: {
                    match: {
                      all_fields: {
                        query: query,
                        operator: "and"
                      }
                    }
                  }
                }
              }
            };
          }
          if (!include_new_cars) {
            if (q.query.bool.must_not == null) {
              q.query.bool.must_not = [];
            }
            current_year = (new Date()).getFullYear();
            q.query.bool.must_not.push({
              term: {
                "year.raw": (current_year + 1).toString()
              }
            });
            q.query.bool.must_not.push({
              term: {
                "year.raw": (current_year + 2).toString()
              }
            });
            q.query.bool.must_not.push({
              term: {
                "year.raw": (current_year + 3).toString()
              }
            });
          }
          if (country !== 'CA') {
            if (q.query.bool.must_not == null) {
              q.query.bool.must_not = [];
            }
            q.query.bool.must_not.push({
              term: {
                "country.raw": "CA"
              }
            });
          }
          jQuery.support.cors = true;
          return jQuery.ajax({
            url: self.elasticsearch_url + "?partner_id=" + partner_id,
            type: 'POST',
            contentType: 'text/plain',
            crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(q),
            success: function(resp) {
              var hits, result;
              result = [];
              if (ymm_only) {
                hits = resp.aggregations.vehicles.buckets;
              } else {
                hits = resp.hits.hits;
              }
              jQuery.each(hits, function(index, hit) {
                var car, v, ymmt;
                if (ymm_only) {
                  hit = hit.dedup_docs.hits.hits[0];
                }
                v = hit._source;
                car = {
                  id: v.id,
                  year: v.year,
                  make: v.make,
                  model: v.model
                };
                ymmt = v.ymm;
                if (!ymm_only) {
                  ymmt += " " + v.trim;
                  car.trim = v.trim;
                }
                car.ymmt = ymmt;
                return result.push(car);
              });
              return callback(result);
            },
            error: function(error) {
              return console.log("plugin error:", JSON.stringify(error));
            }
          });
        }
      }).bind("typeahead:selected", function(evt, vehicle, name) {
        return callback(void 0, vehicle);
      });
      return jQuery(css_selector).focus();
    },
    next_attribute: function(partner_id, vehicle, callback) {
      var url;
      if (partner_id == null) {
        return callback(new Error("partner_id must be provided when configuring SNAP."));
      }
      if (typeof vehicle !== 'object') {
        return callback(new Error("vehicle parameter is required"));
      }
      if (typeof callback !== 'function') {
        return callback(new Error("callback function is required"));
      }
      vehicle.partner_id = partner_id;
      url = ("" + this.snap_api_url + "/api/v4/select?") + $.param(vehicle);
      return $.getJSON(url, function(response) {
        var v;
        v = {};
        if (response.id != null) {
          v.id = response.id;
        }
        if (response.year != null) {
          v.year = response.year;
          v.ymmtd = v.year;
        }
        if (response.make != null) {
          v.make = response.make;
          v.ymmtd += " " + v.make;
        }
        if (response.model != null) {
          v.model = response.model;
          v.ymmtd += " " + v.model;
        }
        if (response.trim != null) {
          v.trim = response.trim;
          v.ymmtd += " " + v.trim;
        }
        if (response.body != null) {
          v.body = response.body;
          v.ymmtd += " " + v.body;
        }
        if (response.drivetrain != null) {
          v.drivetrain = response.drivetrain;
          v.ymmtd += " " + v.drivetrain;
        }
        if (response.engine != null) {
          v.engine = response.engine;
          v.ymmtd += " " + v.engine;
        }
        if (response.fuel_type != null) {
          v.fuel_type = response.fuel_type;
          v.ymmtd += " " + v.fuel_type;
        }
        if (response.doors != null) {
          v.doors = response.doors;
          v.ymmtd += " " + v.doors + " door";
        }
        if (response.choices != null) {
          return callback(void 0, {
            vehicle: v,
            attribute: response.select,
            choices: response.choices
          });
        } else {
          return callback(void 0, {
            vehicle: v
          });
        }
      });
    },
    get_report_url: function(partner_id, dealer_url, vehicle, zip_code, options) {
      var params, url;
      params = build_report_params(partner_id, dealer_url, vehicle, zip_code, options);
      url = this.snap_api_url + '/api/v4/report-html?' + $.param(params);
      console.log("get_report_url: " + url);
      return url;
    },
    get_report: function(partner_id, dealer_url, vehicle, zip_code, options, callback) {
      var params, url;
      params = build_report_params(partner_id, dealer_url, vehicle, zip_code, options);
      params.format = 'json';
      url = this.snap_api_url + '/api/v4/report?' + $.param(params);
      console.log("get_report: " + url);
      return jQuery.ajax({
        url: url,
        type: 'GET',
        contentType: 'text/plain',
        crossDomain: true,
        dataType: 'json',
        success: function(resp) {
          return callback(void 0, resp);
        },
        error: function(jqXHR, message, err) {
          return callback(err, void 0);
        }
      });
    }
  };

  build_report_params = function(partner_id, dealer_url, vehicle, zip_code, options) {
    var params, _ref1;
    if ((partner_id == null) || partner_id.length < 1) {
      throw new Error("partner_id parameter is required");
    }
    if ((dealer_url == null) || dealer_url.length < 1) {
      throw new Error("dealer_url parameter is required");
    }
    if (vehicle == null) {
      throw new Error("vehicle parameter is required");
    }
    if ((vehicle != null ? vehicle.id : void 0) == null) {
      throw new Error("No ID on vehicle. You must provide a vehicle with an ID to this method.");
    }
    if (zip_code == null || zip_code.toString().length < 5) {
      throw new Error("zip_code parameter is required");
    }
    params = {
      vehicle_id: vehicle.id,
      partner_id: partner_id,
      url: dealer_url,
      zip_code: zip_code
    };
    if (options != null) {
      if ((options != null ? (_ref1 = options.mileage) != null ? _ref1.length : void 0 : void 0) > 0 && !isNaN(options.mileage)) {
        params.mileage = parseInt(options.mileage);
      }
    }
    return params;
  };
}).call(this);

return SNAP;
}));
