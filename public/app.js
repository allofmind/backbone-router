(function() {
  define(["src/backbone-router", "animation/lvl-1-container-view-animation", "animation/lvl-2-container-view-animation"], function(Router, lvl1ContainerViewAnimation, lvl2ContainerViewAnimation) {
    var PageRoute, pageRoute, router;
    router = new Router({
      ".lvl-1-container:about": {
        url: "view/about/view",
        priority: "00"
      },
      ".lvl-1-container:manual": {
        url: "view/manual/view",
        priority: "01"
      },
      ".lvl-1-container:manual>.lvl-2-container:info": {
        url: "view/manual/info/view",
        priority: "00"
      },
      ".lvl-1-container:manual>.lvl-2-container:methods": {
        url: "view/manual/methods/view",
        priority: "10"
      },
      ".lvl-1-container:manual>.lvl-2-container:core": {
        url: "view/manual/core/view",
        priority: "20"
      },
      ".lvl-1-container:manual>.lvl-2-container:howItWork": {
        url: "view/manual/how-it-work/view",
        priority: "30"
      },
      ".lvl-1-container:author": {
        url: "view/author/view",
        priority: "02"
      }
    }, {
      ".lvl-1-container": {
        animations: lvl1ContainerViewAnimation,
        show: "free",
        swap: "free",
        hide: "free"
      },
      ".lvl-1-container>.lvl-2-container": {
        animations: lvl2ContainerViewAnimation,
        show: "free",
        swap: "free",
        hide: "free"
      }
    }, {
      load: function(url, callback) {
        return require([url], function(data) {
          return callback(data);
        });
      },
      initialize: function(Instance, params) {
        return new Instance(params);
      },
      insert: function(containerSelector, instance) {
        return $(containerSelector).append(instance.$el);
      },
      update: function(instance, params) {
        return instance.render(params);
      },
      remove: function(instance) {
        return instance.$el.remove();
      }
    });
    PageRoute = Backbone.Router.extend({
      routes: {
        "about": function() {
          return router.go({
            ".lvl-1-container:about": null
          });
        },
        "manual": function() {
          return router.go({
            ".lvl-1-container:manual": null,
            ".lvl-1-container:manual>.lvl-2-container:info": null
          });
        },
        "manual/methods": function() {
          return router.go({
            ".lvl-1-container:manual": null,
            ".lvl-1-container:manual>.lvl-2-container:methods": null
          });
        },
        "manual/core": function() {
          return router.go({
            ".lvl-1-container:manual": null,
            ".lvl-1-container:manual>.lvl-2-container:core": null
          });
        },
        "manual/how-it-work": function() {
          return router.go({
            ".lvl-1-container:manual": null,
            ".lvl-1-container:manual>.lvl-2-container:howItWork": null
          });
        },
        "author": function() {
          return router.go({
            ".lvl-1-container:author": null
          });
        }
      }
    });
    pageRoute = new PageRoute;
    Backbone.history.start();
    return pageRoute;
  });

}).call(this);
