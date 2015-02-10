'use strict';

(function(exports) {

  function App() {
    this.timelineEl = document.getElementById('timeline');

    window.addEventListener('hashchange', this);
    window.addEventListener('click', this);

    this._mozapps = {};
    navigator.mozApps.mgmt.getAll().onsuccess = (function gotAll(evt) {
      var apps = evt.target.result;
      apps.forEach(app => {
        this._mozapps[app.manifestURL] = app;
      });
    }).bind(this);
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
        case 'click':
          var element = e.target;
          while(true) {
            if (!element || element.id === this.timelineEl) {
              break;
            }

            if (element.dataset && element.dataset.manifestUrl && this._mozapps[element.dataset.manifestUrl]) {
              e.preventDefault();
              this._mozapps[element.dataset.manifestUrl].launch();
              break;
            }
            element = element.parentNode;
          }
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
