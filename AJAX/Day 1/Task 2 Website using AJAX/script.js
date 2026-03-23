$(document).ready(function () {
  const loader = $("#loader");
  const content = $("#content");

  function loadPage(page) {
    $.ajax({
      url: page + ".html",
      method: "GET",

      beforeSend: function () {
        loader.fadeIn(200);
        // loader.show();
      },

      success: function (response) {
        content.html(response);
      },

      error: function () {
        content.html("<p class='text-danger'>Failed to load page</p>");
      },

      complete: function () {
        loader.fadeOut(200);
        // loader.hide();
      },
    });
  }

  $(".menu").on("click", function (e) {
    e.preventDefault();

    const page = $(this).data("page");
    $(".menu").removeClass("active");
    $(this).addClass("active");

    loadPage(page);
  });

  loadPage("home");
});
