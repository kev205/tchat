/* eslint-disable */

$(document).ready(function () {
    $('#connect').on('click', function () {});
    $('#creer').on('click', function () {
        $.ajax({
            url: '/sign',
            beforeSend: function (request) {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            type: 'POST',
            dataType: 'html',
            data: 'LOGIN=' + $('#login').val() + '&PSSWD=' + $('#password').val(),
            async: false,
            success: function (data) {
                $('body').html(data);
            }
        });
    });
});