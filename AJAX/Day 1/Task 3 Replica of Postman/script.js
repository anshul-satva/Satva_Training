$(document).ready(function () {
  const methodSelect = $("#method");
  const headersBox = $("#headersBox");
  const bodyBox = $("#bodyBox");

  function toggleFields() {
    const method = methodSelect.val();

    if (method === "POST" || method === "PUT" || method === "PATCH") {
      headersBox.removeClass("d-none");
      bodyBox.removeClass("d-none");
    } else {
      headersBox.addClass("d-none");
      bodyBox.addClass("d-none");
      $("#headers, #body").val("").removeClass("is-valid is-invalid");
    }
  }
  toggleFields();
  methodSelect.on("change", toggleFields);

  /* CUSTOM METHOD FOR JSON */
  $.validator.addMethod("validJSON", function (value) {
    if (!value) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  });

  /* FORM VALIDATION */
  $("#apiForm").validate({
    errorClass: "is-invalid",
    validClass: "is-valid",
    errorPlacement: function (error, element) {
      element.next(".invalid-feedback").text(error.text());
    },

    rules: {
      url: {
        required: true,
        url: true,
      },
      headers: {
        validJSON: true,
      },
      body: {
        required: function () {
          const m = methodSelect.val();
          return m === "POST" || m === "PUT" || m === "PATCH";
        },
        validJSON: true,
      },
    },

    messages: {
      url: {
        required: "API URL is required",
        url: "Enter a valid URL",
      },
      headers: {
        validJSON: "Headers must be valid JSON",
      },
      body: {
        required: "Request body is required",
        validJSON: "Body must be valid JSON",
      },
    },

    submitHandler: function () {
      const url = $("#url").val();
      const method = methodSelect.val();
      const headers = $("#headers").val()
        ? JSON.parse($("#headers").val())
        : {};
      const body = $("#body").val();
      if (headers === "") {
        $("#headers").val("").removeClass("is-valid is-invalid");
      }

      let ajaxOptions = {
        url: url,
        method: method,
        headers: headers,
        success: function (res, textStatus, xhr) {
          $("#status").text(xhr.status);
          $("#status-text").text(xhr.statusText);
          $("#response").text(JSON.stringify(res, null, 2));
        },
        error: function (xhr) {
          $("#status").text(xhr.status);
          $("#status-text").text(xhr.statusText);
          $("#response").text(xhr.responseText || "Error");
        },
      };

      if (method === "POST" || method === "PUT" || method === "PATCH") {
        ajaxOptions.data = body;
        ajaxOptions.contentType = "application/json";
      }

      $.ajax(ajaxOptions);
    },
  });
});
