/* eslint-disable */

$(document).ready(function () {
    $('#connect').on('click', function () {
        window.location = '/';
    });
    $('#creer').on('click', function () {
        var vide = false;
        for (var i = 0; i < $('.form-control').length; i++) {
            if ($('.form-control').eq(i).val() == '') {
                vide = true;
                break;
            }
        }
        if (vide) {
            alert('aucn champ ne doit etre vide');
            $.ajax({
                url: '/sign',
                type: 'GET',
                dataType: 'html',
                async: false,
                success: function (data) {
                    $('body').html(data);
                }
            });
        } else {
            $.ajax({
                url: '/sign',
                beforeSend: function (request) {
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                },
                type: 'POST',
                dataType: 'html',
                data: 'TEL=' + $('#phone').val() + '&PSEUDO=' + $('#pseudo').val() + '&PSSWD=' + $('#password').val(),
                async: false,
                success: function (data, status, response) {
                    var error = response.getResponseHeader('sign-in-error');
                    if (error) {
                        switch (error) {
                            case '1062':
                                alert('Le numero est deja utilise');
                                break;
                        }
                    }
                    $('body').html(data);
                }
            });
        }
    });
});