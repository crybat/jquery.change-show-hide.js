+function ($) {
  'use strict';

  var ChangeShowHide = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, ChangeShowHide.DEFAULTS, options);
    this.$target = $(options.showHideTarget || this.$element.data('show-hide-target'));
    this.init();
  };

  ChangeShowHide.DEFAULTS = {
    afterDisable: function () {},
    afterEnable: function () {}
  };

  ChangeShowHide.prototype.init = function () {
    this.updateItems();
    this.bind();
  };

  ChangeShowHide.prototype.updateItems = function () {
    var $element = this.$element;
    var $target = this.$target;
    if (isElementActive($element)) {
      $target.show();
      this.options.afterEnable(this, $target);
    } else {
      $target.hide();
      this.options.afterDisable(this, $target);
    }
  };

  ChangeShowHide.prototype.bind = function () {
    this.bindElement(this.$element);
  };

  ChangeShowHide.prototype.bindElement = function ($element) {
    var that = this;
    var lambda = function () {
      that.updateItems();
    };
    var eventName = 'change.changeshowhide';
    if ($element.is(':checkbox')) $element.bind(eventName, lambda);
    if ($element.is(':radio')) {$(':input:radio[name='+$element.attr('name')+']').bind(eventName, lambda);}
    if ($element.is('option')) $element.parent().bind(eventName, lambda);
  };

  function isElementActive ($element) {
    if ($element.is('input:checkbox,input:radio')) return $element.is(':checked');
    if ($element.is('option')) return $element.is(':selected');
  }

  // Plugin definition

  $.fn.changeshowhide = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('changeshowhide');
      var options = $.extend({}, ChangeShowHide.DEFAULTS, $this.data(), typeof option === 'object' && option);
      var action  = typeof option === 'string' ? option : false; // gives access to methods

      if (!data) $this.data('changeshowhide', (data = new ChangeShowHide(this, options)));
      if (action) data[action]();
    });
  };

  $.fn.changeshowhide.Constructor = ChangeShowHide;

  // Data API

  $(window).load(function () {
    $('.changeshowhide').each(function () {
      var $el = $(this);
      $el.changeshowhide($el.data());
    });
  });

}(jQuery);
