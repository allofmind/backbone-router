define [
  "src/backbone-router"
  "animation/lvl-1-container-view-animation"
  "animation/lvl-2-container-view-animation"
], (
  Router
  lvl1ContainerViewAnimation
  lvl2ContainerViewAnimation
) ->

  router = new Router
    ".lvl-1-container:about":
      url: "view/about/view"
      init: (About, params) ->new About params
      insert: (about) -> $(".lvl-1-container").append about.$el
      update: (about, params) -> about.render params
      remove: (about) -> about.$el.remove()
    ".lvl-1-container:manual":
      url: "view/manual/view"
      init: (Manual, params) -> new Manual params
      insert: (manual) -> $(".lvl-1-container").append manual.$el
      update: (manual, params) -> manual.render params
      remove: (manual) -> manual.$el.remove()
    ".lvl-1-container:manual>.lvl-2-container:info":
      url: "view/manual/info/view"
      init: (Info, params) -> new Info params
      insert: (info) -> $(".lvl-2-container").append info.$el
      update: (info, params) -> info.render params
      remove: (info) -> info.$el.remove()
    ".lvl-1-container:manual>.lvl-2-container:methods":
      url: "view/manual/methods/view"
      init: (Methods, params) -> new Methods params
      insert: (methods) -> $(".lvl-2-container").append methods.$el
      update: (methods, params) -> methods.render params
      remove: (methods) -> methods.$el.remove()
    ".lvl-1-container:manual>.lvl-2-container:core":
      url: "view/manual/core/view"
      init: (Core, params) -> new Core params
      insert: (core) -> $(".lvl-2-container").append core.$el
      update: (core, params) -> core.render params
      remove: (core) -> core.$el.remove()
    ".lvl-1-container:manual>.lvl-2-container:how-it-work":
      url: "view/manual/how-it-work/view"
      init: (HowItWork, params) -> new HowItWork params
      insert: (howItWork) -> $(".lvl-2-container").append howItWork.$el
      update: (howItWork, params) -> howItWork.render params
      remove: (howItWork) -> howItWork.$el.remove()
    ".lvl-1-container:author":
      url: "view/author/view"
      init: (Author, params) -> new Author params
      insert: (author) -> $(".lvl-1-container").append author.$el
      update: (author, params) -> author.render params
      remove: (author) -> author.$el.remove()
  ,
    animations:
      ".lvl-1-container:about":
        animations: lvl1ContainerViewAnimation
      ".lvl-1-container:manual":
        animations: lvl1ContainerViewAnimation
      ".lvl-1-container:manual>.lvl-2-container:info": 
        animations: lvl2ContainerViewAnimation
      ".lvl-1-container:manual>.lvl-2-container:methods":
        animations: lvl2ContainerViewAnimation
      ".lvl-1-container:manual>.lvl-2-container:core":
        animations: lvl2ContainerViewAnimation
      ".lvl-1-container:manual>.lvl-2-container:how-it-work":
        animations: lvl2ContainerViewAnimation
      ".lvl-1-container:author":
        animations: lvl1ContainerViewAnimation
    animationsSettings:
      ".lvl-1-container:about":
        inOrder: on
      ".lvl-1-container:manual":
        inOrder: on
      ".lvl-1-container:manual>.lvl-2-container:info":
        inOrder: off
      ".lvl-1-container:manual>.lvl-2-container:methods":
        inOrder: on
      ".lvl-1-container:manual>.lvl-2-container:core":
        inOrder: on
      ".lvl-1-container:manual>.lvl-2-container:how-it-work":
        inOrder: on
      ".lvl-1-container:author":
        inOrder: on
    priorities:
      ".lvl-1-container:about":
        priority: "00"
      ".lvl-1-container:manual":
        priority: "01"
      ".lvl-1-container:manual>.lvl-2-container:info": 
        priority: "00"
      ".lvl-1-container:manual>.lvl-2-container:methods": 
        priority: "10"
      ".lvl-1-container:manual>.lvl-2-container:core": 
        priority: "20"
      ".lvl-1-container:manual>.lvl-2-container:how-it-work": 
        priority: "30"
      ".lvl-1-container:author":
        priority: "02"

  PageRoute = Backbone.Router.extend
    routes:
      "about": ->
        router.go
          ".lvl-1-container:about": null
      "manual": ->
        router.go
          ".lvl-1-container:manual": null
          ".lvl-1-container:manual>.lvl-2-container:info": null
      "manual/methods": ->
        router.go
          ".lvl-1-container:manual": null
          ".lvl-1-container:manual>.lvl-2-container:methods": null
      "manual/core": ->
        router.go
          ".lvl-1-container:manual": null
          ".lvl-1-container:manual>.lvl-2-container:core": null
      "manual/how-it-work": ->
        router.go
          ".lvl-1-container:manual": null
          ".lvl-1-container:manual>.lvl-2-container:how-it-work": null
      "author": ->
        router.go
          ".lvl-1-container:author": null

  pageRoute = new PageRoute
  
  Backbone.history.start()

  pageRoute