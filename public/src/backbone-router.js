(function() {
  define(function() {

    /*
    
    Роутер 1.0.0b
     */
    var Router;
    return Router = (function() {

      /*
      
        Объект для распределения данных между конфигами для последующего использования
       */
      var AnimationsHandler, AnimationsManager, ConfigBuilder, Listener, LoadManager, PriorityHandler, RouterCoordinator, State, _getParent;

      ConfigBuilder = (function() {
        function ConfigBuilder(routesConfig, animationsConfig, methodsConfig) {
          var animationName, animationSelector, animationsNames, i, len, routeAnimationConfig, routeConfig, routeName;
          this.config = {
            states: {},
            loads: [],
            animationsProperties: {},
            animations: {},
            priorities: {},
            coordinates: []
          };
          for (routeName in routesConfig) {
            routeConfig = routesConfig[routeName];
            this.config.states[routeName] = {
              url: routeConfig.url,
              load: routeConfig.load ? routeConfig.load : methodsConfig.load,
              initialize: routeConfig.initialize ? routeConfig.initialize : methodsConfig.initialize,
              insert: routeConfig.insert ? routeConfig.insert : methodsConfig.insert,
              update: routeConfig.update ? routeConfig.update : methodsConfig.update,
              remove: routeConfig.remove ? routeConfig.remove : methodsConfig.remove
            };
          }
          this.config.loads = Object.keys(routesConfig);
          for (routeName in routesConfig) {
            routeConfig = routesConfig[routeName];
            animationSelector = routeName.replace(/\:\w+/g, "");
            this.config.animationsProperties[routeName] = {
              show: (function() {
                if (routeConfig.show) {
                  return routeConfig.show;
                } else {
                  try {
                    return animationsConfig[animationSelector].show;
                  } catch (_error) {}
                }
              })(),
              swap: (function() {
                if (routeConfig.swap) {
                  return routeConfig.swap;
                } else {
                  try {
                    return animationsConfig[animationSelector].swap;
                  } catch (_error) {}
                }
              })(),
              hide: (function() {
                if (routeConfig.hide) {
                  return routeConfig.hide;
                } else {
                  try {
                    return animationsConfig[animationSelector].hide;
                  } catch (_error) {}
                }
              })()
            };
          }
          animationsNames = ["first", "last", "update", "topCenter", "centerTop", "bottomCenter", "centerBottom", "leftCenter", "centerLeft", "rightCenter", "centerRight"];
          for (routeName in routesConfig) {
            routeConfig = routesConfig[routeName];
            animationSelector = routeName.replace(/\:\w+/g, "");
            this.config.animations[routeName] = routeAnimationConfig = {};
            for (i = 0, len = animationsNames.length; i < len; i++) {
              animationName = animationsNames[i];
              routeAnimationConfig[animationName] = (function() {
                if (routeConfig[animationName]) {
                  return routeConfig[animationName];
                } else {
                  try {
                    return animationsConfig[animationSelector].animations[animationName];
                  } catch (_error) {}
                }
              })();
            }
          }
          for (routeName in routesConfig) {
            routeConfig = routesConfig[routeName];
            this.config.priorities[routeName] = routeConfig.priority;
          }
          this.config.coordinates = Object.keys(routesConfig);
          return this.config;
        }

        return ConfigBuilder;

      })();


      /*
      
        Объекты состояния
       */

      State = (function() {
        function State(url, loadMethod, initialize, insert, update, remove) {
          this.url = url;
          this.loadMethod = loadMethod;
          this.initialize = initialize;
          this.insert = insert;
          this.update = update;
          this.remove = remove;
          this.instance = null;
          this.view = null;
        }

        State.prototype.load = function(callback) {
          return this.loadMethod(this.url, function(instance) {
            return callback(this.instance = instance);
          });
        };

        return State;

      })();


      /*
      
        Объект для асинхронной загрузки видов
       */

      _getParent = function(routeName) {
        var parentIndex;
        parentIndex = routeName.lastIndexOf(">");
        if (parentIndex !== -1) {
          return routeName.slice(0, parentIndex);
        }
      };

      Listener = (function() {
        function Listener() {
          this.callbacks = {};
        }

        Listener.prototype.add = function(type, handler) {
          var callbacks;
          callbacks = this.callbacks[type];
          if (!callbacks) {
            callbacks = this.callbacks[type] = [];
          }
          return callbacks.push(handler);
        };

        Listener.prototype.run = function(type) {
          var callback, callbacks, i, len;
          callbacks = this.callbacks[type];
          if (!callbacks) {
            return;
          }
          for (i = 0, len = callbacks.length; i < len; i++) {
            callback = callbacks[i];
            callback();
          }
          return callbacks.length = 0;
        };

        return Listener;

      })();

      LoadManager = (function() {
        function LoadManager(routes) {
          var i, len, route;
          this.status = {};
          this.listeners = {};
          for (i = 0, len = routes.length; i < len; i++) {
            route = routes[i];
            this.status[route] = "unused";
            this.listeners[route] = new Listener;
          }
        }

        LoadManager.prototype.complete = function(routeName, callback) {
          this.status[routeName] = "loaded";
          callback();
          return this.listeners[routeName].run("load");
        };

        LoadManager.prototype.onready = function(routeName, callback) {
          var parent;
          parent = _getParent(routeName);
          if (parent) {
            if (this.status[parent] === "loaded") {
              return this.complete(routeName, function() {
                return callback();
              });
            } else {
              return this.listeners[parent].add("load", function() {
                return this.complete(routeName, function() {
                  return callback();
                });
              });
            }
          } else {
            return this.complete(routeName, function() {
              return callback();
            });
          }
        };

        return LoadManager;

      })();


      /*
      
        Дает право выполнять внутрненние асинхронные операции в соответствии с порядком
       */

      AnimationsManager = (function() {
        function AnimationsManager(animationsConfig) {
          var animationConfig, animationName;
          this.options = {};
          this.listeners = {};
          for (animationName in animationsConfig) {
            animationConfig = animationsConfig[animationName];
            this.options[animationName] = animationConfig;
            this.listeners[animationName] = new Listener;
          }
          this.count = 0;
          this.length = Object.keys(animationsConfig).length;
          this.handlers = [];
        }

        AnimationsManager.prototype.run = function() {
          var handlerToRun, i, len, ref;
          if (this.count >= 0) {
            this.count++;
          } else {
            this.count = 1;
          }
          if (this.count === this.length) {
            ref = this.handlers;
            for (i = 0, len = ref.length; i < len; i++) {
              handlerToRun = ref[i];
              handlerToRun();
            }
            this.count = 0;
            return this.handlers.length = 0;
          }
        };

        AnimationsManager.prototype.onready = function(action, name, handlers, callback) {
          var afterEndHandler, afterStartHandler, currentListener, handlres, option, parent, parentIndex, parentListener;
          option = this.options[name][action];
          currentListener = this.listeners[name];
          afterEndHandler = handlers.afterEnd;
          afterStartHandler = handlers.afterStart;
          parentIndex = name.lastIndexOf(">");
          if (parentIndex !== -1) {
            parent = name.slice(0, parentIndex);
            parentListener = this.listeners[parent];
            switch (option) {
              case "free":
                parentListener.add("afterStart", (function(_this) {
                  return function() {
                    callback(function() {
                      try {
                        afterEndHandler();
                      } catch (_error) {}
                      return currentListener.run("afterEnd");
                    });
                    return setTimeout(function() {
                      try {
                        afterStartHandler();
                      } catch (_error) {}
                      return currentListener.run("afterStart");
                    });
                  };
                })(this));
                break;
              case "order":
                parentListener.add("afterEnd", (function(_this) {
                  return function() {
                    callback(function() {
                      try {
                        afterEndHandler();
                      } catch (_error) {}
                      return currentListener.run("afterEnd");
                    });
                    return setTimeout(function() {
                      try {
                        afterStartHandler();
                      } catch (_error) {}
                      return currentListener.run("afterStart");
                    });
                  };
                })(this));
                break;
              case "none":
                parentListener.add("afterStart", (function(_this) {
                  return function() {
                    return setTimeout(function() {
                      try {
                        afterStartHandler();
                        afterEndHandler();
                      } catch (_error) {}
                      currentListener.run("afterStart");
                      return currentListener.run("afterEnd");
                    });
                  };
                })(this));
            }
          } else {
            if (!this.handlers) {
              this.handlers = [];
            }
            handlres = this.handlers;
            switch (option) {
              case "free" || "order":
                handlres.push((function(_this) {
                  return function() {
                    callback(function() {
                      try {
                        afterEndHandler();
                      } catch (_error) {}
                      return currentListener.run("afterEnd");
                    });
                    return setTimeout(function() {
                      try {
                        afterStartHandler();
                      } catch (_error) {}
                      return currentListener.run("afterStart");
                    });
                  };
                })(this));
                break;
              case "none":
                handlres.push((function(_this) {
                  return function() {
                    setTimeout(function() {
                      try {
                        afterStartHandler();
                        afterEndHandler();
                      } catch (_error) {}
                      return currentListener.run("afterStart");
                    });
                    return currentListener.run("afterEnd");
                  };
                })(this));
            }
          }
          return this.run();
        };

        AnimationsManager.prototype.empty = function(settings) {
          var currentListener, handlres, name, parent, parentIndex, parentListener;
          name = settings.name;
          currentListener = this.listeners[name];
          parentIndex = name.lastIndexOf(">");
          if (parentIndex !== -1) {
            parent = name.slice(0, parentIndex);
            if (!this.listeners[parent]) {
              this.listeners[parent] = new Listener;
            }
            parentListener = this.listeners[parent];
            parentListener.add("afterEnd", (function(_this) {
              return function() {
                return setTimeout(function() {
                  currentListener.run("afterStart");
                  return currentListener.run("afterEnd");
                });
              };
            })(this));
          } else {
            if (!this.handlers) {
              this.handlers = [];
            }
            handlres = this.handlers;
            handlres.push((function(_this) {
              return function() {
                return setTimeout(function() {
                  currentListener.run("afterStart");
                  return currentListener.run("afterEnd");
                });
              };
            })(this));
          }
          return this.run();
        };

        return AnimationsManager;

      })();

      AnimationsHandler = (function() {
        function AnimationsHandler(animationsConfig) {
          var animationConfig, animationName;
          this.animations = {};
          for (animationName in animationsConfig) {
            animationConfig = animationsConfig[animationName];
            this.animations[animationName] = animationConfig;
          }
        }

        AnimationsHandler.prototype["do"] = function(routeName, animationName, view, callback) {
          var currentAnimation;
          try {
            currentAnimation = this.animations[routeName][animationName];
            return currentAnimation(view, function() {
              return callback();
            });
          } catch (_error) {}
        };

        return AnimationsHandler;

      })();


      /*
      
        Координирует запросы на обновление роутинга
       */

      RouterCoordinator = (function() {
        var _isActive, _isNew, _isOld, _isUpdate;

        _isNew = function(states, checkedStateName) {
          var stateName, stateValue;
          for (stateName in states) {
            stateValue = states[stateName];
            if (checkedStateName.slice(0, checkedStateName.lastIndexOf(":")) === stateName.slice(0, stateName.lastIndexOf(":"))) {
              if (checkedStateName !== stateName) {
                if (stateValue === "first" || stateValue === "first cache" || stateValue === "update" || stateValue === "new" || stateValue === "new cache" || stateValue === "visible") {
                  return true;
                }
              }
            }
          }
        };

        _isUpdate = (function() {
          var cache;
          cache = {};
          return function(stateName, stateParams) {
            var cacheName, cacheValue, result, stateParamsJSON;
            stateParamsJSON = JSON.stringify(stateParams);
            result = false;
            for (cacheName in cache) {
              cacheValue = cache[cacheName];
              if (cacheName === stateName && cacheValue !== stateParamsJSON) {
                result = true;
              }
            }
            cache[stateName] = stateParamsJSON;
            return result;
          };
        })();

        _isActive = function(states, checkedStateName) {
          var stateName, stateValue;
          for (stateName in states) {
            stateValue = states[stateName];
            if (checkedStateName === stateName) {
              return true;
            }
          }
        };

        _isOld = function(states, checkedStateName) {
          var checkedStateNameSelector, stateName, stateNameSelector, stateValue;
          checkedStateNameSelector = checkedStateName.slice(0, checkedStateName.lastIndexOf(":"));
          for (stateName in states) {
            stateValue = states[stateName];
            stateNameSelector = stateName.slice(0, stateName.lastIndexOf(":"));
            if (checkedStateNameSelector === stateNameSelector) {
              if (stateValue === "new" || stateValue === "new cache") {
                if (stateName !== checkedStateName) {
                  return true;
                }
              }
            }
          }
        };

        function RouterCoordinator(coordinatesList) {
          var coordinate, i, len;
          this.config = {};
          for (i = 0, len = coordinatesList.length; i < len; i++) {
            coordinate = coordinatesList[i];
            this.config[coordinate] = "unused";
          }
        }

        RouterCoordinator.prototype.update = function(requiredStates) {
          var configStateName, configStateValue, currentStateParam, isActive, isNew, isOld, isUpdate, ref, requiredStateName, requiredStateParams;
          for (requiredStateName in requiredStates) {
            requiredStateParams = requiredStates[requiredStateName];
            currentStateParam = this.config[requiredStateName];
            isNew = _isNew(this.config, requiredStateName);
            isUpdate = _isUpdate(requiredStateName, requiredStateParams);
            if (currentStateParam === "unused" && !isNew) {
              this.config[requiredStateName] = "first";
            } else if (!isNew && (currentStateParam === "last" || currentStateParam === "invisible")) {
              this.config[requiredStateName] = "first cache";
            } else if (isUpdate && (currentStateParam === "first" || currentStateParam === "first cache" || currentStateParam === "update" || currentStateParam === "new" || currentStateParam === "new cache" || currentStateParam === "visible")) {
              this.config[requiredStateName] = "update";
            } else if (isNew && currentStateParam === "unused") {
              this.config[requiredStateName] = "new";
            } else if (isNew && (currentStateParam === "old" || currentStateParam === "invisible")) {
              this.config[requiredStateName] = "new cache";
            } else if (currentStateParam === "first" || currentStateParam === "first cache" || currentStateParam === "update" || currentStateParam === "new" || currentStateParam === "new cache") {
              this.config[requiredStateName] = "visible";
            }
          }
          ref = this.config;
          for (configStateName in ref) {
            configStateValue = ref[configStateName];
            isActive = _isActive(requiredStates, configStateName);
            isOld = _isOld(this.config, configStateName);
            if (!isActive && !isOld && (configStateValue === "first" || configStateValue === "first cache" || configStateValue === "new" || configStateValue === "new cache" || configStateValue === "update" || configStateValue === "visible")) {
              this.config[configStateName] = "last";
            } else if (!isActive && isOld && (configStateValue === "first" || configStateValue === "first cache" || configStateValue === "new" || configStateValue === "new cache" || configStateValue === "update" || configStateValue === "visible")) {
              this.config[configStateName] = "old";
            } else if (configStateValue === "last" || configStateValue === "old") {
              this.config[configStateName] = "invisible";
            }
          }
          return this.config;
        };

        return RouterCoordinator;

      })();


      /*
      
        Обрабатывает параметры приоритетов видов
       */

      PriorityHandler = (function() {
        function PriorityHandler(priorities) {
          var priorityName, priorityValue;
          this.priorityMap = {};
          for (priorityName in priorities) {
            priorityValue = priorities[priorityName];
            this.priorityMap[priorityName] = priorityValue;
          }
        }

        PriorityHandler.prototype.findPair = function(routes, matchRouteName, type) {
          var matchString, routerName, routerValue;
          matchString = matchRouteName.slice(0, matchRouteName.lastIndexOf(":"));
          for (routerName in routes) {
            routerValue = routes[routerName];
            if (routerName.indexOf(matchString) !== -1) {
              if (routerName.slice(matchString.length).indexOf(">") === -1) {
                if (type === "old") {
                  if (routerValue === "new cache" || routerValue === "new") {
                    return routerName;
                  }
                } else if (type === "new cache" || type === "new") {
                  if (routerValue === "old") {
                    return routerName;
                  }
                }
              }
            }
          }
        };

        PriorityHandler.prototype.animationName = function(routes, routeName, routeParam) {
          var currentHorisontalPriority, currentVerticalPriority, pairRoute, previriousHorisontalPriority, previriousVerticalPriority;
          pairRoute = this.findPair(routes, routeName, routeParam);
          previriousVerticalPriority = this.priorityMap[routeName][0];
          previriousHorisontalPriority = this.priorityMap[routeName][1];
          currentVerticalPriority = this.priorityMap[pairRoute][0];
          currentHorisontalPriority = this.priorityMap[pairRoute][1];
          if (routeParam === "old") {
            if (previriousVerticalPriority > currentVerticalPriority) {
              return "centerBottom";
            } else if (previriousVerticalPriority < currentVerticalPriority) {
              return "centerTop";
            } else if (previriousVerticalPriority === currentVerticalPriority) {
              if (previriousHorisontalPriority > currentHorisontalPriority) {
                return "centerRight";
              } else if (previriousHorisontalPriority < currentHorisontalPriority) {
                return "centerLeft";
              }
            }
          } else if (routeParam === "new" || routeParam === "new cache") {
            if (previriousVerticalPriority > currentVerticalPriority) {
              return "bottomCenter";
            } else if (previriousVerticalPriority < currentVerticalPriority) {
              return "topCenter";
            } else if (previriousVerticalPriority === currentVerticalPriority) {
              if (previriousHorisontalPriority > currentHorisontalPriority) {
                return "rightCenter";
              } else if (previriousHorisontalPriority < currentHorisontalPriority) {
                return "leftCenter";
              }
            }
          }
        };

        return PriorityHandler;

      })();

      function Router(routesConfig, animationsConfig, methodsConfig) {
        var ref, stateName, stateSettings;
        this.config = new ConfigBuilder(routesConfig, animationsConfig, methodsConfig);
        this.states = {};
        ref = this.config.states;
        for (stateName in ref) {
          stateSettings = ref[stateName];
          this.states[stateName] = new State(stateSettings.url, stateSettings.load, stateSettings.initialize, stateSettings.insert, stateSettings.update, stateSettings.remove);
        }
        this.loadManager = new LoadManager(this.config.loads);
        this.animationsManager = new AnimationsManager(this.config.animationsProperties);
        this.animationsHandler = new AnimationsHandler(this.config.animations);
        this.routerCoordinator = new RouterCoordinator(this.config.coordinates);
        this.priorityHandler = new PriorityHandler(this.config.priorities);
      }

      Router.prototype.go = function(requiredStates) {
        var count, i, len, results, routeName, routerKeys, stateCoordinates;
        stateCoordinates = this.routerCoordinator.update(requiredStates);
        routerKeys = Object.keys(stateCoordinates);
        results = [];
        for (count = i = 0, len = routerKeys.length; i < len; count = ++i) {
          routeName = routerKeys[count];
          results.push((function(_this) {
            return function(routeName, routeCoordinate) {
              var animationName, currentState, currentStateChainNames, currentStateSelector;
              currentState = _this.states[routeName];
              currentStateChainNames = routeName.split(">");
              currentStateSelector = currentStateChainNames[currentStateChainNames.length - 1].split(":")[0];
              switch (routeCoordinate) {
                case "first":
                  return currentState.load(function(instance) {
                    return _this.loadManager.onready(routeName, function() {
                      currentState.view = currentState.initialize(instance, typeof params !== "undefined" && params !== null ? params[routeName] : void 0);
                      return (function(view) {
                        return _this.animationsManager.onready("show", routeName, {
                          afterStart: function() {
                            return currentState.insert(currentStateSelector, view);
                          }
                        }, function(done) {
                          return _this.animationsHandler["do"](routeName, "first", view, function() {
                            return done();
                          });
                        });
                      })(currentState.view);
                    });
                  });
                case "first cache":
                  return currentState.load(function(instance) {
                    return _this.loadManager.onready(routeName, function() {
                      currentState.view = currentState.initialize(instance, typeof params !== "undefined" && params !== null ? params[routeName] : void 0);
                      return (function(view) {
                        return _this.animationsManager.onready("show", routeName, {
                          afterStart: function() {
                            return currentState.insert(currentStateSelector, view);
                          }
                        }, function(done) {
                          return _this.animationsHandler["do"](routeName, "first", view, function() {
                            return done();
                          });
                        });
                      })(currentState.view);
                    });
                  });
                case "update":
                  return _this.loadManager.onready(routeName, function() {
                    return (function(view) {
                      return _this.animationsManager.onready("show", routeName, {
                        afterStart: function() {
                          return currentState.update(currentState.view, typeof params !== "undefined" && params !== null ? params[routeName] : void 0);
                        }
                      }, function(done) {
                        return _this.animationsHandler["do"](routeName, "update", view, function() {
                          return done();
                        });
                      });
                    })(currentState.view);
                  });
                case "new":
                  return currentState.load(function(instance) {
                    var animationName;
                    animationName = _this.priorityHandler.animationName(stateCoordinates, routeName, "new");
                    return _this.loadManager.onready(routeName, function() {
                      currentState.view = currentState.initialize(instance, typeof params !== "undefined" && params !== null ? params[routeName] : void 0);
                      return (function(view) {
                        return _this.animationsManager.onready("swap", routeName, {
                          afterStart: function() {
                            return currentState.insert(currentStateSelector, view);
                          }
                        }, function(done) {
                          return _this.animationsHandler["do"](routeName, animationName, view, function() {
                            return done();
                          });
                        });
                      })(currentState.view);
                    });
                  });
                case "new cache":
                  return currentState.load(function(instance) {
                    var animationName;
                    animationName = _this.priorityHandler.animationName(stateCoordinates, routeName, "new");
                    return _this.loadManager.onready(routeName, function() {
                      currentState.view = currentState.initialize(instance, typeof params !== "undefined" && params !== null ? params[routeName] : void 0);
                      return (function(view) {
                        return _this.animationsManager.onready("swap", routeName, {
                          afterStart: function() {
                            return currentState.insert(currentStateSelector, view);
                          }
                        }, function(done) {
                          return _this.animationsHandler["do"](routeName, animationName, view, function() {
                            return done();
                          });
                        });
                      })(currentState.view);
                    });
                  });
                case "last":
                  return _this.loadManager.onready(routeName, function() {
                    return (function(view) {
                      return _this.animationsManager.onready("hide", routeName, {
                        afterEnd: function() {
                          return currentState.remove(view);
                        }
                      }, function(done) {
                        return _this.animationsHandler["do"](routeName, "last", view, function() {
                          return done();
                        });
                      });
                    })(currentState.view);
                  });
                case "old":
                  animationName = _this.priorityHandler.animationName(stateCoordinates, routeName, "old");
                  return _this.loadManager.onready(routeName, function() {
                    return (function(view) {
                      return _this.animationsManager.onready("hide", routeName, {
                        afterEnd: function() {
                          return currentState.remove(view);
                        }
                      }, function(done) {
                        return _this.animationsHandler["do"](routeName, animationName, view, function() {
                          return done();
                        });
                      });
                    })(currentState.view);
                  });
                default:
                  return _this.animationsManager.empty({
                    name: routeName
                  });
              }
            };
          })(this)(routeName, stateCoordinates[routeName]));
        }
        return results;
      };

      return Router;

    })();
  });

}).call(this);
