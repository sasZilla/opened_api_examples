;(function(jQuery, window, undefined) {
  var App = {
    models: {
      standard_group: {
        active: null,
        content: [],
        params: [],
        nextChainModel: 'grade_group'
      },
      grade_group: {
        active: null,
        content: [],
        params: ['standard_group'],
        nextChainModel: 'category'
      },
      category: {
        active: null,
        content: [],
        params: ['standard_group', 'grade_group'],
        nextChainModel: 'standard'
      },
      standard: {
        active: null,
        content: [],
        params: ['standard_group', 'grade_group', 'category']
      },

      area: {
        active: null,
        content: [],
        params: [],
        nextChainModel: 'subject'
      },
      subject: {
        active: null,
        content: [],
        params: ['area']
      },

      modelPath: {
        standard_group: 'standard_groups',
        grade_group: 'grade_groups',
        category: 'categories',
        standard: 'standards',
        area: 'areas',
        subject: 'subjects'
      },

      fetch: function(modelName) {
        var params = {},
          model = App.models[modelName];
        model.params.forEach(function(param) {
          var activeModel = App.models[param].active;
          params[param] = activeModel.name || activeModel.title;
        });
        return $.getJSON(App.models.modelPath[modelName], params, function(data) {
          App.models.setData(modelName, data);
        });
      },

      setData: function(modelName, data) {
        App.models[modelName].content = data[App.models.modelPath[modelName]];
      },
      getData: function(modelName) {
        return App.models[modelName].content;
      },

      setActive: function(modelName, elemName) {
        modelObj = App.models[modelName].content.find(function(el) {
          var name = el.name || el.title;
          return name === elemName;
        });
        App.models.resetActive(modelName);
        modelObj.isActive = true;
        App.models[modelName].active = modelObj;
      },
      resetActive: function(modelName) {
        App.models[modelName].content.forEach(function(model) {
          model.isActive = false;
        });
      },
      getActive: function(modelName) {
        return App.models[modelName].active;
      }
    },

    ctrl: {
      init: function() {
        App.view.init();
        this.load('standard_group');
        this.load('area');
      },

      load: function(modelName) {
        App.view.renderLoading(modelName);
        return App.models.fetch(modelName).then(function() {
          App.view.render(modelName, App.models[modelName].content || []);
        });
      },

      activate: function(modelName, elemName) {
        var nextChainModelName = App.models[modelName].nextChainModel;
        if (nextChainModelName) {
          App.models.setActive(modelName, elemName);
          App.ctrl.resetActiveChain(modelName);
          App.view.render(modelName, App.models[modelName].content || []);
          App.view.renderLoading(nextChainModelName);
          App.models.fetch(nextChainModelName).then(function() {
            App.view.render(nextChainModelName, App.models[nextChainModelName].content || []);
          });
        }
      },

      resetActiveChain: function(modelName) {
        var nextChainModelName = App.models[modelName].nextChainModel;
        if (nextChainModelName) {
          App.ctrl.resetActiveChain(nextChainModelName);
          App.view.clear(nextChainModelName);
        }
      }
    },

    view: {
      init: function() {
        this.bindEvents();
      },

      bindEvents: function() {
        $('#container').on('click', 'li.canBeClickable', function(ev) {
          var $target = $(ev.target),
            modelName = $target.parent().data('model'),
            name = $target.data('name');
          ev.preventDefault();
          App.ctrl.activate(modelName, name);
        });
      },

      render: function(containerId, modelData) {
        var $container = $('#'+containerId);
        App.view.clear(containerId);
        modelData.forEach(function(model) {
          var name = model.name || model.title,
            $el = $('<li>', {'title': name, 'class': 'list-group-item list-group-item--pointer canBeClickable'});
          $el.data({'id': model.id, 'name': name})
          $el.text(name);
          if (model.isActive) {
            $el.addClass('active');
          }
          $container.append($el);
        });
      },

      renderLoading: function(containerId) {
        document.getElementById(containerId).textContent = 'loading ...';
      },

      clear: function(containerId) {
        document.getElementById(containerId).textContent = '';
      }
    }
  };


  var App2 = {
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
      $container.html('<li>Loading ...</li>');
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
    App.ctrl.init();
  });

})(jQuery, window);
