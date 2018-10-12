var LOGIN;

$(document).ready(function () {
  var socket = io.connect('/');
  socket.on('welcome', function (data) {
    LOGIN = data.LOGIN;
    alert(LOGIN);
    localStorage.setItem('tel', data.TEL);
  })
    .on('new connection', function(){
      populate_connected_list(JSON.parse(localStorage.getItem('connected')));
    })
    .on('user connect', function () {
      getConnected(populate_connected_list);
    });

  function getConnected(callback) {
    localStorage.clear();
    $.ajax({
      url: '/connected',
      type: 'GET',
      dataType: 'JSON',
      async: false,
      success: function (data) {
        localStorage.setItem('connected', JSON.stringify(data));
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