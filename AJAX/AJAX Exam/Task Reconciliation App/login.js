$(document).ready(function () {

    // Custom validator for fixed password
    $.validator.addMethod(
      "fixedPassword",
      function (value) {
        return value === "Satva1213#";
      },
      "Password is wrong"
    );
  
    $("#loginForm").validate({
      // RULES
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          fixedPassword: true
        }
      },
  
      // MESSAGES
      messages: {
        email: {
          required: "Email is required",
          email: "Enter a valid email address"
        },
        password: {
          required: "Password is required"
        }
      },
  
      //BOOTSTRAP ERROR STYLING
      errorElement: "div",
      errorClass: "invalid-feedback",
      highlight: function (element) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element) {
        $(element).removeClass("is-invalid");
      },
      errorPlacement: function (error, element) {
        error.insertAfter(element);
      },
  
      // ONLY CALLED IF VALIDATION PASSES
      submitHandler: function () {

        const email = $("input[name='email']").val();
        const password = $("input[name='password']").val();
      
        $.ajax({
          url: "http://trainingsampleapi.satva.solutions/api/auth/login",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            Email: email,
            Password: password
          }),
          success: function (response) {
            console.log(response); 
            const token = response.token;
            localStorage.setItem("token", token);
            alert("Login successful. Token stored in localStorage.");
            window.location.href = "index.html";
          },
          error: function (err) {
            console.error(err);
            alert("Login failed from server");
          }
        });
      }
      
    });
  
  });
  