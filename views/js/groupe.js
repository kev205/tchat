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
            data: 'NAME=' + $('#name').val() + '&TEL=' + getCookie('tel'),
            async: false,
            success: function (data) {
                $('body').html(data);
            },
        });
    });
});


function getCookie(name) {
    var regex = new RegExp('(?:; )?' + name + '=([^;]*);?');
    if (regex.test(document.cookie)) {
      return decodeURIComponent(RegExp.$1);
    } else {
      return null;
    }
  }