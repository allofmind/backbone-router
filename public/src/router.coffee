window.router = new class Router

  constructor: ->
    @routes = { }

  extend: (routesConfig) ->
    @routes[routeName] = routeConfig for routeName, routeConfig of routesConfig
    @setRoutes @routes

  start: -> window.dispatchEvent new HashChangeEvent "hashchange"

  setRoutes: (routes) ->
    window.addEventListener "hashchange", (event) =>
      currentHash = location.hash
      currentHashMulti = currentHash.split "|"

      statesToRun = { }
      for currentHashRoute in currentHashMulti
        for routeName, routeConfig of routes
          if currentHashRoute is routeName
            routeStates = routes[routeName]()
            for routeName, routeParams of routeStates
              statesToRun[routeName] = routeParams

      view.require statesToRun

window.navigation = new class Navigation

  constructor: ->
    @selectors = { }

  extend: (config) ->
    @selectors[routeName] = routeSelector for routeName, routeSelector of config

  add: ->

  remove: ->

  to: ->

  switch: ->

  go: ->