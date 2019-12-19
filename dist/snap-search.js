;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.SNAPes = factory();
  }
}(this, function() {
var SNAPes;

(function() {
  SNAPes = {
    plugin_ajax_url: "https://snap-api.tradepending.com",
    elasticsearch_url: 'https://snap-api.tradepending.com/api/v4/search',
    set_api_url: function(url) {
      return this.plugin_ajax_url = url;
    },
    set_es_url: function(url) {
      return this.elasticsearch_url = url;
    },
    search: function(partner_id, search_term, callback) {
      return this.search_with_options({
        partner_id: partner_id,
        search_term: search_term,
        include_new_cars: false,
        country: 'US'
      }, callback);
    },
    search_with_options: function(options, callback) {
      var partner_id, country, current_year, include_new_cars, query, search_term, xhr, ymm_only;
      partner_id = options.partner_id;
      search_term = options.search_term;
      include_new_cars = options.include_new_cars;
      country = options.country;
      ymm_only = options.ymm_only;
      if (typeof callback !== 'function') {
        return callback(new Error("callback function is required"));
      }
      if ((search_term == null) || search_term.length < 1) {
        return callback(new Error("search_term parameter is required"));
      }
      if (ymm_only) {
        query = {
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
        query = {
          size: 10,
          query: {
            bool: {
              must: {
                match: {
                  all_fields: {
                    query: search_term,
                    operator: "and"
                  }
                }
              }
            }
          }
        };
      }
      if (!include_new_cars) {
        current_year = (new Date()).getFullYear();
        if (query.query.bool.must_not == null) {
          query.query.bool.must_not = [];
        }
        query.query.bool.must_not.push({
          term: {
            "year.raw": (current_year + 1).toString()
          }
        });
        query.query.bool.must_not.push({
          term: {
            "year.raw": (current_year + 2).toString()
          }
        });
        query.query.bool.must_not.push({
          term: {
            "year.raw": (current_year + 3).toString()
          }
        });
      }
      if (country !== 'CA') {
        if (query.query.bool.must_not == null) {
          query.query.bool.must_not = [];
        }
        query.query.bool.must_not.push({
          term: {
            "country.raw": "CA"
          }
        });
      }
      xhr = new XMLHttpRequest();
      xhr.open('POST', this.elasticsearch_url + "?partner_id=" + partner_id);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.responseType = 'json';
      xhr.send(JSON.stringify(query));
      return xhr.onload = function() {
        var car, hit, hits, results, v, ymmt, _i, _len, _ref;
        if (xhr.status === 200) {
          results = [];
          if (typeof xhr.response === "string") {
            hits = (_ref = JSON.parse(xhr.response)) != null ? _ref.hits.hits : void 0;
          } else {
            hits = xhr.response.hits.hits;
          }
          for (_i = 0, _len = hits.length; _i < _len; _i++) {
            hit = hits[_i];
            v = hit._source;
            ymmt = v.year + " " + v.make + " " + v.model + " " + v.trim;
            car = {
              id: v.id,
              ymmt: ymmt,
              year: v.year,
              make: v.make,
              model: v.model,
              trim: v.trim
            };
            results.push(car);
          }
          return callback(void 0, results);
        } else {
          return callback({
            code: xhr.status
          }, void 0);
        }
      };
    }
  };

}).call(this);

return SNAPes;
}));
