(function() {

  function ApplicationDock() {
    this.map = new WeakMap();
    this.icons = [
      document.getElementById('quick-app-1'),
      document.getElementById('quick-app-2')
    ];

    if (applications && applications.ready) {
      this.render();
    } else {
      window.addEventListener('applicationready', this);
    }

    this.icons.forEach(icon => {
      icon.addEventListener('click', this)
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
      manifests.forEach((tuple, index) => {
        var manifest = tuple[0];
        var entryPoint = tuple[1];

        var app = applications.getByManifestURL(manifest);
        var manifest = app.manifest || app.updateManifest;
        var icons = (!entryPoint ? manifest.icons : manifest.entry_points[entryPoint].icons);

        var targetedPixelSize = 20 * Math.ceil(window.devicePixelRatio || 1);

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

        var thisIcon = this.icons[index];
        thisIcon.className = 'icon';
        thisIcon.style.backgroundImage = 'url(' + app.origin + icons[preferredSize] + ')';
        if (entryPoint) {
          thisIcon.setAttribute('data-entry-point', entryPoint)
        }

        this.map.set(thisIcon, app);
      });
    },

    handleEvent: function(e) {

      switch (e.type) {
        case 'click':
          var icon = this.map.get(e.target);
          if (icon && e.target.dataset && e.target.dataset.entryPoint) {
            icon.launch(e.target.dataset.entryPoint);
          } else if(icon) {
            icon.launch();
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
