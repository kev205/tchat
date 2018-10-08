/* eslint-disable */

$(document).ready(function () {
    $('#connect').on('click', function () {
        window.location = '/';
    });
    $('#creer').on('click', function () {
        localStorage.clear();
        var vide = false;
        for (var i = 0; i < $('.form-control').length; i++) {
            if ($('.form-control').eq(i).val() == '') {
                vide = true;
                break;
            }
        }
        if (vide) {
            localStorage.setItem('tel', $('#phone').val());
            localStorage.setItem('pseudo', $('#pseudo').val());
            $.ajax({
                url: '/signIn',
                type: 'GET',
                dataType: 'html',
                async: false,
                success: function (data) {
                    $('body').html(data);
                    $('.container:eq(0)').append('<br>').append($('<div class="alert alert-danger"></div>').html('<center>Aucun champ ne doit etre vide</center>'));
                    $('#phone').val(localStorage.getItem('tel'));
                    $('#pseudo').val(localStorage.getItem('pseudo'));
                }
            });
            vide = false;
        } else {
            $.ajax({
                url: '/signIn',
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
                                setTimeout(function () {
                                    $('.container:eq(0)').append('<br>').append($('<div class="alert alert-danger"></div>').html('<center>Le numero est deja utilise</center>'));
                                }, 100);
                                break;
                        }
                        localStorage.setItem('tel', $('#phone').val());
                        localStorage.setItem('pseudo', $('#pseudo').val());
                    }
                    $('body').html(data);
                    $('#phone').val(localStorage.getItem('tel'));
                    $('#pseudo').val(localStorage.getItem('pseudo'));
                }
            });
        }
    });
});