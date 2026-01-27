document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const file = document.getElementById('file');
    var filename = file.value;
    var parts = filename.split('.');
    var fileExt = parts[parts.length - 1];
   
    if (['xlsx', 'xlsm', 'xlsb', 'xls', 'xltx', 'xltm', 'csv', 'xlam'].includes(fileExt))
    {
        alert('Excel file Uploaded');
    }
    else
    {
        alert('Add an excel file');
    }
});