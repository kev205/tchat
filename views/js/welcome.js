$(document).ready(function () {
  var socket = io.connect('/');
  socket.on('user connect', function () {
    getConnected(populate_connected_list);
  })
    .on('user quit', function () {
      getConnected(populate_connected_list);
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
    for (var i = 0; i < connected_list.length; i++) {
      if ($('#' + connected_list[i].TEL).length == 0) {
        $('.nav:eq(0)').append($('<li class="nav-item"></li>').attr('id', connected_list[i].TEL));
        $('#' + connected_list[i].TEL).append($('<a class="nav-link"></a>').attr('href', '#').html(connected_list[i].PSEUDO + '<br>'));
      }
    }
  }
});