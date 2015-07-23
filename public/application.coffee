define [
  "view/home/home-animations"
  "view/home/main/main-animations"
  "view/home/main/one/one-animations"
], (
  homeAnimations
  mainAnimations
  oneAnimations
) ->


  console.log router


  router.setMethods
    load: (url, callback) -> require [ url ], (data) -> callback data
    initialize: (Instance, params) -> new Instance params
    insert: (containerSelector, instance) -> $(containerSelector).append instance.$el
    update: (instance, params) -> instance.render params
    remove: (instance) -> instance.$el.remove()


  router.setViews
    ".home-container:home":
      url: "view/home/home-view"
      afterInitialize: ->
        $("#home").on "click", -> router.go "#/"
        $("#main").on "click", -> router.go "#/main"
        $("#main1").on "click", -> router.go "#/main1"
        $("#one").on "click", -> router.go "#/main/one"
        $("#two").on "click", -> router.go "#/main/two"
        $("#three").on "click", -> router.go "#/main/three"
    ".home-container:home>.main-container:main":
      url: "view/home/main/main-view"
    ".home-container:home>.main-container:main1":
      url: "view/home/main/main-view"
    ".home-container:home>.main-container:main>.one-container:one":
      url: "view/home/main/one/one-view"
    ".home-container:home>.main-container:main>.two-container:two":
      url: "view/home/main/two/two-view"
      priority: "00"
    ".home-container:home>.main-container:main>.two-container:three":
      url: "view/home/main/three/three-view"
      priority: "01"


  router.setAnimations [
      states: [
        ".home-container:home"
      ]
      animations: homeAnimations
    ,
      states: [
        ".home-container:home>.main-container:main"
        ".home-container:home>.main-container:main1"
      ]
      animations: oneAnimations
    ,
      states: [
        ".home-container:home>.main-container:main>.one-container:one"
        ".home-container:home>.main-container:main>.two-container:two"
        ".home-container:home>.main-container:main>.two-container:three"
      ]
      animations: oneAnimations
      show: "order"
  ]


  router.setRoutes
      "#/": (params) ->
        console.log "#/"
        ".home-container:home": params

      "#/main": (params) ->
        console.log "#/main"
        ".home-container:home": null
        ".home-container:home>.main-container:main": params

      "#/main/one": (params) ->
        console.log "#/main/one"
        ".home-container:home": null
        ".home-container:home>.main-container:main": null
        ".home-container:home>.main-container:main>.one-container:one": params

      "#/main/two": (params) ->
        console.log "#/main/two"
        ".home-container:home": null
        ".home-container:home>.main-container:main": null
        ".home-container:home>.main-container:main>.two-container:two": params

      "#/main/three": (params) ->
        console.log "#/main/three"
        ".home-container:home": null
        ".home-container:home>.main-container:main": null
        ".home-container:home>.main-container:main>.two-container:three": params

      "#/main1": (params) ->
        console.log "#/main1"
        ".home-container:home": null
        ".home-container:home>.main-container:main1": params
    ,
      "#/main": "id-1"
      "#/main1": "id-1"
      "#/main/two": "id-2"
      "#/main/three": "id-2"

  router.start()