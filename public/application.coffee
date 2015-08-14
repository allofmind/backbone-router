define [
  "view/animations"
  "view/news/animations"
], (
  mainAnimations
  newsAnimations
) ->


  console.log view
  console.log router
  console.log navigation


  view.extend
      load: (url, callback) -> require [ url ], (data) -> callback data
      initialize: (Instance, params) -> new Instance params
      insert: (containerSelector, instance) -> $(containerSelector).append instance.$el
      update: (instance, params) -> instance.render params
      remove: (instance) -> instance.$el.remove()
    ,
      ".main-container:welcome":
        url: "view/welcome/view"
        priority: "00"
      ".main-container:news":
        url: "view/news/view"
        priority: "01"
      ".main-container:news>.list-container:list":
        url: "view/news/list/view"
      ".main-container:news>.chat-container:chat":
        url: "view/news/chat/view"
      ".main-container:contacts":
        url: "view/home/main/main-view"
    ,
      [
          states: [
            ".main-container:welcome"
            ".main-container:news"
            ".main-container:contacts"
          ]
          animations: mainAnimations
        ,
          states: [
            ".main-container:news>.list-container:list"
            ".main-container:news>.chat-container:chat"
          ]
          animations: newsAnimations
          show: "order"
          shap: "order"
      ]


  router.extend
    "#/welcome": (params) ->
      console.log "#/welcome"
      ".main-container:welcome": null

    "#/news": (params) ->
      console.log "#/"
      ".main-container:news": null

    "#/news/list": (params) ->
      console.log "#/news/list"
      ".main-container:news": 3
      # ".main-container:news>.list-container:list": null

    "#/news/chat": (params) ->
      console.log "#/news/chat"
      ".main-container:news": 6
      ".main-container:news>.chat-container:chat": null

    "#/contacts": (params) ->
      console.log "#/contacts"
      ".main-container:contacts": null

  router.start()

  navigation.extend
    "#/welcome": "1"
    "#/news": "1"
    "#/news/list": "2"
    "#/news/chat": "2"
    "#/contacts": "1"