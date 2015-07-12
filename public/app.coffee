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
      priority: "00"
    ".lvl-1-container:manual":
      url: "view/manual/view"
      priority: "01"
    ".lvl-1-container:manual>.lvl-2-container:info":
      url: "view/manual/info/view"
      priority: "00"
    ".lvl-1-container:manual>.lvl-2-container:methods":
      url: "view/manual/methods/view"
      priority: "10"
    ".lvl-1-container:manual>.lvl-2-container:core":
      url: "view/manual/core/view"
      priority: "20"
    ".lvl-1-container:manual>.lvl-2-container:howItWork":
      url: "view/manual/how-it-work/view"
      priority: "30"
    ".lvl-1-container:author":
      url: "view/author/view"
      priority: "02"
  ,
    ".lvl-1-container":
      animations: lvl1ContainerViewAnimation
      show: "free"
      swap: "free"
      hide: "free"
    ".lvl-1-container>.lvl-2-container":
      animations: lvl2ContainerViewAnimation
      show: "free"
      swap: "free"
      hide: "free"
  ,
    load: (url, callback) -> require [ url ], (data) -> callback data
    initialize: (Instance, params) -> new Instance params
    insert: (containerSelector, instance) -> $(containerSelector).append instance.$el
    update: (instance, params) -> instance.render params
    remove: (instance) -> instance.$el.remove()


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
          ".lvl-1-container:manual>.lvl-2-container:howItWork": null
      "author": ->
        router.go
          ".lvl-1-container:author": null

  pageRoute = new PageRoute
  
  Backbone.history.start()

  pageRoute