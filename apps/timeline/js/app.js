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
      getStreamData().then(results => {
        results.forEach(item => {
          switch (item.type) {
            case 'item':
              this.renderItem(item);
              break;
            case 'horizon':
              // Append a row with the future.
              var horizon = document.createElement('li');
              this.timelineEl.appendChild(horizon);
              horizon.id = 'horizon';
              horizon.innerHTML = '<section class="horizon">^ FUTURE ^</section>';

              // Also append a row with the current date and time.
              var currentTime = new CurrentTimeItem(this.timelineEl);
              break;
          }
        });

        // Scroll to 'now' to hide future items.
        var timeContainer = document.getElementById('now');
        var nowTop = timeContainer.getBoundingClientRect().top;
        document.documentElement.scrollTop = nowTop;
      });
    },

    renderItem: function(item) {
      var listItem = document.createElement('li');
      this.timelineEl.appendChild(listItem);

      if (item.manifestURL) {
        listItem.setAttribute('data-manifest-url', item.manifestURL);
      }

      if (item.iconClass) {
        var icon = document.createElement('span');
        icon.className = 'icon ' + item.iconClass;
        listItem.appendChild(icon);
      }

      ['title', 'meta', 'message'].forEach(field => {
        if (item[field]) {
          var el = document.createElement('section');
          el.className = field;
          el.textContent = item[field];
          listItem.appendChild(el);
        }
      });

      if (item.photos) {
        var thumbs = document.createElement('section');
        thumbs.className = 'thumbs';
        listItem.appendChild(thumbs);

        item.photos.forEach(photo => {
          var img = document.createElement('img');
          img.src = photo;
          thumbs.appendChild(img)
        });
      }
    },

    handleEvent: function(e) {
      switch (e.type) {
        case 'click':
          var element = e.target;
          while (true) {
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
          document.documentElement.scrollTo({
            left: 0,
            top: scrollTo,
            behavior: 'smooth'
          });
          break;
      }
    }

  };

  exports.app = new App();
  exports.app.render();

}(window));
