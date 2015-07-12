define ->

  ###

  Роутер 1.0.0b

  ###

  class Router

    ###

      Объект для распределения данных между конфигами для последующего использования

    ###

    class ConfigBuilder
      constructor: (routesConfig, animationsConfig, methodsConfig) ->
        @config =
          states: { }
          loads: [ ]
          animationsProperties: { }
          animations: { }
          priorities: { }
          coordinates: [ ]

        for routeName, routeConfig of routesConfig
          @config.states[routeName] =
            url: routeConfig.url
            load: if routeConfig.load then routeConfig.load else methodsConfig.load
            initialize: if routeConfig.initialize then routeConfig.initialize else methodsConfig.initialize
            insert: if routeConfig.insert then routeConfig.insert else methodsConfig.insert
            update: if routeConfig.update then routeConfig.update else methodsConfig.update
            remove: if routeConfig.remove then routeConfig.remove else methodsConfig.remove

        @config.loads = Object.keys routesConfig

        for routeName, routeConfig of routesConfig
          animationSelector = routeName.replace /\:\w+/g, ""
          @config.animationsProperties[routeName] =
            show: if routeConfig.show then routeConfig.show else try animationsConfig[animationSelector].show
            swap: if routeConfig.swap then routeConfig.swap else try animationsConfig[animationSelector].swap
            hide: if routeConfig.hide then routeConfig.hide else try animationsConfig[animationSelector].hide

        animationsNames = [ "first", "last", "update", "topCenter", "centerTop", "bottomCenter", "centerBottom", "leftCenter", "centerLeft", "rightCenter", "centerRight" ]

        for routeName, routeConfig of routesConfig
          animationSelector = routeName.replace /\:\w+/g, ""
          @config.animations[routeName] = routeAnimationConfig = { }
          for animationName in animationsNames
            routeAnimationConfig[animationName] = if routeConfig[animationName] then routeConfig[animationName] else try animationsConfig[animationSelector].animations[animationName]

        for routeName, routeConfig of routesConfig
          @config.priorities[routeName] = routeConfig.priority

        @config.coordinates = Object.keys routesConfig

        return @config

    ###

      Объекты состояния

    ###

    class State

      constructor: (@url, @loadMethod, @initialize, @insert, @update, @remove) ->
        @instance = null
        @view = null

      load: (callback) ->
        @loadMethod @url, (instance) ->
          callback @instance = instance
  
    ###

      Объект для асинхронной загрузки видов

    ###

    _getParent = (routeName) ->
      parentIndex = routeName.lastIndexOf ">"
      routeName.slice 0, parentIndex if parentIndex isnt -1

    class Listener

      constructor: ->
        @callbacks = { }

      add: (type, handler) ->
        callbacks = @callbacks[type]
        callbacks = @callbacks[type] = [ ] unless callbacks
        callbacks.push handler

      run: (type) ->
        callbacks = @callbacks[type]
        return unless callbacks
        callback() for callback in callbacks
        callbacks.length = 0

    class LoadManager

      constructor: (routes) ->
        @status = { }
        @listeners = { }
        for route in routes
          @status[route] = "unused"
          @listeners[route] = new Listener

      complete: (routeName, callback) ->
        @status[routeName] = "loaded"
        callback()
        @listeners[routeName].run "load"

      onready: (routeName, callback) ->
        
        parent = _getParent routeName

        if parent
          if @status[parent] is "loaded"
            @complete routeName, -> callback()
          else
            @listeners[parent].add "load", ->
              @complete routeName, -> callback()
        else
          @complete routeName, -> callback()

    ###

      Дает право выполнять внутрненние асинхронные операции в соответствии с порядком

    ###

    class AnimationsManager

      constructor: (animationsConfig) ->
        @options = { }
        @listeners = { }
        for animationName, animationConfig of animationsConfig
          @options[animationName] = animationConfig
          @listeners[animationName] = new Listener

        @count = 0
        @length = Object.keys(animationsConfig).length

        @handlers = [ ]

      run: ->
        if @count >= 0 then @count++ else @count = 1
        if @count is @length
          handlerToRun() for handlerToRun in @handlers
          @count = 0
          @handlers.length = 0

      onready: (action, name, handlers, callback) ->
        option = @options[name][action]

        currentListener = @listeners[name]

        afterEndHandler = handlers.afterEnd
        afterStartHandler = handlers.afterStart

        parentIndex = name.lastIndexOf ">"
        if parentIndex isnt -1
          parent = name.slice 0, parentIndex

          parentListener = @listeners[parent]

          switch option
            when "free"
              parentListener.add "afterStart", =>
                callback =>
                  try afterEndHandler()
                  currentListener.run "afterEnd"
                setTimeout ->
                  try afterStartHandler()
                  currentListener.run "afterStart"
            when "order"
              parentListener.add "afterEnd", =>
                callback =>
                  try afterEndHandler()
                  currentListener.run "afterEnd"
                setTimeout ->
                  try afterStartHandler()
                  currentListener.run "afterStart"
            when "none"
              parentListener.add "afterStart", =>
                setTimeout ->
                  try
                    afterStartHandler()
                    afterEndHandler()
                  currentListener.run "afterStart"
                  currentListener.run "afterEnd"
        else
          @handlers = [ ] unless @handlers
          handlres = @handlers
          switch option
            when "free" or "order"
              handlres.push =>
                callback =>
                  try afterEndHandler()
                  currentListener.run "afterEnd"
                setTimeout ->
                  try afterStartHandler()
                  currentListener.run "afterStart"
            when "none"
              handlres.push =>
                setTimeout ->
                  try
                    afterStartHandler()
                    afterEndHandler()
                  currentListener.run "afterStart"
                currentListener.run "afterEnd"

        @run()

      empty: (settings) ->
        name = settings.name

        currentListener = @listeners[name]

        parentIndex = name.lastIndexOf ">"
        if parentIndex isnt -1
          parent = name.slice 0, parentIndex

          @listeners[parent] = new Listener unless @listeners[parent]

          parentListener = @listeners[parent]

          parentListener.add "afterEnd", =>
            setTimeout =>
              currentListener.run "afterStart"
              currentListener.run "afterEnd"
        else
          @handlers = [ ] unless @handlers
          handlres = @handlers
          handlres.push =>
            setTimeout =>
              currentListener.run "afterStart"
              currentListener.run "afterEnd"

        @run()

    class AnimationsHandler
      constructor: (animationsConfig) ->
        @animations = { }
        for animationName, animationConfig of animationsConfig
          @animations[animationName] = animationConfig

      do: (routeName, animationName, view, callback) ->
        try
          currentAnimation = @animations[routeName][animationName]
          currentAnimation view, -> callback()

    ###

      Координирует запросы на обновление роутинга

    ###

    class RouterCoordinator

      _isNew = (states, checkedStateName) ->
        for stateName, stateValue of states
          if checkedStateName.slice(0, checkedStateName.lastIndexOf(":")) is stateName.slice(0, stateName.lastIndexOf(":"))
            if checkedStateName isnt stateName
              return on if stateValue is "first" or stateValue is "first cache" or stateValue is "update" or stateValue is "new" or stateValue is "new cache" or stateValue is "visible"

      _isUpdate =
        do ->
          cache = { }
          (stateName, stateParams) ->
            stateParamsJSON = JSON.stringify stateParams
            result = false
            result = on for cacheName, cacheValue of cache when cacheName is stateName and cacheValue isnt stateParamsJSON
            cache[stateName] = stateParamsJSON
            result

      _isActive = (states, checkedStateName) ->
        return on for stateName, stateValue of states when checkedStateName is stateName

      _isOld = (states, checkedStateName) ->
        checkedStateNameSelector = checkedStateName.slice(0, checkedStateName.lastIndexOf(":"))
        for stateName, stateValue of states
          stateNameSelector = stateName.slice(0, stateName.lastIndexOf(":"))
          if checkedStateNameSelector is stateNameSelector
            if stateValue is "new" or stateValue is "new cache"
              if stateName isnt checkedStateName
                return on

      constructor: (coordinatesList) ->
        @config = { }
        @config[coordinate] = "unused" for coordinate in coordinatesList
  
      update: (requiredStates) ->

        for requiredStateName, requiredStateParams of requiredStates
          currentStateParam = @config[requiredStateName]
          isNew = _isNew @config, requiredStateName
          isUpdate = _isUpdate requiredStateName, requiredStateParams
          if currentStateParam is "unused" and not isNew
            @config[requiredStateName] = "first"
          else if not isNew and ( currentStateParam is "last" or currentStateParam is "invisible" )
            @config[requiredStateName] = "first cache"
          else if isUpdate and ( currentStateParam is "first" or currentStateParam is "first cache" or currentStateParam is "update" or currentStateParam is "new" or currentStateParam is "new cache" or currentStateParam is "visible" )
            @config[requiredStateName] = "update"
          else if isNew and currentStateParam is "unused"
            @config[requiredStateName] = "new"
          else if isNew and ( currentStateParam is "old" or currentStateParam is "invisible" )
            @config[requiredStateName] = "new cache"
          else if currentStateParam is "first" or currentStateParam is "first cache" or currentStateParam is "update" or currentStateParam is "new" or currentStateParam is "new cache"
            @config[requiredStateName] = "visible"

        for configStateName, configStateValue of @config
          isActive = _isActive requiredStates, configStateName
          isOld = _isOld @config, configStateName
          if not isActive and not isOld and ( configStateValue is "first" or configStateValue is "first cache" or configStateValue is "new" or configStateValue is "new cache" or configStateValue is "update" or configStateValue is "visible" )
            @config[configStateName] = "last"
          else if not isActive and isOld and ( configStateValue is "first" or configStateValue is "first cache" or configStateValue is "new" or configStateValue is "new cache" or configStateValue is "update" or configStateValue is "visible" )
            @config[configStateName] = "old"
          else if configStateValue is "last" or configStateValue is "old"
            @config[configStateName] = "invisible"

        @config

    ###

      Обрабатывает параметры приоритетов видов

    ###

    class PriorityHandler

      constructor: (priorities) ->
        @priorityMap = { }
        for priorityName, priorityValue of priorities
          @priorityMap[priorityName] = priorityValue

      findPair: (routes, matchRouteName, type) ->
        matchString = matchRouteName.slice 0, matchRouteName.lastIndexOf(":")
        for routerName, routerValue of routes
          if routerName.indexOf(matchString) isnt -1
            if routerName.slice(matchString.length).indexOf(">") is -1
              if type is "old"
                if routerValue is "new cache" or routerValue is "new"
                  return routerName
              else if type is "new cache" or type is "new"
                if routerValue is "old"
                  return routerName

      animationName: (routes, routeName, routeParam) ->
        pairRoute = @findPair routes, routeName, routeParam

        previriousVerticalPriority = @priorityMap[routeName][0]
        previriousHorisontalPriority = @priorityMap[routeName][1]
        currentVerticalPriority = @priorityMap[pairRoute][0]
        currentHorisontalPriority = @priorityMap[pairRoute][1]

        if routeParam is "old"
          if previriousVerticalPriority > currentVerticalPriority
            "centerBottom"
          else if previriousVerticalPriority < currentVerticalPriority
            "centerTop"
          else if previriousVerticalPriority is currentVerticalPriority
            if previriousHorisontalPriority > currentHorisontalPriority
              "centerRight"
            else if previriousHorisontalPriority < currentHorisontalPriority
              "centerLeft"
        else if routeParam is "new" or routeParam is "new cache"
          if previriousVerticalPriority > currentVerticalPriority
            "bottomCenter"
          else if previriousVerticalPriority < currentVerticalPriority
            "topCenter"
          else if previriousVerticalPriority is currentVerticalPriority
            if previriousHorisontalPriority > currentHorisontalPriority
              "rightCenter"
            else if previriousHorisontalPriority < currentHorisontalPriority
              "leftCenter"


    constructor: (routesConfig, animationsConfig, methodsConfig) ->
      @config = new ConfigBuilder routesConfig, animationsConfig, methodsConfig

      @states = { }
      for stateName, stateSettings of @config.states
        @states[stateName] = new State stateSettings.url, stateSettings.load, stateSettings.initialize, stateSettings.insert, stateSettings.update, stateSettings.remove

      @loadManager = new LoadManager @config.loads

      @animationsManager = new AnimationsManager @config.animationsProperties

      @animationsHandler = new AnimationsHandler @config.animations

      @routerCoordinator = new RouterCoordinator @config.coordinates

      @priorityHandler = new PriorityHandler @config.priorities

    go: (requiredStates) ->
      stateCoordinates = @routerCoordinator.update requiredStates
      routerKeys = Object.keys stateCoordinates
      for routeName, count in routerKeys
        do (routeName, routeCoordinate = stateCoordinates[routeName]) =>
          currentState = @states[routeName]
          currentStateChainNames = routeName.split ">"
          currentStateSelector = currentStateChainNames[currentStateChainNames.length-1].split(":")[0]
          switch routeCoordinate
            when "first"
              currentState.load (instance) =>
                @loadManager.onready routeName, =>
                  currentState.view = currentState.initialize instance, params?[routeName]
                  do (view = currentState.view) =>
                    @animationsManager.onready "show", routeName,
                      afterStart: -> currentState.insert currentStateSelector, view
                    , (done) => @animationsHandler.do routeName, "first", view, -> done()
            when "first cache"
              currentState.load (instance) =>
                @loadManager.onready routeName, =>
                  currentState.view = currentState.initialize instance, params?[routeName]
                  do (view = currentState.view) =>
                    @animationsManager.onready "show", routeName,
                      afterStart: -> currentState.insert currentStateSelector, view
                    , (done) => @animationsHandler.do routeName, "first", view, -> done()
            when "update"
              @loadManager.onready routeName, =>
                do (view = currentState.view) =>
                  @animationsManager.onready "show", routeName,
                    afterStart: -> currentState.update currentState.view, params?[routeName]
                  , (done) => @animationsHandler.do routeName, "update", view, -> done()
            when "new"
              currentState.load (instance) =>
                animationName = @priorityHandler.animationName stateCoordinates, routeName, "new"
                @loadManager.onready routeName, =>
                  currentState.view = currentState.initialize instance, params?[routeName]
                  do (view = currentState.view) =>
                    @animationsManager.onready "swap", routeName,
                      afterStart: -> currentState.insert currentStateSelector, view
                    , (done) => @animationsHandler.do routeName, animationName, view, -> done()
            when "new cache"
              currentState.load (instance) =>
                animationName = @priorityHandler.animationName stateCoordinates, routeName, "new"
                @loadManager.onready routeName, =>
                  currentState.view = currentState.initialize instance, params?[routeName]
                  do (view = currentState.view) =>
                    @animationsManager.onready "swap", routeName,
                      afterStart: -> currentState.insert currentStateSelector, view
                    , (done) => @animationsHandler.do routeName, animationName, view, -> done()
            when "last"
              @loadManager.onready routeName, =>
                do (view = currentState.view) =>
                  @animationsManager.onready "hide", routeName,
                    afterEnd: -> currentState.remove view
                  , (done) => @animationsHandler.do routeName, "last", view, ->  done()
            when "old"
              animationName = @priorityHandler.animationName stateCoordinates, routeName, "old"
              @loadManager.onready routeName, =>
                do (view = currentState.view) =>
                  @animationsManager.onready "hide", routeName,
                    afterEnd: -> currentState.remove view
                  , (done) => @animationsHandler.do routeName, animationName, view, -> done()
            else
              @animationsManager.empty name: routeName