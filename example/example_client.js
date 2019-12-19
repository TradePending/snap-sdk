$(document).ready(function(){
  let snap;
  
  if (typeof __webpack_require__ === 'function') {
    // using webpack
    snap = require('../dist/snap-typeahead');
  } else {
    // using <script> to include the sdk.
    snap = window.SNAP;
  }
  
  const addReport = function(selector, partnerId, dealerId, vehicle) {
    $("<hr>").appendTo(selector);
    let ul = $("<ul>").appendTo(selector);
    
    let reportUrl = snap.get_report_url(partnerId, dealerId, vehicle);
    $("<li>").html("<a target='_blank' href='" + reportUrl + "'>" + reportUrl + "</a>").appendTo(ul);
    
    snap.get_report(partnerId, dealerId, vehicle, {}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Report: ", result);
      }
    })
  }

  const updateVehicle = function(selector, vehicle) {
    $(selector).empty();
    let ul = $("<ul>").appendTo(selector);
    for (let field in vehicle) {
      $("<li>").text(field + " : " + vehicle[field]).appendTo(ul);
    }
  }

  const completeVehicle = function(attributeSelector, partnerId, dealerId, selectedVehicle, callback) {
    if (!selectedVehicle.id) {
      const handleAttribute = function(err, result) {
        let vehicle = result.vehicle;
        let attribute = result.attribute;
        let choices = result.choices;
        if (err) {
          return callback(err);
        }
        $(attributeSelector).html("");
        if (attribute) {
          let buttons = "";
          choices.forEach(function(choice) {
            buttons += "<li><input type='button' value='" + choice + "'/></a></li>";
          });
          let header = "<span>" + attribute + ":</span>";
          $(attributeSelector).html(header + "<ul>" + buttons + "</ul>");
          $(attributeSelector + " input").click(function(e) {
            e.preventDefault();
            vehicle[attribute] = e.target.value;
            snap.next_attribute(partnerId, dealerId, vehicle, handleAttribute);
          });
        } else {
          callback(null, vehicle);
        }
      };
      snap.next_attribute(partnerId, dealerId, selectedVehicle, handleAttribute);
    } else {
      callback(null, selectedVehicle);
    }
  };


  let apiUrl = "__api_url__";
  let dealerId = "__dealer_id__";
  let partnerId = "__partner_id__";

  snap.set_api_url(apiUrl);
  snap.configure(partnerId, "input#vehicle", function(err, vehicle) {
    if (err) {
      console.log(err);
      return alert(err);
    }
    updateVehicle(".typeahead-result", {});
    completeVehicle(".typeahead-next", partnerId, dealerId, vehicle, function(err, vehicle) {
      if (err) {
        console.log(err);
        return alert(err);
      } else {
        updateVehicle(".typeahead-result", vehicle);
        addReport(".typeahead-result", partnerId, dealerId, vehicle);
      }
    });
  });
  
});
