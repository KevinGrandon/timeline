'use strict';

(function(exports) {

  function App() {
  }

  App.prototype = {

    render: function() {
      var timeContainer = document.getElementById('now');
      var currentTime = new CurrentTimeItem(timeContainer);
    }

  };

  exports.app = new App();
  exports.app.render();

}(window));
