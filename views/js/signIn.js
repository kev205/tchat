/* eslint-disable */

$(document).ready(function () {

    $('#image').on('change', function(){
        var path = document.getElementById('image');
        alert(window.URL.createObjectURL(path.files[0].name));
    });

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
            $('.container:eq(0)').append('<br>').append($('<div class="alert alert-warning"></div>').html('<center>Aucun champ ne doit etre vide</center>'));
            $('#phone').val(localStorage.getItem('tel'));
            $('#pseudo').val(localStorage.getItem('pseudo'));
        } else {
            var regex = /^(6)[5-9][0-9]{7}/;
            var regex1 = /^[a-zA-Z0-9_]{4,}$/;
            if (regex.test($('#phone').val()) && regex1.test($('#password').val())) {
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
            } else $('.container:eq(0)').append('<br>').append($('<div class="alert alert-danger"></div>').html('<center>numero incorrect ou mot de passe trop court</center>'));
        }
        setTimeout(function () {
            $('.alert').remove();
        }, 5000);
    });
});