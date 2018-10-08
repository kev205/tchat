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
                    $('.container:eq(0)').append('<br>').append($('<div class="alert alert-warning"></div>').html('<center>Aucun champ ne doit etre vide</center>'));
                    $('#phone').val(localStorage.getItem('tel'));
                    $('#pseudo').val(localStorage.getItem('pseudo'));
                }
            });
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
                    localStorage.setItem('tel', $('#phone').val());
                    localStorage.setItem('pseudo', $('#pseudo').val());
                    $('body').html(data);
                    if (error) {
                        switch (error) {
                            case '1062':
                                $('.container:eq(0)').append('<br>').append($('<div class="alert alert-danger"></div>').html('<center>Le numero est deja utilise</center>'));
                                break;
                        }
                    }
                    $('#phone').val(localStorage.getItem('tel'));
                    $('#pseudo').val(localStorage.getItem('pseudo'));
                }
            });
        }
        setTimeout(function () {
            $('.alert').remove();
        }, 5000);
    });
});