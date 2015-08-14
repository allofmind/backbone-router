(function() {
  define(["view/animations", "view/news/animations"], function(mainAnimations, newsAnimations) {
    console.log(view);
    console.log(router);
    console.log(navigation);
    view.extend({
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
    }, {
      ".main-container:welcome": {
        url: "view/welcome/view",
        priority: "00"
      },
      ".main-container:news": {
        url: "view/news/view",
        priority: "01"
      },
      ".main-container:news>.list-container:list": {
        url: "view/news/list/view"
      },
      ".main-container:news>.chat-container:chat": {
        url: "view/news/chat/view"
      },
      ".main-container:contacts": {
        url: "view/home/main/main-view"
      }
    }, [
      {
        states: [".main-container:welcome", ".main-container:news", ".main-container:contacts"],
        animations: mainAnimations
      }, {
        states: [".main-container:news>.list-container:list", ".main-container:news>.chat-container:chat"],
        animations: newsAnimations,
        show: "order",
        shap: "order"
      }
    ]);
    router.extend({
      "#/welcome": function(params) {
        console.log("#/welcome");
        return {
          ".main-container:welcome": null
        };
      },
      "#/news": function(params) {
        console.log("#/");
        return {
          ".main-container:news": null
        };
      },
      "#/news/list": function(params) {
        console.log("#/news/list");
        return {
          ".main-container:news": 3
        };
      },
      "#/news/chat": function(params) {
        console.log("#/news/chat");
        return {
          ".main-container:news": 6,
          ".main-container:news>.chat-container:chat": null
        };
      },
      "#/contacts": function(params) {
        console.log("#/contacts");
        return {
          ".main-container:contacts": null
        };
      }
    });
    router.start();
    return navigation.extend({
      "#/welcome": "1",
      "#/news": "1",
      "#/news/list": "2",
      "#/news/chat": "2",
      "#/contacts": "1"
    });
  });

}).call(this);
