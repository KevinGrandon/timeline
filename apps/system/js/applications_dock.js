(function() {

  var iconConfig = [
    ['app://communications.gaiamobile.org/manifest.webapp', 'contacts'],
    ['app://search.gaiamobile.org/manifest.webapp']
  ];

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
      icon.addEventListener('touchstart', this)
      icon.addEventListener('touchend', this)
    });
  }

  ApplicationDock.prototype = {

    /**
     * Renders the system-wide dock once applications is ready.
     */
    render: function() {
      var html = '';
      iconConfig.forEach((tuple, index) => {
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

    /**
     * Brings up a menu to replace an icon in the SHB menu.
     */
    customizeIcon: function(element) {
      var select = document.createElement('select');
      var thisSlot = element.id.match(/quick-app-([0-9]+)/)[1];
      var entryPoint = element.dataset && element.dataset.entryPoint;

      function renderOption(manifestUrl, descriptor, entryPoint) {
        var option = document.createElement('option');
        option.text = descriptor.name;
        option.value = manifestUrl + (entryPoint ? ',' + entryPoint : '');

        // Select the option if the manifestUrl matches, and entryPoint if we have one.
        if (manifestUrl === iconConfig[thisSlot - 1][0] && (!entryPoint || entryPoint == iconConfig[thisSlot - 1][1])) {
          option.selected = true;
        }
        select.appendChild(option);
      }

      for (var manifestUrl in applications.installedApps) {
        var app = applications.installedApps[manifestUrl];
        var manifest = app.manifest || app.updateManifest;

        if (manifest.entry_points) {
          for (var eachPoint in manifest.entry_points) {
            renderOption(manifestUrl, manifest.entry_points[eachPoint], eachPoint);
          }
        } else {
          renderOption(manifestUrl, manifest);
        }
      }

      document.body.appendChild(select);
      select.focus();

      var onBlur = () => {
        cleanup();
      };

      var onChange = e => {
        // This will split the url into an array of manifestUrl, entryPoint.
        // If an entrypoint does not exist, it will just be a one-object array.
        var newDefinition = select.value.split(',');

        iconConfig[thisSlot - 1] = newDefinition;
        this.render();
        cleanup();
      };

      function cleanup() {
        select.removeEventListener('blur', onBlur);
        select.removeEventListener('change', onChange);
        document.body.removeChild(select);
      }

      select.addEventListener('blur', onBlur);
      select.addEventListener('change', onChange);
    },

    handleEvent: function(e) {

      switch (e.type) {
        case 'touchstart':
          this.customizationPress = setTimeout(() => {
            this.customizeIcon(e.target);
          }, 800);
          break;

        case 'touchend':
          clearTimeout(this.customizationPress);
          this.customizationPress = null;
          break;

        case 'click':
          // Reset long-press logic to avoid customization screen.
          clearTimeout(this.customizationPress);
          this.customizationPress = null;

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
