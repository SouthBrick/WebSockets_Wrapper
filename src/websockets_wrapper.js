/*
 *	Web Socket Wrapper Supporting mutiple calls on same websocket connection
 *  Usage: 
 *        var data = '{value: "value"}';
 *        var newSocket = WSocket(url, callback);
 *        newSocket.send(data);
 */

var WSocket = function(url, callback) {

    this.socket = new WebSocket(url);
    this.readyState = this.socket.readyState;

    this.socket.addEventListener('message', function(message) {
        callback(message);
    });

    this.socket.addEventListener('open', function() {
        this.readyState = this.socket.readyState;
    }.bind(this));

    this.socket.addEventListener('error', function() {
        console.log('WS Error');
    });

};

WSocket.prototype.send = function(data) {
  var _data = JSON.stringify(data);

  if(this.readyState !== 1) {

    var interval = setInterval(function() {
      if(this.readyState === 1) {
        clearInterval(interval);
        this.socket.send(_data);
      }
    }.bind(this), 50);

  } else {
    this.socket.send(_data);
  }

};