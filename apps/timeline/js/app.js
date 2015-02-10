'use strict';

(function(exports) {

  function App() {
    window.addEventListener('hashchange', this);
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
    },

    handleEvent: function(e) {
      switch(e.type) {
        case 'hashchange':
          var timeContainer = document.getElementById('now');
          var nowTop = timeContainer.getBoundingClientRect().top;
          var scrollTo = document.documentElement.scrollTop + nowTop;
          document.documentElement.scrollTo({left: 0, top: scrollTo, behavior: 'smooth'});
          break;
      }
    }

  };

  exports.app = new App();
  exports.app.render();

}(window));
