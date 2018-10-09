/* eslint-disable */

$(document).ready(function () {
    $('#cancel').on('click', function () {
        window.location = '/';
    });

    $('#create').on('click', function () {
        localStorage.clear();
        $.ajax({
            url: '/save',
            beforeSend: function (request) {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            type: 'POST',
            dataType: 'html',
            data: 'TEL=' + $('#phone').val() + '&PSEUDO=' + $('#pseudo').val(),
            async: false,
            success: function (data, status, response) {
                $('body').html(data);
            }
        });
    });
});