// Execute the following code when the document is ready
$(document).ready(function () {
    // Define a function to update the state of feature box inputs and their corresponding labels
    function updateFeatureBoxInputs() {
        // Loop through each .featureBox-input element
        $('.featureBox-input').each(function () {
            const $this = $(this);
            const isActive = $this.hasClass('active'); // Check if the input is active
            
            // Update the corresponding label's active state based on the input's state
            if (isActive) {
                $('.featureBox-label[for="' + $this.attr('id') + '"]').addClass('active');
            } else {
                $('.featureBox-label[for="' + $this.attr('id') + '"]').removeClass('active');
            }
        });
    }
    
    // Attach a click event handler to .featureBox-input elements
    $('.featureBox-input').click(function () {
        const $this = $(this); // The clicked input element
        
        // Check if the clicked input is not already active
        if (!$this.hasClass('active')) {
            // Toggle the active class on the clicked input and remove it from siblings
            $this.toggleClass('active').siblings().removeClass('active');
            
            // Update the active state of feature box inputs and labels
            updateFeatureBoxInputs();
        }
    });
    
    // Initial update of the feature box inputs and their corresponding labels
    updateFeatureBoxInputs();
});
