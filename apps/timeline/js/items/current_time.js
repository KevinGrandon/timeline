(function(exports) {

  function CurrentTimeItem(element) {
    this.element = element;
    navigator.mozL10n.ready(() => {
      this.start();
    });
  }

  CurrentTimeItem.prototype = {

    timeout: null,

    interval: null,

    start: function() {
      this.date = new Date();

      this.render();

      if (this.timeout == null) {
        this.timeout = window.setTimeout(() => {
          this.date = new Date();
          this.render();

          if (this.interval == null) {
            this.interval = window.setInterval(() => {
              this.date = new Date();
              this.render();
            }, 60000);
          }
        }, (60 - this.date.getSeconds()) * 1000);
      }
    },

    stop: function() {
      if (this.timeout != null) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
      }

      if (this.interval != null) {
        window.clearInterval(this.interval);
        this.interval = null;
      }
    },

    render: function() {
      var f = new navigator.mozL10n.DateTimeFormat();
      var timeFormat = '%I:%M %p'.replace('%p', '<span>%p</span>');
      var formattedTime = f.localeFormat(this.date, timeFormat);

      var dateFormat = '%A, %B %d, %Y';
      var formattedDate = f.localeFormat(this.date, dateFormat);

      this.element.innerHTML = `
        <section class="xhuge">${formattedTime}</section>
        <section class="meta">${formattedDate}</section>
      `;
    }
  };

  exports.CurrentTimeItem = CurrentTimeItem;

}(window));
