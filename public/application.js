(function() {
  define(["view/home/home-animations", "view/home/main/main-animations", "view/home/main/one/one-animations"], function(homeAnimations, mainAnimations, oneAnimations) {
    console.log(router);
    router.setMethods({
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
    router.setViews({
      ".home-container:home": {
        url: "view/home/home-view",
        afterInitialize: function() {
          $("#home").on("click", function() {
            return router.go("#/");
          });
          $("#main").on("click", function() {
            return router.go("#/main");
          });
          $("#main1").on("click", function() {
            return router.go("#/main1");
          });
          $("#one").on("click", function() {
            return router.go("#/main/one");
          });
          $("#two").on("click", function() {
            return router.go("#/main/two");
          });
          return $("#three").on("click", function() {
            return router.go("#/main/three");
          });
        }
      },
      ".home-container:home>.main-container:main": {
        url: "view/home/main/main-view"
      },
      ".home-container:home>.main-container:main1": {
        url: "view/home/main/main-view"
      },
      ".home-container:home>.main-container:main>.one-container:one": {
        url: "view/home/main/one/one-view"
      },
      ".home-container:home>.main-container:main>.two-container:two": {
        url: "view/home/main/two/two-view",
        priority: "00"
      },
      ".home-container:home>.main-container:main>.two-container:three": {
        url: "view/home/main/three/three-view",
        priority: "01"
      }
    });
    router.setAnimations([
      {
        states: [".home-container:home"],
        animations: homeAnimations
      }, {
        states: [".home-container:home>.main-container:main", ".home-container:home>.main-container:main1"],
        animations: oneAnimations
      }, {
        states: [".home-container:home>.main-container:main>.one-container:one", ".home-container:home>.main-container:main>.two-container:two", ".home-container:home>.main-container:main>.two-container:three"],
        animations: oneAnimations,
        show: "order"
      }
    ]);
    router.setRoutes({
      "#/": function(params) {
        console.log("#/");
        return {
          ".home-container:home": params
        };
      },
      "#/main": function(params) {
        console.log("#/main");
        return {
          ".home-container:home": null,
          ".home-container:home>.main-container:main": params
        };
      },
      "#/main/one": function(params) {
        console.log("#/main/one");
        return {
          ".home-container:home": null,
          ".home-container:home>.main-container:main": null,
          ".home-container:home>.main-container:main>.one-container:one": params
        };
      },
      "#/main/two": function(params) {
        console.log("#/main/two");
        return {
          ".home-container:home": null,
          ".home-container:home>.main-container:main": null,
          ".home-container:home>.main-container:main>.two-container:two": params
        };
      },
      "#/main/three": function(params) {
        console.log("#/main/three");
        return {
          ".home-container:home": null,
          ".home-container:home>.main-container:main": null,
          ".home-container:home>.main-container:main>.two-container:three": params
        };
      },
      "#/main1": function(params) {
        console.log("#/main1");
        return {
          ".home-container:home": null,
          ".home-container:home>.main-container:main1": params
        };
      }
    }, {
      "#/main": "id-1",
      "#/main1": "id-1",
      "#/main/two": "id-2",
      "#/main/three": "id-2"
    });
    return router.start();
  });

}).call(this);
