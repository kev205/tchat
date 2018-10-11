/* eslint-disable */

$(document).ready(function () {
    $('.back').on('click', function () {
        window.location = '/';
    });

    $('#creer').on('click', function () {
        $.ajax({
            url: '/groupe',
            beforeSend: function (request) {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            type: 'POST',
            dataType: 'text',
            data: 'NAME=' + $('#name').val() + '&TEL=' + localStorage.getItem('tel'),
            async: false,
            success: function (data) {
                $('body').html(data);
            },
        });
        alert('fait');
    });
});