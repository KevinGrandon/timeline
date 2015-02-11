(function() {

  function ApplicationDock() {
    this.map = new WeakMap();
    this.dock = document.getElementById('dock');

    if (applications && applications.ready) {
      this.render();
    } else {
      window.addEventListener('applicationready', this);
    }

    window.addEventListener('appopening', this);
    window.addEventListener('homescreenopened', this);
    this.dock.addEventListener('click', this)

    var bottomPanel = document.getElementById('software-buttons');
    var touchEvents = ['touchstart', 'touchmove', 'touchend'];
    touchEvents.forEach(name => {
      this.dock.addEventListener(name, this);
      bottomPanel.addEventListener(name, this);
    });
  }

  ApplicationDock.prototype = {

    /**
     * Renders the system-wide dock once applications is ready.
     */
    render: function() {
      var manifests = [
        ['app://communications.gaiamobile.org/manifest.webapp', 'contacts'],
        ['app://search.gaiamobile.org/manifest.webapp']
      ];

      var html = '';
      manifests.forEach(tuple => {
        var manifest = tuple[0];
        var entryPoint = tuple[1];

        var app = applications.getByManifestURL(manifest);
        var manifest = app.manifest || app.updateManifest;
        var icons = (!entryPoint ? manifest.icons : manifest.entry_points[entryPoint].icons);

        var targetedPixelSize = 60 * Math.ceil(window.devicePixelRatio || 1);

        var preferredSize = Number.MAX_VALUE;
        var max = 0;

        for (var size in icons) {
          size = parseInt(size, 10);
          if (size > max) {
            max = size;
          }

          if (size >= targetedPixelSize && size < preferredSize) {
            preferredSize = size;
          }
        }
        // If there is an icon matching the preferred size, we return the result,
        // if there isn't, we will return the maximum available size.
        if (preferredSize === Number.MAX_VALUE) {
          preferredSize = max;
        }

        var thisIcon = document.createElement('span');
        thisIcon.className = 'icon';
        thisIcon.style.backgroundImage = 'url(' + app.origin + icons[preferredSize] + ')';
        if (entryPoint) {
          thisIcon.setAttribute('data-entry-point', entryPoint)
        }
        this.dock.appendChild(thisIcon);

        this.map.set(thisIcon, app);
      });
    },

    handleEvent: function(e) {

      switch (e.type) {
        case 'click':
          // Reset the gesture.
          this.startY = null;

          var icon = this.map.get(e.target);
          if (icon && e.target.dataset && e.target.dataset.entryPoint) {
            icon.launch(e.target.dataset.entryPoint);
          } else if(icon) {
            icon.launch();
          }
          break;

        case 'touchstart':
          var touch = e.touches[0];
          this.startY = touch.pageY;
          break;

        case 'touchmove':
          var touch = e.touches[0];
          var y = touch.pageY;
          var dy = y - this.startY;
          this.dock.style.transform = 'translateY(' + (dy) + 'px)';
console.log('dy is:', dy)
          if (dy > 70 && e.target.parentNode.id == 'dock') {
            this.startY = null;
            this.dock.style.transform = '';
            this.dock.classList.remove('default-maximized');
          } else if (dy < -50 && e.target.id == 'software-buttons') {
            this.startY = null;
            this.dock.style.transform = '';
            this.dock.classList.add('default-maximized');
          }
          break;

        case 'touchend':
          this.startY = null;
          this.dock.style.transform = '';
          break;

        case 'homescreenopened':
          this.dock.classList.add('default-maximized');
          break;

        case 'appopening':
          var activeApp = Service.currentApp;
          if (activeApp.isHomescreen) {
            this.dock.classList.add('default-maximized');
          } else {
            this.dock.classList.remove('default-maximized');
          }
          break;

        case 'applicationready':
          window.removeEventListener('applicationready', this);
          this.render();
          break;
      }
    }

  };

  (new ApplicationDock());

}(window));
