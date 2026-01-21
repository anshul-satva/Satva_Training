function submitForm(buttonName) {
    const firstName = document.getElementById('firstName').value;
    
    if (!firstName) {
        alert('Please enter a first name!');
        return;
    }

    addRowToTable(firstName, buttonName);

    document.getElementById('firstName').value = '';
}
function addRowToTable(firstName, submittedVia) {
    const fname1 = document.getElementById('row1-fname');
    const fname2 = document.getElementById('row2-fname');
    if(submittedVia=='Submit 1'){
        fname1.innerText=firstName;
    }
    if(submittedVia=='Submit 2'){
        fname2.innerText=firstName;
    }
}