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
  // ICS 204
  //
  $("#form-ics-204").validate({
    errorPlacement: customErrorPlacement,
    errorElement: "span",
    rules: {
      'operationalPeriod[start]': {
        required: true,
        dateISO: true
      },
      'operationalPeriod[end]': {
        required: true,
        dateISO: true
      },
      'resourcesAssigned[numOfPersons]': {
        digits: true
      },
      'preparedBy[dateTime]': {
        dateISO: true
      }
    },
    messages: {
      'operationalPeriod[start]': {
        required: 'Operational Period is required.',
        dateISO: "Operational Period: Date From must be an ISO date."
      },
      'operationalPeriod[end]': {
        required: 'Operational Period is required.',
        dateISO: "Operational Period: Date To must be an ISO date."
      },
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
