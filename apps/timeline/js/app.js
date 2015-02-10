'use strict';

(function(exports) {

  function App() {
  }

  App.prototype = {

    render: function() {
      var timeContainer = document.getElementById('now');
      var currentTime = new CurrentTimeItem(timeContainer);

      setTimeout(() => {


      // Scroll to 'now' to hide future items.
      var nowTop = timeContainer.getBoundingClientRect().top;
      document.documentElement.scrollTop = nowTop;
    });
    }

  };

  exports.app = new App();
  exports.app.render();

}(window));
