'use strict';

(function(exports) {

  function App() {
  }

  App.prototype = {

    render: function() {
      alert('got it.');
    }

  };

  exports.app = new App();
  exports.app.render();

}(window));
