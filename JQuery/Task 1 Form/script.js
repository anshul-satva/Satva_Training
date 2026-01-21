// STATE AND CITY DATA
const stateCityData = {
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Davangere'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman']
};

const states = Object.keys(stateCityData);

function allowLettersOnly(input) {
    input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
}
function allowNumbersOnly(input) {
    input.value = input.value.replace(/[^0-9]/g, "");
}
function allowDecimalOnly(input) {
    // remove invalid characters
    input.value = input.value.replace(/[^0-9.]/g, "");

    // allow only one decimal point
    const parts = input.value.split(".");
    if (parts.length > 2) {
        input.value = parts[0] + "." + parts.slice(1).join("");
    }
}

// JQUERY VALIDATION - ALL IN ONE PLACE
$('#studentForm').validate({
    rules: {
        name: {
            required: true,
            lettersonly: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10
        },
        email: {
            required: true,
            email: true,
            
        },
        collegeName: {
            required: true,
            lettersonly: true
        },
        cgpa: {
            required: true,
            number: true,
            min: 0,
            max: 10
        },
        branchName: {
            required: true
        },
        state: {
            required: true
        },
        city: {
            required: true
        },
        zip: {
            required: true,
            digits: true,
            minlength: 6,
            maxlength: 6
        },
        daterange: {
            required: true
          }          
    },
    
    messages: {
        name: {
            required: "Name is required",
            lettersonly: "Name should contain only letters"
        },
        mobile: {
            required: "Mobile number is required",
            digits: "Only digits allowed",
            minlength: "Mobile number must be 10 digits",
            maxlength: "Mobile number must be 10 digits"
        },
        email: {
            required: "Email is required",
            email: "Please enter a valid email"
        },
        collegeName: {
            required: "College name is required",
            lettersonly: "College name should contain only letters"
        },
        cgpa: {
            required: "CGPA is required",
            number: "Please enter a valid number",
            min: "CGPA must be between 0 and 10",
            max: "CGPA must be between 0 and 10"
        },
        branchName: "Please select a branch",
        state: "Please select a state",
        city: "Please select a city",
        zip: {
            required: "Zip code is required",
            minlength: "Zip code must be 6 digits",
            maxlength: "Zip code must be 6 digits"
        },
        daterange: "Please select a date"
    },
    
    errorPlacement: function(error, element) {
        error.addClass('text-danger small');
        error.insertAfter(element);
    },

    highlight: function(element) {
        $(element).addClass('is-invalid').removeClass('is-valid');
    },
    
    unhighlight: function(element) {
        $(element).removeClass('is-invalid').addClass('is-valid');
    },

    onkeyup: function(element) {
        $(element).valid();
    },
    
    onfocusout: function(element) {
        $(element).valid();
    },

    submitHandler: function(form) {
        // Create student record
        const studentRecord = {
            name: $('#name').val().trim(),
            mobile: $('#mobile').val().trim(),
            email: $('#email').val().trim(),
            collegeName: $('#collegeName').val().trim(),
            cgpa: $('#cgpa').val().trim(),
            branchName: $('#branchName').val(),
            state: $('#state').val().trim(),
            city: $('#city').val().trim(),
            zip: $('#zip').val().trim(),
            duration: $('#daterange').val()
        };

        // Get existing records
        let records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
        
        // Add new record
        records.push(studentRecord);
        
        // Save to localStorage
        localStorage.setItem('studentRecords', JSON.stringify(records));
        
        // Reset form
        form.reset();
        
        // Remove all validation classes (green/red borders)
        $(form).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        
        // Disable city field again
        $('#city').prop('disabled', true);
        
        // Show success
        showAlert('Record added successfully!', 'success');
    }
});

// Custom validation for letters only
$.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
});

// LOOK-AHEAD DROPDOWN FOR STATE
$('#state').on('focus', function() {
    showDropdown('state', states, '');
}).on('input', function() {
    showDropdown('state', states, $(this).val().toLowerCase());
});

$(document).on('click', '#stateDropdown .dropdown-item', function(e) {
    e.preventDefault();
    $('#state').val($(this).data('value')).valid();
    $('#stateDropdown').hide();
    $('#city').val('').prop('disabled', false).removeClass('is-valid is-invalid');
});

// LOOK-AHEAD DROPDOWN FOR CITY
$('#city').on('focus', function() {
    const state = $('#state').val();
    if (state && stateCityData[state]) {
        showDropdown('city', stateCityData[state], '');
    }
}).on('input', function() {
    const state = $('#state').val();
    if (state && stateCityData[state]) {
        showDropdown('city', stateCityData[state], $(this).val().toLowerCase());
    }
});

$(document).on('click', '#cityDropdown .dropdown-item', function(e) {
    e.preventDefault();
    $('#city').val($(this).data('value')).valid();
    $('#cityDropdown').hide();
});

// Generic dropdown function
function showDropdown(type, data, searchTerm) {
    const dropdown = $(`#${type}Dropdown`);
    dropdown.empty();
    
    const filtered = data.filter(item => item.toLowerCase().includes(searchTerm));
    
    if (filtered.length > 0) {
        filtered.forEach(item => {
            dropdown.append(`<a class="dropdown-item" href="#" data-value="${item}">${item}</a>`);
        });
        dropdown.css({ display: 'block', position: 'absolute', width: '100%', zIndex: 1000 });
    } else {
        dropdown.hide();
    }
}

// Hide dropdowns on outside click
$(document).click(function(e) {
    if (!$(e.target).closest('#state, #stateDropdown').length) $('#stateDropdown').hide();
    if (!$(e.target).closest('#city, #cityDropdown').length) $('#cityDropdown').hide();
});

// EXPORT BUTTON
$('#exportBtn').click(function() {
    const records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    
    if (records.length === 0) {
        showAlert('No records found!', 'warning');
        $('#tableSection').hide();
        return;
    }

    $('#dataTableBody').empty();
    
    records.forEach(record => {
        $('#dataTableBody').append(`
            <tr>
                <td>${record.name}</td>
                <td>${record.mobile}</td>
                <td>${record.email}</td>
                <td>${record.collegeName}</td>
                <td>${record.cgpa}</td>
                <td>${record.branchName}</td>
                <td>${record.state}</td>
                <td>${record.city}</td>
                <td>${record.zip}</td>
                <td>${record.duration}</td>
            </tr>
        `);
    });
    
    $('#tableSection').show();
    showAlert(`${records.length} record(s) exported!`, 'success');
});

// CLEAR STORAGE BUTTON
$('#clearStorageBtn').click(function() {
    if (confirm('Clear all data?')) {
        localStorage.removeItem('studentRecords');
        $('#dataTableBody').empty();
        $('#tableSection').hide();
        showAlert('Storage cleared!', 'info');
    }
});

// ALERT FUNCTION
function showAlert(message, type) {
    $('#alertContainer').html(`
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    setTimeout(() => $('.alert').fadeOut(), 3000);
}

$(function () {
    $('#daterange').daterangepicker({
      opens: 'up',
    });
  });
  