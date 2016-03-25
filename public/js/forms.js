//
// Form Validation for ICS Forms
// Requires: jQuery, http://jqueryvalidation.org/
//

$(document).ready(function(){

  // A function to be passed as the errorPlacement option of $.validate().
  function customErrorPlacement(error, $element) {
    // set the Bootstrap .has-error class on the closest .form-group parent
    $element.parent(".form-group").addClass("has-error");

    // use an HTML data-attribute to identify which field the message corresponds to
    var dataAttr = 'data-validation-error="' + $element.attr("id") + '"';

    // clear existing error messages
    $("div[" + dataAttr + "]").remove();

    // create a flash message with the error text
    $('<div class="fade in alert alert-danger" ' + dataAttr + '></div>')
      .append('<button class="close" type="button" data-dismiss="alert">×</button>')
      .append(error)
      .appendTo(".container > .messages");
  }

  //
  // New Operational Period
  //
  $("#period-new").validate({
    errorPlacement: function(error, $element) {
      $element.parent(".form-group").addClass("has-error");
      $(error).addClass("help-block").insertAfter($element);
    },
    errorElement: "span",
    success: function($label) {
      $label.parent(".form-group").removeClass("has-error");
    },
    rules: {
      'period[commander]': {
        required: true
      },
      'period[start][date]': {
        required: true
      },
      'period[start][time]': {
        required: true
      },
      'period[end][date]': {
        required: true
      },
      'period[end][time]': {
        required: true
      }
    },
    messages: {
      'period[commander]': {
        required: "Commander is required."
      },
      'period[start][date]': {
        required: "Start Date is required."
      },
      'period[start][time]': {
        required: "Start Time is required."
      },
      'period[end][date]': {
        required: "End Date is required."
      },
      'period[end][time]': {
        required: "End Time is required."
      }
    }
  });

  //
  // ICS 204
  //
  $("#form-ics-204").validate({
    errorPlacement: customErrorPlacement,
    errorElement: "span",
    rules: {
      'resourcesAssigned[numOfPersons]': {
        digits: true
      },
      'preparedBy[dateTime]': {
        dateISO: true
      }
    },
    messages: {
      'resourcesAssigned[numOfPersons]': {
        digits: "Resources Assigned: Number of Persons must be a number."
      },
      'preparedBy[dateTime]': {
        dateISO: "Prepared By: Date/Time must be an ISO datetime."
      }
    }
  });
/*
Full list of ICS 204 form field names:
'operationalPeriod[start]'
'operationalPeriod[end]'
'field3[branch]'
'field3[division]'
'field3[group]'
'field3[stagingArea]'
'operationsPersonnel[operationsSectionChiefName]'
'operationsPersonnel[operationsSectionChiefContactNumber]'
'operationsPersonnel[branchDirectorName]'
'operationsPersonnel[branchDirectorContactNumber]'
'operationsPersonnel[divisionGroupSupervisorName]'
'operationsPersonnel[divisionGroupSupervisorContactNumber]'
'resourcesAssigned[resourceIdentifier]'
'resourcesAssigned[leader]'
'resourcesAssigned[numOfPersons]'
'resourcesAssigned[contact]'
workAssignments
specialInstructions
'communications[name]'
'communications[function]'
'communications[primaryContact]'
'preparedBy[name]'
'preparedBy[positionTitle]'
'preparedBy[signature]'
'preparedBy[dateTime]'
*/

});
