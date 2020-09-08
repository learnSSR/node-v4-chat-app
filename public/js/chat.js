var socket = io();

function scrollToBottom () {
  //selectores
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ul = jQuery('<ul></ul>').addClass('user_list');
  users.forEach(function (user) {
    ul.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ul);
  jQuery('.user_list li').on('click', inflateMessage);
});


socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  if (socket.id === message.id) {
  }

  var html = renderMessage(message, formattedTime, socket.id);

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (locationMessage) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  if (socket.id === message.id) {
  }

  var html = renderLocationMessage(locationMessage, formattedTime, socket.id);

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val(),
  }, function () {
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  });
});

jQuery('.sidebar-toggle-button').on('click', showSidebar);
jQuery('.chat__sidebar').on('click', hideSidebar);
