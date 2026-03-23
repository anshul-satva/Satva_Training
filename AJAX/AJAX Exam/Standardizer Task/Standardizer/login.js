$(document).ready(function () {
  $.validator.addMethod(
    "fixedPassword",
    function (value) {
      return value === "Satva1213#";
    },
    "Password is wrong"
  );

  $("#loginForm").validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        fixedPassword: true,
      },
    },

    messages: {
      email: {
        required: "Email is required",
        email: "Enter a valid email address",
      },
      password: {
        required: "Password is required",
      },
    },

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

    submitHandler: function () {
      const email = $("input[name='email']").val();
      const password = $("input[name='password']").val();

      if (email && password === "Satva1213#") {
        localStorage.setItem("token", "token");
        alert("Login successful");
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials");
      }
    }
  });
});
