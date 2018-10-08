/* eslint-disable */

$(document).ready(function () {
    $('#connect').on('click', function () {
        window.location = '/';
    });
    $('#creer').on('click', function () {
        var test = $('#pseudo').val() | $('#password').val();
        if (test == '') {
            alert('aucn champ ne doit etre vide');
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
                                $('.error').html('Le numero est deja utilise');
                                alert('Le numero est deja utilise');
                                break;
                        }
                    }
                }
            });
        }
    });
});