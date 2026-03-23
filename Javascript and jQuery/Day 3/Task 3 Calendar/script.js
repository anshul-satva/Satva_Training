let selectedSlot = null;
let calendar;
let selectedEvent = null;

document.addEventListener("DOMContentLoaded", function () {
  const modal = new bootstrap.Modal(document.getElementById("bookingModal"));

  calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    initialView: "dayGridMonth",
    selectable: true,

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },

    dateClick(info) {
      selectedSlot = { start: info.date, end: info.date };
      selectedEvent = null; // create mode
      $("#bookingForm")[0].reset();
      modal.show();
    },

    select(info) {
      selectedSlot = info;
      selectedEvent = null;
      $("#bookingForm")[0].reset();
      modal.show();
    },

    eventClick(info) {
      selectedEvent = info.event;
      selectedSlot = {
        start: info.event.start,
        end: info.event.end,
      };

      // Prefill form
      $("#patientName").val(info.event.title);
      $("#mobile").val(info.event.extendedProps.mobile);
      $("#deleteBtn").removeClass("d-none");
      $("#confBtn").addClass("d-none");
      $("#editBtn").removeClass("d-none");
      modal.show();
    },
  });

  calendar.render();
});

$(document).ready(function () {
  $("#bookingForm").validate({
    rules: {
      patientName: {
        required: true,
        minlength: 3,
      },
      mobile: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
    },

    messages: {
      patientName: {
        required: "Please enter patient name",
        minlength: "Minimum 3 characters required",
      },
      mobile: {
        required: "Please enter mobile number",
        minlength: "Mobile must be 10 digits",
        maxlength: "Mobile must be 10 digits",
      },
    },

    errorClass: "text-danger",
    validClass: "is-valid",

    highlight: function (element) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },

    unhighlight: function (element) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },

    submitHandler: function () {
      if (!selectedSlot) {
        alert("Please select a date");
        return;
      }

      if (selectedEvent) {
        // EDIT EVENT
        selectedEvent.setProp("title", $("#patientName").val());
        selectedEvent.setExtendedProp("mobile", $("#mobile").val());
        selectedEvent.setStart(selectedSlot.start);
        selectedEvent.setEnd(selectedSlot.end);
        $("#deleteBtn").removeClass("d-none");
        $("#confBtn").addClass("d-none");
        $("#editBtn").removeClass("d-none");
      } else {
        // CREATE EVENT
        calendar.addEvent({
          title: $("#patientName").val(),
          start: selectedSlot.start,
          end: selectedSlot.end,
          extendedProps: {
            mobile: $("#mobile").val(),
          },
        });
      }

      $("#bookingModal").modal("hide");
      $("#bookingForm")[0].reset();
      $(".form-control").removeClass("is-valid is-invalid");
      calendar.unselect();
      selectedSlot = null;
      selectedEvent = null;
    },
  });
});

function allowLettersOnly(input) {
  input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
}
function allowNumbersOnly(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}
$("#deleteBtn").click(function () {
  if (selectedEvent) {
    selectedEvent.remove(); // delete event
  }

  $("#bookingModal").modal("hide");
  $("#bookingForm")[0].reset();
  $(".form-control").removeClass("is-valid is-invalid");
  selectedEvent = null;
  selectedSlot = null;
  $("#deleteBtn").addClass("d-none");
  $("#editBtn").addClass("d-none");
});
