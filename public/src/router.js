(function() {
  var Navigation, Router;

  window.router = new (Router = (function() {
    function Router() {
      this.routes = {};
    }

    Router.prototype.extend = function(routesConfig) {
      var routeConfig, routeName;
      for (routeName in routesConfig) {
        routeConfig = routesConfig[routeName];
        this.routes[routeName] = routeConfig;
      }
      return this.setRoutes(this.routes);
    };

    Router.prototype.start = function() {
      return window.dispatchEvent(new HashChangeEvent("hashchange"));
    };

    Router.prototype.setRoutes = function(routes) {
      return window.addEventListener("hashchange", (function(_this) {
        return function(event) {
          var currentHash, currentHashMulti, currentHashRoute, i, len, routeConfig, routeName, routeParams, routeStates, statesToRun;
          currentHash = location.hash;
          currentHashMulti = currentHash.split("|");
          statesToRun = {};
          for (i = 0, len = currentHashMulti.length; i < len; i++) {
            currentHashRoute = currentHashMulti[i];
            for (routeName in routes) {
              routeConfig = routes[routeName];
              if (currentHashRoute === routeName) {
                routeStates = routes[routeName]();
                for (routeName in routeStates) {
                  routeParams = routeStates[routeName];
                  statesToRun[routeName] = routeParams;
                }
              }
            }
          }
          return view.require(statesToRun);
        };
      })(this));
    };

    return Router;

  })());

  window.navigation = new (Navigation = (function() {
    function Navigation() {
      this.selectors = {};
    }

    Navigation.prototype.extend = function(config) {
      var results, routeName, routeSelector;
      results = [];
      for (routeName in config) {
        routeSelector = config[routeName];
        results.push(this.selectors[routeName] = routeSelector);
      }
      return results;
    };

    Navigation.prototype.add = function() {};

    Navigation.prototype.remove = function() {};

    Navigation.prototype.to = function() {};

    Navigation.prototype["switch"] = function() {};

    Navigation.prototype.go = function() {};

    return Navigation;

  })());

}).call(this);
