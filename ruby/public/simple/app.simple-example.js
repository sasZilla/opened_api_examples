;(function(jQuery, window, undefined) {
  var App = {
    init: function() {
      $.getJSON('/standard_groups', function(data) {
        App.setData('standardGroups', 'standard_groups', data);
      });

      this.bindEvents();
    },

    activeStandardGroup: null,
    activeGradeGroup: null,
    activeCategory: null,

    bindEvents: function() {
      $('#container').on('click', '#standardGroups li', function(ev) {
        var $el = $(ev.target);

        App.activeStandardGroup = $el;

        $.getJSON('/grade_groups', {standard_group: App.activeStandardGroup.data('name')}, function(data) {
          App.setData('gradeGroups', 'grade_groups', data);
        });
      });

      $('#container').on('click', '#gradeGroups li', function(ev) {
        var $el = $(ev.target);

        App.activeGradeGroup = $el;

        $.getJSON('/categories', {standard_group: App.activeStandardGroup.data('name'), grade_group: App.activeGradeGroup.data('name')}, function(data) {
          App.setData('categories', 'categories', data);
        });
      });

      $('#container').on('click', '#categories li', function(ev) {
        var $el = $(ev.target);

        App.category = $el;

        $.getJSON('/standards', {standard_group: App.activeStandardGroup.data('name'), grade_group: App.activeGradeGroup.data('name'), category: App.category.data('name')}, function(data) {
          App.setData('standards', 'standards', data);
        });
      });
    },

    setData: function (id, name, data) {
      var standardGroups = data[name],
          $container = $('#'+id);
      $container.html(id);
      for (var i=0,len=standardGroups.length;i<len;i++) {
        var standardGroup = standardGroups[i],
            $el = $('<li>', {title: standardGroup.title});
        $el.data({'id': standardGroup.id, 'name': standardGroup.name || standardGroup.title})
        $el.html(standardGroup.name || standardGroup.title);
        $container.append($el);
      }
    }
  };

  $(document).ready(function() {
    App.init();
  });

})(jQuery, window);
