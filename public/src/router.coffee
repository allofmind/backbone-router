###
Роутер 1.0.0b
###

###

  Сократить менеджер анимаций до конца разработки;

###

window.router = new class Router

  _getParent = (stateName) ->
    parentIndex = stateName.lastIndexOf ">"
    stateName.slice 0, parentIndex if parentIndex isnt -1

  _getType = (argument) -> Object.prototype.toString.call(argument).slice 8, -1

  _getSelector = (stateName) ->
    currentStateChainNames = stateName.split ">"
    currentStateSelector = currentStateChainNames[currentStateChainNames.length-1].split(":")[0]


  ###
    Объекты состояния
  ###

  class State
    constructor: (stateConfig) ->
      @url = stateConfig.url
      @loadMethod = stateConfig.load
      @initialize = stateConfig.initialize
      @insert = stateConfig.insert
      @update = stateConfig.update
      @remove = stateConfig.remove
      @beforeInitialize = stateConfig.beforeInitialize
      @afterInitialize = stateConfig.afterInitialize
      @beforeHide = stateConfig.beforeHide
      @afterHide = stateConfig.afterHide

      @instance = null
      @view = null

    load: (callback) -> @loadMethod @url, (instance) => callback @instance = instance



  ###
    Объект для асинхронной загрузки видов
  ###

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
    constructor: (argument) ->
      @status = { }
      @listeners = { }

      @setListeners(argument) if argument

    setListeners: (argument) ->
      type = _getType argument

      if type is "String"
        listenerName = argument
        @status[listenerName] = "unused"
        @listeners[listenerName] = new Listener
      else if type is "Array"
        listenersNames = argument
        for listenerName in listenersNames
          @status[listenerName] = "unused"
          @listeners[listenerName] = new Listener

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
          @listeners[parent].add "load", =>
            @complete routeName, -> callback()
      else
        @complete routeName, -> callback()



  ###
    Дает право выполнять внутрненние асинхронные операции в соответствии с порядком
  ###

  class AnimationsManager
    constructor: (animationsConfig) ->
      @settings = { }
      @listeners = { }
      @ready = 0
      @queue = 0
      @handlers = [ ]

    setSettings: (stateName, animationsSettings) ->
      @settings[stateName] = animationsSettings
      @listeners[stateName] = new Listener
      @queue = Object.keys(@settings).length

    run: ->
      if @ready >= 0 then @ready++ else @ready = 1
      if @ready is @queue
        handlerToRun() for handlerToRun in @handlers
        @ready = 0
        @handlers.length = 0

    onready: (action, name, managerCallbacks, animationCallback) ->
      option = @settings[name][action]
      currentListener = @listeners[name]
      afterEndHandler = managerCallbacks.afterEnd
      afterStartHandler = managerCallbacks.afterStart
      parentIndex = name.lastIndexOf ">"
      if parentIndex isnt -1
        parent = name.slice 0, parentIndex
        parentListener = @listeners[parent]
        switch option
          when "free"
            parentListener.add "afterStart", =>
              animationCallback =>
                try afterEndHandler()
                currentListener.run "afterEnd"
              setTimeout ->
                try afterStartHandler()
                currentListener.run "afterStart"
          when "order"
            parentListener.add "afterEnd", =>
              animationCallback =>
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
        switch option
          when "free"
            @handlers.push =>
              animationCallback =>
                try afterEndHandler()
                currentListener.run "afterEnd"
              setTimeout ->
                try afterStartHandler()
                currentListener.run "afterStart"
          when "order"
            @handlers.push =>
              animationCallback =>
                try afterEndHandler()
                currentListener.run "afterEnd"
              setTimeout ->
                try afterStartHandler()
                currentListener.run "afterStart"
          when "none"
            @handlers.push =>
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
        @handlers.push =>
          setTimeout =>
            currentListener.run "afterStart"
            currentListener.run "afterEnd"
      @run()

  class AnimationsHandler
    constructor: (@animations = { }) ->

    setAnimations: (stateName, stateAnimations) -> @animations[stateName] = stateAnimations

    do: (routeName, animationName, view, callback) ->
      try
        currentAnimation = @animations[routeName][animationName]
        currentAnimation view, -> callback()
      catch
        callback()



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
    
    constructor: (@config = { }) ->

    setCoorginate: (stateName) -> @config[stateName] = "unused"

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
    constructor: (@prioritiesMap = { }) ->

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

    setPriority: (stateName, statePriority) -> @prioritiesMap[stateName] = if statePriority then statePriority else "00"

    animationName: (routes, routeName, routeParam) ->
      pairRoute = @findPair routes, routeName, routeParam

      previriousVerticalPriority = @prioritiesMap[routeName][0]
      previriousHorisontalPriority = @prioritiesMap[routeName][1]
      currentVerticalPriority = @prioritiesMap[pairRoute][0]
      currentHorisontalPriority = @prioritiesMap[pairRoute][1]

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
          else if previriousHorisontalPriority is currentHorisontalPriority
            "last"
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
          else if previriousHorisontalPriority is currentHorisontalPriority
            "first"


    ###
    
      Код для формировнаия множественного урла
    
      Посмотреть на событие DOMSubtreeModified и постаратся автоматизировать бинды на ссылка
    
    ###

  constructor: (viewsConfig, animationsConfig, methodsConfig) ->
    @statesMethods = { }
    @states = { }
    @loadManager = new LoadManager
    @animationsManager = new AnimationsManager
    @animationsHandler = new AnimationsHandler
    @routerCoordinator = new RouterCoordinator
    @priorityHandler = new PriorityHandler

  start: -> window.dispatchEvent new HashChangeEvent "hashchange"

  setMethods: (methodsConfig) -> @statesMethods[methodName] = methodHanlder for methodName, methodHanlder of methodsConfig

  setViews: (viewsConfig) ->
    for viewName, viewSettings of viewsConfig
      do (viewSettings) =>
        @states[viewName] = new State
          url: viewSettings.url
          load:
            if viewSettings.load
              viewSettings.load
            else if @statesMethods.load
              @statesMethods.load
          initialize:
            if viewSettings.initialize
              viewSettings.initialize
            else if @statesMethods.initialize
              @statesMethods.initialize
          insert:
            if viewSettings.insert
              viewSettings.insert
            else if @statesMethods.insert
              @statesMethods.insert
          update:
            if viewSettings.update
              viewSettings.update
            else if @statesMethods.update
              @statesMethods.update
          remove:
            if viewSettings.remove
              viewSettings.remove
            else if @statesMethods.remove
              @statesMethods.remove
          beforeInitialize:
            if @statesMethods.beforeInitialize and viewSettings.beforeInitialize
              =>
                @statesMethods.beforeInitialize()
                viewSettings.beforeInitialize()
            else if @statesMethods.beforeInitialize
              =>
                @statesMethods.beforeInitialize()
            else if viewSettings.beforeInitialize
              ->
                viewSettings.beforeInitialize()
          afterInitialize:
            if @statesMethods.afterInitialize and viewSettings.afterInitialize
              =>
                @statesMethods.afterInitialize()
                viewSettings.afterInitialize()
            else if @statesMethods.afterInitialize
              =>
                @statesMethods.afterInitialize()
            else if viewSettings.afterInitialize
              ->
                viewSettings.afterInitialize()
          beforeHide:
            if @statesMethods.beforeHide and viewSettings.beforeHide
              =>
                @statesMethods.beforeHide()
                viewSettings.beforeHide()
            else if @statesMethods.beforeHide
              =>
                @statesMethods.beforeHide()
            else if viewSettings.beforeHide
              ->
                viewSettings.beforeHide()
          afterHide:
            if @statesMethods.afterHide and viewSettings.afterHide
              =>
                @statesMethods.afterHide()
                viewSettings.afterHide()
            else if @statesMethods.afterHide
              =>
                @statesMethods.afterHide()
            else if viewSettings.afterHide
              ->
                viewSettings.afterHide()

        @loadManager.setListeners viewName

        @routerCoordinator.setCoorginate viewName

        @priorityHandler.setPriority viewName, viewSettings.priority

    @stateNames = Object.keys @states

  setAnimations: (animationsConfig) ->
    for animationConfig in animationsConfig
      statesList = animationConfig.states
      for stateName in statesList
        @animationsHandler.setAnimations stateName, animationConfig.animations
        @animationsManager.setSettings stateName,
          show:
            if animationConfig.show
              animationConfig.show
            else
              "free"
          swap: 
            if animationConfig.swap
              animationConfig.swap
            else
              "free"
          hide: 
            if animationConfig.hide
              animationConfig.hide
            else
              "free"

  setRoutes: (routesConfig, @doubleHashs) ->
    window.addEventListener "hashchange", (event) =>
      currentHash = location.hash
      currentHashMulti = currentHash.split "|"

      statesToRun = { }
      for currentHashRoute in currentHashMulti
        for routeName, routeConfig of routesConfig
          if currentHashRoute is routeName
            routeStates = routesConfig[routeName]()
            for routeName, routeParams of routeStates
              statesToRun[routeName] = routeParams

      @run statesToRun

  go: (newHash) ->
    currentHash = location.hash
    resultHash = ""
  
    isMultiple = currentHash.indexOf("|") isnt -1
  
    if isMultiple
      currentHashMulti = currentHash.split "|"
      resultHashMulti = currentHash.split "|"
  
      containIndex = currentHashMulti.indexOf(newHash)
      isContain = containIndex isnt -1
  
      if isContain
        resultHashMulti.splice containIndex, 1
        resultHash = resultHashMulti.join "|"
        location.hash = resultHash
        return
  
      newHashRoutes = newHash.split "/"
      makeIsEqual = off
      indexToReplace = null
      for currentHashRoute, hashMultiIndex in currentHashMulti
        currentHashRoutes = currentHashRoute.split "/"
        for currentHashRoute, hashRouteIndex in currentHashRoutes
          currentNestedRoute = currentHashRoutes.slice(0, hashRouteIndex+1).join "/"
          newHashRoute = newHashRoutes[hashRouteIndex]
          newNestedRoute = newHashRoutes.slice(0, hashRouteIndex+1).join "/"
          if currentHashRoute and newHashRoute and currentNestedRoot is newNestedRoot
            currentNestedRoot = currentHashRoutes.slice(0, hashRouteIndex).join "/"
            newNestedRoot = newHashRoutes.slice(0, hashRouteIndex).join "/"
            if currentHashRoute isnt newHashRoute
              newNestedMake = try @doubleHashs[newNestedRoute]
              currentNestedMake = try @doubleHashs[currentNestedRoute]
              if currentNestedMake isnt newNestedMake and not makeIsEqual
                makeIsEqual = off
              else if currentNestedMake is newNestedMake
                makeIsEqual = on
                indexToReplace = hashMultiIndex
          else if not currentHashRoute and newHashRoute
            resultHashMulti[hashMultiIndex] = newHash
            resultHash = resultHashMulti.join "|"
            location.hash = resultHash
            return
          else if currentHashRoute and not newHashRoute
            resultHash = newHash
            location.hash = resultHash
            return
  
      unless makeIsEqual
        resultHash = "#{currentHash}|#{newHash}"
        location.hash = resultHash
      else
        resultHashMulti[indexToReplace] = newHash
        resultHash = resultHashMulti.join "|"
        location.hash = resultHash
  
    else
      currentHashRoutes = currentHash.split "/"
      newHashRoutes = newHash.split "/"
  
      currentNestedRoute = ""
      newNestedRoute = ""
      beUpdated = off
      for currentHashRoute, hashRouteIndex in currentHashRoutes
        currentNestedRoute = currentHashRoutes.slice(0, hashRouteIndex+1).join "/"
        newHashRoute = newHashRoutes[hashRouteIndex]
        newNestedRoute = newHashRoutes.slice(0, hashRouteIndex+1).join "/"
        if currentHashRoute and newHashRoute and currentHashRoute isnt newHashRoute
          currentNestedRoot = currentHashRoutes.slice(0, hashRouteIndex).join "/"
          newNestedRoot = newHashRoutes.slice(0, hashRouteIndex).join "/"
          if currentNestedRoot is newNestedRoot
            currentNestedMake = try @doubleHashs[currentNestedRoute]
            newNestedMake = try @doubleHashs[newNestedRoute]
            unless currentNestedMake is newNestedMake
              resultHash = "#{currentHash}|#{newHash}"
              location.hash = resultHash
              return
            else if currentNestedMake is newNestedMake
              resultHash = newHash
              location.hash = resultHash
              return
            beUpdated = on
  
      unless beUpdated
        resultHash = newHash
        location.hash = resultHash

  run: (requiredStates) ->
    stateCoordinates = @routerCoordinator.update requiredStates
    for routeName, count in @stateNames
      do (routeName, currentState = @states[routeName], routeCoordinate = stateCoordinates[routeName]) =>
        currentStateSelector = _getSelector routeName
        switch routeCoordinate
          when "first"
            currentState.load (instance) =>
              @loadManager.onready routeName, =>
                currentState.view = currentState.initialize instance, params?[routeName]
                do (view = currentState.view) =>
                  @animationsManager.onready "show", routeName,
                    afterStart: -> currentState.insert currentStateSelector, view
                  , (done) =>
                    currentState.beforeInitialize() if _getType(currentState.beforeInitialize) is "Function"
                    @animationsHandler.do routeName, "first", view, ->
                      currentState.afterInitialize() if _getType(currentState.afterInitialize) is "Function"
                      done()
          when "first cache"
            currentState.load (instance) =>
              @loadManager.onready routeName, =>
                currentState.view = currentState.initialize instance, params?[routeName]
                do (view = currentState.view) =>
                  @animationsManager.onready "show", routeName,
                    afterStart: -> currentState.insert currentStateSelector, view
                  , (done) =>
                    currentState.beforeInitialize() if _getType(currentState.beforeInitialize) is "Function"
                    @animationsHandler.do routeName, "first", view, ->
                      currentState.afterInitialize() if _getType(currentState.afterInitialize) is "Function"
                      done()
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
                  , (done) =>
                    currentState.beforeInitialize() if _getType(currentState.beforeInitialize) is "Function"
                    @animationsHandler.do routeName, animationName, view, ->
                      currentState.afterInitialize() if _getType(currentState.afterInitialize) is "Function"
                      done()
          when "new cache"
            currentState.load (instance) =>
              animationName = @priorityHandler.animationName stateCoordinates, routeName, "new"
              @loadManager.onready routeName, =>
                currentState.view = currentState.initialize instance, params?[routeName]
                do (view = currentState.view) =>
                  @animationsManager.onready "swap", routeName,
                    afterStart: -> currentState.insert currentStateSelector, view
                  , (done) =>
                    currentState.beforeInitialize() if _getType(currentState.beforeInitialize) is "Function"
                    @animationsHandler.do routeName, animationName, view, ->
                      currentState.afterInitialize() if _getType(currentState.afterInitialize) is "Function"
                      done()
          when "last"
            @loadManager.onready routeName, =>
              do (view = currentState.view) =>
                @animationsManager.onready "hide", routeName,
                  afterEnd: -> currentState.remove view
                , (done) =>
                  currentState.beforeHide() if _getType(currentState.beforeHide) is "Function"
                  @animationsHandler.do routeName, "last", view, ->
                    currentState.afterHide() if _getType(currentState.afterHide) is "Function"
                    done()
          when "old"
            animationName = @priorityHandler.animationName stateCoordinates, routeName, "old"
            @loadManager.onready routeName, =>
              do (view = currentState.view) =>
                @animationsManager.onready "hide", routeName,
                  afterEnd: -> currentState.remove view
                , (done) =>
                  currentState.beforeHide() if _getType(currentState.beforeHide) is "Function"
                  @animationsHandler.do routeName, animationName, view, ->
                    currentState.afterHide() if _getType(currentState.afterHide) is "Function"
                    done()
          else
            @animationsManager.empty name: routeName