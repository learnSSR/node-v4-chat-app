function hideSidebar () {
  if (jQuery(window).width() <= 600) {
    jQuery('.chat__sidebar').hide();
    jQuery('.sidebar-toggle-button').show();
  }
};

function showSidebar () {
  jQuery('.chat__sidebar').show();
  jQuery('.sidebar-toggle-button').hide();
};

function inflateMessage () {
 jQuery('[name=message]').val('@' + jQuery(this).text());
};

function inflateRoom () {
  jQuery('[name=room]').val(jQuery(this).text());
};

function shiftRight (senderId, receiverId) {
  if (senderId === receiverId) {
    return {
      tag: '<div class="message_placeholder"></div>',
      color: '#68f98d',
    };
  }
  return {
      tag: '',
      color: '#eeeeee',
  };
};

function renderMessage (message, formattedTime, id) {
  var attr = shiftRight(message.id, id);
  var template =
  `<li class="message_container">
    ${attr.tag}
    <div class="message">
      <div class="message__title">
        <h4>${message.from}</h4>
        <span>${formattedTime}</span>
      </div>
      <div class="message_body">
        <p>${message.text}</p>
      </div>
    </div>
  </li>`

  template = jQuery(template);
  template.find('.message').css('background', attr.color);
  return template;
}

function renderLocationMessage (message, formattedTime, id) {
  var attr = shiftRight(message.id, id);
  var template =
  `<li class="message_container">
    ${attr.tag}
    <div class="message">
      <div class="message__title">
        <h4>${message.from}</h4>
        <span>${formattedTime}</span>
      </div>
      <div class="message_body">
        <p><a href="${message.url}"">My Current Location</a></p>
      </div>
    </div>
  </li>`

  template = jQuery(template);
  template.find('.message').css('background', attr.color);
  return template;
}
