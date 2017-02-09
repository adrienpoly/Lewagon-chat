var promo = 49; // change to your own promo id
var baseUrl = "https://wagon-chat.herokuapp.com/";
var all_messages = [];

$(document).ready(function() {
  getNewMessages();
  $('#refresh').click(function(e){
    e.preventDefault();
    getNewMessages();
  });

  $('#post-message').click(function(e){
    e.preventDefault();
    var message = $('#your-message').val();
    sendMessage(message, 'Adrien');
  });
  setInterval(getNewMessages, 10000);
});

function getNewMessages() {
  var url = baseUrl + promo + "/comments";
  $.get(url, function(data) {
    data.forEach( function(message){
      if (all_messages.includes(message.id) === false){
        appendMessage(message.content, message.author, message.created_at, message.id);
      }
    });
  });
}

function sendMessage(message, author) {
  var url = baseUrl + promo + "/comments";
  var json = JSON.stringify({
    "content": message,
    "author": author
  });

  $.ajax({
    type: "POST",
    url: url,
    data: json,
    success: function(data) {
      appendMessage(data.content, data.author, data.created_at, data.id);
      $('#your-message').val('');
    }
  });
}


function appendMessage(message, author, created_at, id){
  all_messages.push(id);
  var class_user = 'other';
  if (author === 'Adrien'){
    class_user = 'you';
  }
  message = message.replace(/<script>/g, "").replace(/<\/script>/g, "");
  var full_message = $('<li class=' + class_user + '>');
  var user = $('<a class="user" href="#">').html('<img alt="" src="https://s3.amazonaws.com/uifaces/faces/twitter/toffeenutdesign/128.jpg" />');
  var date = $('<div class="date">').text('posted by ' + author + ' '+ getMinutes(created_at) + ' ago');
  var message = $('<div class="message">').html('<p>"'+ message + '"</p>');
  full_message.append(user, date, message);
  // full_message = full_message.replace(/<script>/g, "").replace(/<\/script>/g, "");
  console.log(full_message);
  $('#messages>ul').prepend(full_message);
}


function getMinutes(created_at){
  var nb_minutes = Math.round((Date.now() - new Date(created_at)) / 60000);
  if (parseInt(nb_minutes / 525600) > 0) {
    return parseInt(nb_minutes / 525600) + "year";
  }
  if (parseInt(nb_minutes / 17280) > 0) {
    return parseInt(nb_minutes / 17280) + "month";
  }
  if (parseInt(nb_minutes / 1440) > 0) {
    return parseInt(nb_minutes / 1440) + "day";
  }
  if (parseInt(nb_minutes / 60) > 0) {
    return parseInt(nb_minutes / 60) + "hour";
  }
  return nb_minutes + "min";
}
