define ->

  ###

  Модель роутинга:

  ###

  class Router

    ###

    2) На основе конфига создается классы с видами:
      1) Хранятся в общем объекте коллекции под уникальным именем;

    ###

    class StatesCollection

      class View
        constructor: (@url, @position, @init, @insert, @update, @remove) ->
          @instance = null
          @view = null

        get: (callback) -> 
          if @instance
            callback @instance
          else
            require [ @url ], (instance) =>
              callback @instance = instance

      constructor: (routerConfig) ->
        @routes = { }
        @routes[routeName] = new View routeSettings.url, routeSettings.position, routeSettings.init, routeSettings.insert, routeSettings.update, routeSettings.remove for routeName, routeSettings of routerConfig

      find: (requiredStateName) ->
        return stateConfig for own stateName, stateConfig of @routes when requiredStateName is stateName
  
    ###

    4) Выстраивается два объекта каллбеков с зависимостями:
      1) Зависимости при загрузке от родительского;
      2) Зависимости от анимации родительского;

    ###

    class LoadManager

      class Observer
        constructor: ->
          @callbacks = [ ]

        add: (callback) ->
          @callbacks.push callback

        run: ->
          callback() for callback in @callbacks
          @callbacks.length = 0

      getParent = (routeName) ->
        parentIndex = routeName.lastIndexOf ">"
        routeName.slice 0, parentIndex if parentIndex isnt -1

      constructor: (config) ->
        @status = { }
        @observers = { }
        @observers[name] = new Observer for name, params of config

      onready: (routeName, callback) ->
        parent = getParent routeName
        if parent
          if @status[parent] is "loaded"
            @status[routeName] = "loaded"
            callback()
            @observers[routeName].run()
          else
            @observers[parent].add =>
              callback()
              @observers[routeName].run()
        else
          @status[routeName] = "loaded"
          callback()
          @observers[routeName].run()

    ###

    5) Анимационный движок:
      1) Хранит функции анимаций;
      2) Выполняет анимацию в зависимости от priority;
      3) Проверяет свойства alwaysRun и запускает анимации для дочерних;
      4) Проверяет свойство inOrder и проводит анимации в порядке;

    ###

    class Animations
      constructor: (animations) ->
        @animations = { }
        @animations[animationName] = animationConfig for animationName, animationConfig of animations

      go: (selectorName, animationName, element, callback) ->
        if selectorName.indexOf(">") is -1 or selectorName.indexOf(">") isnt -1 and @animations[selectorName].alwaysRun
          if @animations[selectorName].animations[animationName]
            @animations[selectorName].animations[animationName] element, callback
          else
            callback()

    ###

    1) Главный контролирующий загрузки и анимации объект:
      1) Берет объект каллбеков загрузки и пользуется им;
      2) Берет объект каллбеков анимаций и пользуется им;

    ###

    class AnimationsManager

      class DoubleListener
        constructor: ->
          @preCallbacks = [ ]
          @postCallbacks = [ ]

        pre: (callback) ->
          @preCallbacks.push callback

        post: (callback) ->
          @postCallbacks.push callback

        run: (callback) ->
          callback =>
            postCallback() for postCallback in @postCallbacks
            @postCallbacks.length = 0
          preCallback() for preCallback in @preCallbacks
          @preCallbacks.length = 0

      constructor: (animationsSettings) ->
        @settings = { }
        @listeners = { }
        @parents = [ ]
        for animationName, animationSettings of animationsSettings
          @settings[animationName] = animationSettings
          @listeners[animationName] = new DoubleListener

      onready: do ->
        count = 0
        (routeName, callback) ->
          parentIndex = routeName.lastIndexOf ">"
          parent = routeName.slice 0, parentIndex if parentIndex isnt -1

          if parent
            if @settings[routeName].inOrder
              @listeners[parent].post => @listeners[routeName].run callback
            else
              @listeners[parent].pre => @listeners[routeName].run callback
          else
            @parents.push => @listeners[routeName].run callback

          if ++count is @callbacksLength
            startCallback() for startCallback in @parents
            @parents.length = 0
            @callbacksLength = 0
            count = 0

      maxCalls: (@callbacksLength) ->

    class RouterController

      class PriorityHandler

        constructor: (priorities) ->
          @priorityMap = { }
          for priorityName, prioritySettings of priorities
            @priorityMap[priorityName] = prioritySettings.priority

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

        return: (routes, routeName, routeParam) ->
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

      constructor: (routesConfig, animationsConfig) ->
        @states = new StatesCollection routesConfig
        @loadManager = new LoadManager routesConfig
        @animations = new Animations animationsConfig.animations
        @animationsManager = new AnimationsManager animationsConfig.animationsSettings
        @priorityHandler = new PriorityHandler animationsConfig.priorities

      run: (routes, params) ->
        routerKeys = Object.keys routes
        @animationsManager.maxCalls routerKeys.length
        for routeName, count in routerKeys
          do (routeName, routeParam = routes[routeName], count) =>
            currentState = @states.find routeName
            switch routeParam
              when "first"
                currentState.get (instance) =>
                  @loadManager.onready routeName, =>
                    currentState.view = currentState.init instance, params?[routeName]
                    @animationsManager.onready routeName, (callback) =>
                      @animations.go routeName, "first", currentState.view, -> callback()
                      currentState.insert currentState.view
              when "first cache"
                @animationsManager.onready routeName, (callback) =>
                  @animations.go routeName, "first", currentState.view, -> callback()
                  currentState.insert currentState.view
              when "update"
                @animationsManager.onready routeName, (callback) =>
                  @animations.go routeName, "update", currentState.view, -> callback()
                  currentState.update currentState.view, params?[routeName]
              when "new"
                animationName = @priorityHandler.return routes, routeName, "new"
                currentState.get (instance) =>
                  @loadManager.onready routeName, =>
                    currentState.view = currentState.init instance, params?[routeName]
                    @animationsManager.onready routeName, (callback) =>
                      @animations.go routeName, animationName, currentState.view, -> callback()
                      currentState.insert currentState.view
              when "new cache"
                animationName = @priorityHandler.return routes, routeName, "new cache"
                @animationsManager.onready routeName, (callback) =>
                  @animations.go routeName, animationName, currentState.view, -> callback()
                  currentState.insert currentState.view
              when "last"
                @animationsManager.onready routeName, (callback) =>
                  @animations.go routeName, "last", currentState.view, ->
                    currentState.remove currentState.view
                    callback()
              when "old"
                animationName = @priorityHandler.return routes, routeName, "old"
                @animationsManager.onready routeName, (callback) =>
                  @animations.go routeName, animationName, currentState.view, ->
                    currentState.remove currentState.view
                    callback()
              when "visible"
                @animationsManager.onready routeName, (callback) -> callback()
              else
                @animationsManager.onready routeName, (callback) -> callback()

    ###

    3) Объект предоставляющий текущее состояние роутера:
      1) Хранит и обновляет текущее состояние роутера; 

    ###

    class RouterCoordinator

      ###
  
        Мы можем узнать был ли на одном из селекторов ранее new или first или update или visible но на другом

      ###

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
            result = on for cacheName, cacheValue of cache when cacheName is stateName and cacheValue is stateParamsJSON
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

      constructor: (statesConfig) ->
        @config = { }
        @config[stateName] = "unused" for stateName, stateConfig of statesConfig
  
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

    constructor: (statesConfig, animationsConfig) ->
      @routerController = new RouterController statesConfig, animationsConfig
      @routerCoordinator = new RouterCoordinator statesConfig

    go: (requiredStates) ->
      @routerCoordinator.update requiredStates
      @routerController.run @routerCoordinator.config, requiredStates