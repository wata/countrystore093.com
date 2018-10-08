/**
 * COUNTRYSTORE
 * (c) wata, MIT License.
 */

(function ($) {
  'use strict';

  var ga = window.ga || function () {};

  var COUNTRYSTORE = function () {
    this.today = this.dateFormat(new Date(), '.');
    this.rss = 'https://blog.countrystore093.com/rss';

    $(window).on('load', $.proxy(this.start, this));
  };

  COUNTRYSTORE.prototype.start = function () {
    this.$alert = $('.js-alert-info');
    this.$entries = $('.js-entry');
    this.assignFeeds();
    this.assignEventHandlers();
  };

  COUNTRYSTORE.prototype.assignFeeds = function () {
    var that = this;

    that.fetchFeed().done(function (entries) {
      if (!entries) { return; }

      that.$entries.each(function (i) {
        var entry = entries[i], pdate = new Date(entry['pubDate'].replace(/-/g, '/'));

        // existence check recently entry.
        that.isRecent(pdate.getTime()) && that.$alert.slideDown();

        $(this)
          .find('.js-pdate')
          .text(that.dateFormat(pdate, '.'))
          .end()
          .find('.js-link')
          .text(entry['title'])
          .attr('href', entry['link'])
          .end();
      });
    });
  };

  COUNTRYSTORE.prototype.assignEventHandlers = function () {
    $(document).on('click', 'a[href^="#"]', $.proxy(this.onClickScrollTop, this));
  };

  COUNTRYSTORE.prototype.fetchFeed = function () {
    var d = $.Deferred();

    var jqXHR = $.ajax({
      type: 'GET',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=' + this.rss,
      dataType: 'json'
    });

    jqXHR.done(function (res) {
      if (res.status !== 'ok') { d.reject(); return; }
      d.resolve(res.items);
    });

    return d.promise();
  };

  COUNTRYSTORE.prototype.onClickScrollTop = function (e) {
    var $el = $(e.target);
    $('html, body').animate({
      scrollTop: $($el[0].hash || document.body).offset().top
    });
    return false;
  };

  COUNTRYSTORE.prototype.isRecent = function (thatTime) {
    var diff = (new Date()).getTime() - thatTime,
    days = diff/(1000*60*60*24);
    return days <= 7;
  };

  COUNTRYSTORE.prototype.dateFormat = function (dateObj, separator) {
    var y = dateObj.getFullYear(),
    m = dateObj.getMonth() + 1,
    d = dateObj.getDate();

    if (m < 10) { m = '0' + m; }
    if (d < 10) { d = '0' + d; }

    return [y, m, d].join(separator);
  };

  new COUNTRYSTORE();

})(jQuery);
