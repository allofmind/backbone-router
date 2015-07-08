(function() {
  define(["src/backbone-router", "animation/lvl-1-container-view-animation", "animation/lvl-2-container-view-animation"], function(Router, lvl1ContainerViewAnimation, lvl2ContainerViewAnimation) {
    var PageRoute, pageRoute, router;
    router = new Router({
      ".lvl-1-container:about": {
        url: "view/about/view",
        init: function(About, params) {
          return new About(params);
        },
        insert: function(about) {
          return $(".lvl-1-container").append(about.$el);
        },
        update: function(about, params) {
          return about.render(params);
        },
        remove: function(about) {
          return about.$el.remove();
        }
      },
      ".lvl-1-container:manual": {
        url: "view/manual/view",
        init: function(Manual, params) {
          return new Manual(params);
        },
        insert: function(manual) {
          return $(".lvl-1-container").append(manual.$el);
        },
        update: function(manual, params) {
          return manual.render(params);
        },
        remove: function(manual) {
          return manual.$el.remove();
        }
      },
      ".lvl-1-container:manual>.lvl-2-container:info": {
        url: "view/manual/info/view",
        init: function(Info, params) {
          return new Info(params);
        },
        insert: function(info) {
          return $(".lvl-2-container").append(info.$el);
        },
        update: function(info, params) {
          return info.render(params);
        },
        remove: function(info) {
          return info.$el.remove();
        }
      },
      ".lvl-1-container:manual>.lvl-2-container:methods": {
        url: "view/manual/methods/view",
        init: function(Methods, params) {
          return new Methods(params);
        },
        insert: function(methods) {
          return $(".lvl-2-container").append(methods.$el);
        },
        update: function(methods, params) {
          return methods.render(params);
        },
        remove: function(methods) {
          return methods.$el.remove();
        }
      },
      ".lvl-1-container:manual>.lvl-2-container:core": {
        url: "view/manual/core/view",
        init: function(Core, params) {
          return new Core(params);
        },
        insert: function(core) {
          return $(".lvl-2-container").append(core.$el);
        },
        update: function(core, params) {
          return core.render(params);
        },
        remove: function(core) {
          return core.$el.remove();
        }
      },
      ".lvl-1-container:manual>.lvl-2-container:how-it-work": {
        url: "view/manual/how-it-work/view",
        init: function(HowItWork, params) {
          return new HowItWork(params);
        },
        insert: function(howItWork) {
          return $(".lvl-2-container").append(howItWork.$el);
        },
        update: function(howItWork, params) {
          return howItWork.render(params);
        },
        remove: function(howItWork) {
          return howItWork.$el.remove();
        }
      },
      ".lvl-1-container:author": {
        url: "view/author/view",
        init: function(Author, params) {
          return new Author(params);
        },
        insert: function(author) {
          return $(".lvl-1-container").append(author.$el);
        },
        update: function(author, params) {
          return author.render(params);
        },
        remove: function(author) {
          return author.$el.remove();
        }
      }
    }, {
      animations: {
        ".lvl-1-container:about": {
          animations: lvl1ContainerViewAnimation
        },
        ".lvl-1-container:manual": {
          animations: lvl1ContainerViewAnimation
        },
        ".lvl-1-container:manual>.lvl-2-container:info": {
          animations: lvl2ContainerViewAnimation
        },
        ".lvl-1-container:manual>.lvl-2-container:methods": {
          animations: lvl2ContainerViewAnimation
        },
        ".lvl-1-container:manual>.lvl-2-container:core": {
          animations: lvl2ContainerViewAnimation
        },
        ".lvl-1-container:manual>.lvl-2-container:how-it-work": {
          animations: lvl2ContainerViewAnimation
        },
        ".lvl-1-container:author": {
          animations: lvl1ContainerViewAnimation
        }
      },
      animationsSettings: {
        ".lvl-1-container:about": {
          inOrder: true
        },
        ".lvl-1-container:manual": {
          inOrder: true
        },
        ".lvl-1-container:manual>.lvl-2-container:info": {
          inOrder: false
        },
        ".lvl-1-container:manual>.lvl-2-container:methods": {
          inOrder: true
        },
        ".lvl-1-container:manual>.lvl-2-container:core": {
          inOrder: true
        },
        ".lvl-1-container:manual>.lvl-2-container:how-it-work": {
          inOrder: true
        },
        ".lvl-1-container:author": {
          inOrder: true
        }
      },
      priorities: {
        ".lvl-1-container:about": {
          priority: "00"
        },
        ".lvl-1-container:manual": {
          priority: "01"
        },
        ".lvl-1-container:manual>.lvl-2-container:info": {
          priority: "00"
        },
        ".lvl-1-container:manual>.lvl-2-container:methods": {
          priority: "10"
        },
        ".lvl-1-container:manual>.lvl-2-container:core": {
          priority: "20"
        },
        ".lvl-1-container:manual>.lvl-2-container:how-it-work": {
          priority: "30"
        },
        ".lvl-1-container:author": {
          priority: "02"
        }
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
            ".lvl-1-container:manual>.lvl-2-container:how-it-work": null
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
