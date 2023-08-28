// configurator-button.js


// Reposition Modal
  $(document).ready(function () {
      // Get the modal element
      var modal = $('#submitConfigModal');

      // Move the modal to the end of the body
      modal.appendTo($('body'));
  });



// Function to update button text based on the presence of 'active' class
$(document).ready(function() {
    var $button = $("#nav-quote-button");
    var $segment1 = $("#configuration-progress-segment1");
  
    
    function updateButtonText() {
      if ($segment1.hasClass("active")) {
        $button.addClass("btn-config");
      } else {
        $button.removeClass("btn-config");
      }
    }

    // Initial check on page load
    updateButtonText();
  
    // Create a Mutation Observer to track changes in the class attribute
    var observer = new MutationObserver(updateButtonText);
  
    // Observe changes in the attributes of the target node
    observer.observe($segment1[0], { attributes: true });






    function getConfigFormData() {
      var formDataArray = $("#section2").serializeArray(); // Collect input values
    
      // Manually collect checkbox values
      $(".form-checkbox input[type='checkbox']:checked").each(function() {
        formDataArray.push({ name: $(this).attr("name"), value: $(this).val() });
      });
    
      // Filter out __RequestVerificationToken
      formDataArray = formDataArray.filter(function (item) {
        return item.name !== "__RequestVerificationToken";
      });
    
      // Convert formData to a formatted string
      var formDataString = formDataArray.map(function(item) {
        return item.value;
      }).join(" | "); // Separate values with a "|" character
    
      return formDataString;
    }

//// Remember the configuration from the form

    
//// Populate the Form with the Configuration
function populateListFromString(itemsString) {
  const itemsArray = itemsString.split('|');

  const listContainer = document.getElementById('configuration-List');
  listContainer.innerHTML = '';

  itemsArray.forEach(function (itemText, index) {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';

      // Create header element based on index
      const itemElement = index === 0 ? document.createElement('h6') : document.createElement('p');
      itemElement.className = 'my-0';
      itemElement.textContent = itemText;

      listItem.appendChild(itemElement);
      listContainer.appendChild(listItem);
  });
}

//////////////////// Submission Configuration

    $("#section2").submit(function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
      
      var formConfiguratorData = getConfigFormData(); // Collect input values      
      // Open the modal
      populateListFromString(formConfiguratorData);
      $("#submitConfigModal").modal("show");      
 
  });
  
  $("#nav-quote-button").click(function() {
      $("#section2").submit(); // Trigger form submission
  });



//////////////////// Submission E-Mail
    function showConfigSendSuccessAlert() {
      var alertHtml = 
      `<div class="alert alert-success alert-dismissible fade show" role="alert">
              Configuration submitted successfully!
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>`;

      $("#alerts-container").html(alertHtml);
    }

    function showConfigSendErrorAlert() {
      var alertHtml = 
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">
              Couldn't send configuration!
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>`;

      $("#alerts-container").html(alertHtml);
    }



    function findValidationError(obj, targetField, results) {
      results = results || [];
  
      for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
              if (prop === targetField) {
                  results.push(obj[prop]);
              } else if (typeof obj[prop] === 'object') {
                  findValidationError(obj[prop], targetField, results);
              }
          }
      }  
      return results;
  }


    // Intercept the form submission
    $("#configSend-form").submit(function (event) {
      event.preventDefault(); // Prevent the default form submission
      
      // Store the original value of the Enquiry field
      var originalEnquiryValue = $("#Enquiry").val();
      
      // Modify the Enquiry field value
      $("#Enquiry").val("Configuration: " + getConfigFormData() + " Message: " + originalEnquiryValue);
      
      // Serialize form data
      var formData = $(this).serialize();
      
      // Initialize submitSuccess to false
      var submitSuccess = false;
      
      // Perform the form submission using AJAX
      $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        success: function (data, status, xhr) {
          // Handle success response if needed
          
          // Check if the response contains the error message
          if (!data.includes("field-validation-error")) {
            submitSuccess = true;
          }
        },
        error: function (xhr, status, error) {
          // Handle error response if needed
        },
        complete: function () {
          // Use setTimeout to ensure that this code runs after the AJAX callbacks
          setTimeout(function () {
            // Restore the original value of the Enquiry field
            $("#Enquiry").val(originalEnquiryValue);
            
            // Check the value of submitSuccess and show the appropriate alert
            if (submitSuccess) {
              showConfigSendSuccessAlert();
            } else {
              showConfigSendErrorAlert();
            }
          }, 0);
        }
      });
    });

});
