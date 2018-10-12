var LOGIN;

$(document).ready(function () {
  var socket = io.connect('/');
  socket.on('welcome', function (data) {
    LOGIN = data.LOGIN;
    localStorage.setItem('tel', data.TEL);
  })
    .on('user connect', function () {
      getConnected(populate_connected_list);
    })
    .on('user quit', function () {
      getConnected(populate_connected_list);
    });

  $('.nav-item:eq(1)').on('click', function(){
    document.cookie = 'user_tel=;expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'user_pseudo=;expires=Thu, 01 Jan 1970 00:00:00 UTC';
  });

  function getConnected(callback) {
    $.ajax({
      url: '/connected',
      type: 'GET',
      dataType: 'JSON',
      async: true,
      success: function (data) {
        callback(data);
      }
    });
  }

  function populate_connected_list(connected_list) {
    $('.nav:eq(0)').remove();
    $('.collapse:eq(0)').append($('<ul class="nav navbar-nav"></ul>'));
    for (var i = 0; i < connected_list.length; i++) {
      if (connected_list[i].PSEUDO !== LOGIN) {
        if ($('#' + connected_list[i].TEL).length == 0) {
          $('.nav:eq(0)').append($('<li class="nav-item"></li>').attr('id', connected_list[i].TEL));
          $('#' + connected_list[i].TEL).append($('<a class="nav-link"></a>').attr('href', '#').html(connected_list[i].PSEUDO + '<br>'));
          if (connected_list[i].CONNECT === 1) {
            $('#' + connected_list[i].TEL).append($('<img class="state">').attr('src', '/static/connect.png'));
          } else {
            $('#' + connected_list[i].TEL).append($('<img class="state">').attr('src', '/static/disconnect.png'));
          }
        }
      }
    }
  }
});