$(document).ready(function () {
    const loader = $("#loader");
    
    // Global AJAX Loader
    $(document)
      .ajaxStart(function () {
        loader.removeClass('d-none'); 
      })
      .ajaxStop(function () {
        // Add a small delay so the loader is visible
        setTimeout(function() {
          loader.addClass('d-none'); 
        }, 100);
      });
  
    // LOAD COUNTRIES (GET)
    $.ajax({
      url: "https://countriesnow.space/api/v0.1/countries/",
      method: "GET",
      success: function (response) {
        const countries = response.data;
        countries.forEach((country) => {
          $("#country").append(
            `<option value="${country.country}">${country.country}</option>`
          );
        });
        console.log(countries);
      },
      error: function () {
        alert("Failed to load countries");
      },
    });
    
    // LOAD STATES (POST)
    $("#country").change(function () {
      const selectedCountry = $(this).val();
  
      $("#state")
        .html('<option value="">Select State</option>')
        .prop("disabled", true);
      $("#city")
        .html('<option value="">Select City</option>')
        .prop("disabled", true);
  
      if (!selectedCountry) return;
  
      $.ajax({
        url: "https://countriesnow.space/api/v0.1/countries/states",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          country: selectedCountry,
        }),
        success: function (response) {
          const states = response.data.states;
  
          states.forEach((state) => {
            $("#state").append(
              `<option value="${state.name}">${state.name}-${state.state_code}</option>`
            );
          });
          console.log(states);
  
          $("#state").prop("disabled", false);
        },
        error: function () {
          alert("Failed to load states");
        },
      });
    });
  
    // LOAD CITIES (POST)
    $("#state").change(function () {
      const country = $("#country").val();
      const state = $(this).val();
  
      $("#city")
        .html('<option value="">Select City</option>')
        .prop("disabled", true);
  
      if (!state) return;
  
      $.ajax({
        url: "https://countriesnow.space/api/v0.1/countries/state/cities",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          country: country,
          state: state,
        }),
        success: function (response) {
          response.data.forEach((city) => {
            $("#city").append(`<option value="${city}">${city}</option>`);
          });
  
          $("#city").prop("disabled", false);
        },
        error: function () {
          alert("Failed to load cities");
        },
      });
    });
  });