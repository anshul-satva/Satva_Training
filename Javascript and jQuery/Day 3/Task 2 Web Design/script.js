$(document).ready(function () {

  /* multislect */
  $("#diseaseList").multiselect({
    includeSelectAllOption: true,
    buttonWidth: "100%",
    numberDisplayed: 2,
    nonSelectedText: "Select Diseases",
    nSelectedText: " selected",
  });

  /* date range */
  $("#serviceDate").daterangepicker({
    autoUpdateInput: false,
    locale: {
      cancelLabel: "Clear",
      format: "DD/MM/YYYY",
    },
  });

  // Update input when date is selected
  $("#serviceDate").on("apply.daterangepicker", function (ev, picker) {
    $(this).val(
      picker.startDate.format("DD/MM/YYYY") +
        " - " +
        picker.endDate.format("DD/MM/YYYY")
    );
    $(this).valid(); // Trigger validation
  });

  $("#serviceDate").on("cancel.daterangepicker", function (ev, picker) {
    $(this).val("");
  });

  /* MEGA MENU HOVER */
  $(".navbar .dropdown").hover(
    function () {
      $(this).addClass("show");
      $(this).find(".dropdown-menu").addClass("show");
    },
    function () {
      $(this).removeClass("show");
      $(this).find(".dropdown-menu").removeClass("show");
    }
  );

  const cityList = [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Mumbai",
    "Pune",
    "Nashik",
    "Delhi",
    "Bangalore",
  ];

  $("#cityInput")
    .autocomplete({
      source: cityList,
      minLength: 0,
    })
    .focus(function () {
      $(this).autocomplete("search", "");
    })
    .on("autocompleteselect", function () {
      $(this).valid();
    });

  /* VALIDATION */
  $("#bookingForm").validate({
    rules: {
      patientName: "required",
      mobile: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
      diseases: "required",
      cityInput: "required",
      serviceDate: "required",
      staffCount: {
        required: true,
        digits: true,
        min: 1,
      },
      address: "required",
    },

    messages: {
      patientName: "Please enter patient name",
      mobile: {
        required: "Please enter mobile number",
        digits: "Please enter only digits",
        minlength: "Mobile number must be 10 digits",
        maxlength: "Mobile number must be 10 digits",
      },
      diseases: "Please select at least one disease",
      cityInput: "Please enter city name",
      serviceDate: "Please select service date",
      staffCount: {
        required: "Please enter number of staff",
        digits: "Please enter only numbers",
        min: "At least 1 staff required",
      },
      address: "Please enter address",
    },

    errorClass: "text-danger",
    validClass: "is-valid",

    highlight: function (element) {
      $(element).addClass("is-invalid").removeClass("is-valid");

      // Handle multiselect separately
      if ($(element).attr("id") === "diseaseList") {
        $(element)
          .siblings(".btn-group")
          .addClass("is-invalid")
          .removeClass("is-valid");
      }
    },

    unhighlight: function (element) {
      $(element).removeClass("is-invalid").addClass("is-valid");

      // Handle multiselect separately
      if ($(element).attr("id") === "diseaseList") {
        $(element)
          .siblings(".btn-group")
          .removeClass("is-invalid")
          .addClass("is-valid");
      }
    },

    onkeyup: function (element) {
      $(element).valid();
    },

    onfocusout: function (element) {
      $(element).valid();
    },

    submitHandler: function (form) {
      // Get selected diseases
      var selectedDiseases = $("#diseaseList").val();
      var diseasesText = selectedDiseases
        ? selectedDiseases.join(", ")
        : "None";

      Swal.fire({
        icon: "success",
        title: "Booking Successful!",
        html: `
          <div style="text-align: left; padding: 10px;">
            <p style="text-align: left; padding: 3px;"><b>Patient Name:</b> ${$(
              "input[name=patientName]"
            ).val()}</p>
            <p style="text-align: left; padding: 3px;"><b>Service Date:</b> ${$(
              "#serviceDate"
            ).val()}</p>
            <p style="text-align: left; padding: 3px;"><b>Mobile:</b> ${$(
              "input[name=mobile]"
            ).val()}</p>
          </div>
        `,
        confirmButtonColor: "#24b1a6",
        confirmButtonText: "OK",
      }).then(() => {
        location.reload();
      });
    },
  });

  /* CLEAR BUTTON */
  $("#clearBtn").click(function () {
    location.reload();
  });

  /* MULTISELECT CHANGE EVENT - Trigger validation */
  $("#diseaseList").on("change", function () {
    $(this).valid();
  });
});

function allowLettersOnly(input) {
  input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
}
function allowNumbersOnly(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}
