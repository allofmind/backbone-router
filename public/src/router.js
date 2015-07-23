
/*
Роутер 1.0.0b
 */


/*

  Сократить менеджер анимаций до конца разработки;
 */

(function() {
  var Router;

  window.router = new (Router = (function() {
    var AnimationsHandler, AnimationsManager, Listener, LoadManager, PriorityHandler, RouterCoordinator, State, _getParent, _getSelector, _getType;

    _getParent = function(stateName) {
      var parentIndex;
      parentIndex = stateName.lastIndexOf(">");
      if (parentIndex !== -1) {
        return stateName.slice(0, parentIndex);
      }
    };

    _getType = function(argument) {
      return Object.prototype.toString.call(argument).slice(8, -1);
    };

    _getSelector = function(stateName) {
      var currentStateChainNames, currentStateSelector;
      currentStateChainNames = stateName.split(">");
      return currentStateSelector = currentStateChainNames[currentStateChainNames.length - 1].split(":")[0];
    };


    /*
      Объекты состояния
     */

    State = (function() {
      function State(stateConfig) {
        this.url = stateConfig.url;
        this.loadMethod = stateConfig.load;
        this.initialize = stateConfig.initialize;
        this.insert = stateConfig.insert;
        this.update = stateConfig.update;
        this.remove = stateConfig.remove;
        this.beforeInitialize = stateConfig.beforeInitialize;
        this.afterInitialize = stateConfig.afterInitialize;
        this.beforeHide = stateConfig.beforeHide;
        this.afterHide = stateConfig.afterHide;
        this.instance = null;
        this.view = null;
      }

      State.prototype.load = function(callback) {
        return this.loadMethod(this.url, (function(_this) {
          return function(instance) {
            return callback(_this.instance = instance);
          };
        })(this));
      };

      return State;

    })();


    /*
      Объект для асинхронной загрузки видов
     */

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
      function LoadManager(argument) {
        this.status = {};
        this.listeners = {};
        if (argument) {
          this.setListeners(argument);
        }
      }

      LoadManager.prototype.setListeners = function(argument) {
        var i, len, listenerName, listenersNames, results, type;
        type = _getType(argument);
        if (type === "String") {
          listenerName = argument;
          this.status[listenerName] = "unused";
          return this.listeners[listenerName] = new Listener;
        } else if (type === "Array") {
          listenersNames = argument;
          results = [];
          for (i = 0, len = listenersNames.length; i < len; i++) {
            listenerName = listenersNames[i];
            this.status[listenerName] = "unused";
            results.push(this.listeners[listenerName] = new Listener);
          }
          return results;
        }
      };

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
            return this.listeners[parent].add("load", (function(_this) {
              return function() {
                return _this.complete(routeName, function() {
                  return callback();
                });
              };
            })(this));
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
        this.settings = {};
        this.listeners = {};
        this.ready = 0;
        this.queue = 0;
        this.handlers = [];
      }

      AnimationsManager.prototype.setSettings = function(stateName, animationsSettings) {
        this.settings[stateName] = animationsSettings;
        this.listeners[stateName] = new Listener;
        return this.queue = Object.keys(this.settings).length;
      };

      AnimationsManager.prototype.run = function() {
        var handlerToRun, i, len, ref;
        if (this.ready >= 0) {
          this.ready++;
        } else {
          this.ready = 1;
        }
        if (this.ready === this.queue) {
          ref = this.handlers;
          for (i = 0, len = ref.length; i < len; i++) {
            handlerToRun = ref[i];
            handlerToRun();
          }
          this.ready = 0;
          return this.handlers.length = 0;
        }
      };

      AnimationsManager.prototype.onready = function(action, name, managerCallbacks, animationCallback) {
        var afterEndHandler, afterStartHandler, currentListener, option, parent, parentIndex, parentListener;
        option = this.settings[name][action];
        currentListener = this.listeners[name];
        afterEndHandler = managerCallbacks.afterEnd;
        afterStartHandler = managerCallbacks.afterStart;
        parentIndex = name.lastIndexOf(">");
        if (parentIndex !== -1) {
          parent = name.slice(0, parentIndex);
          parentListener = this.listeners[parent];
          switch (option) {
            case "free":
              parentListener.add("afterStart", (function(_this) {
                return function() {
                  animationCallback(function() {
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
                  animationCallback(function() {
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
          switch (option) {
            case "free":
              this.handlers.push((function(_this) {
                return function() {
                  animationCallback(function() {
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
              this.handlers.push((function(_this) {
                return function() {
                  animationCallback(function() {
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
              this.handlers.push((function(_this) {
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
        var currentListener, name, parent, parentIndex, parentListener;
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
          this.handlers.push((function(_this) {
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
      function AnimationsHandler(animations) {
        this.animations = animations != null ? animations : {};
      }

      AnimationsHandler.prototype.setAnimations = function(stateName, stateAnimations) {
        return this.animations[stateName] = stateAnimations;
      };

      AnimationsHandler.prototype["do"] = function(routeName, animationName, view, callback) {
        var currentAnimation;
        try {
          currentAnimation = this.animations[routeName][animationName];
          return currentAnimation(view, function() {
            return callback();
          });
        } catch (_error) {
          return callback();
        }
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

      function RouterCoordinator(config) {
        this.config = config != null ? config : {};
      }

      RouterCoordinator.prototype.setCoorginate = function(stateName) {
        return this.config[stateName] = "unused";
      };

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
      function PriorityHandler(prioritiesMap) {
        this.prioritiesMap = prioritiesMap != null ? prioritiesMap : {};
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

      PriorityHandler.prototype.setPriority = function(stateName, statePriority) {
        return this.prioritiesMap[stateName] = statePriority ? statePriority : "00";
      };

      PriorityHandler.prototype.animationName = function(routes, routeName, routeParam) {
        var currentHorisontalPriority, currentVerticalPriority, pairRoute, previriousHorisontalPriority, previriousVerticalPriority;
        pairRoute = this.findPair(routes, routeName, routeParam);
        previriousVerticalPriority = this.prioritiesMap[routeName][0];
        previriousHorisontalPriority = this.prioritiesMap[routeName][1];
        currentVerticalPriority = this.prioritiesMap[pairRoute][0];
        currentHorisontalPriority = this.prioritiesMap[pairRoute][1];
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
            } else if (previriousHorisontalPriority === currentHorisontalPriority) {
              return "last";
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
            } else if (previriousHorisontalPriority === currentHorisontalPriority) {
              return "first";
            }
          }
        }
      };


      /*
      
        Код для формировнаия множественного урла
      
        Посмотреть на событие DOMSubtreeModified и постаратся автоматизировать бинды на ссылка
       */

      return PriorityHandler;

    })();

    function Router(viewsConfig, animationsConfig, methodsConfig) {
      this.statesMethods = {};
      this.states = {};
      this.loadManager = new LoadManager;
      this.animationsManager = new AnimationsManager;
      this.animationsHandler = new AnimationsHandler;
      this.routerCoordinator = new RouterCoordinator;
      this.priorityHandler = new PriorityHandler;
    }

    Router.prototype.start = function() {
      return window.dispatchEvent(new HashChangeEvent("hashchange"));
    };

    Router.prototype.setMethods = function(methodsConfig) {
      var methodHanlder, methodName, results;
      results = [];
      for (methodName in methodsConfig) {
        methodHanlder = methodsConfig[methodName];
        results.push(this.statesMethods[methodName] = methodHanlder);
      }
      return results;
    };

    Router.prototype.setViews = function(viewsConfig) {
      var fn, viewName, viewSettings;
      fn = (function(_this) {
        return function(viewSettings) {
          _this.states[viewName] = new State({
            url: viewSettings.url,
            load: viewSettings.load ? viewSettings.load : _this.statesMethods.load ? _this.statesMethods.load : void 0,
            initialize: viewSettings.initialize ? viewSettings.initialize : _this.statesMethods.initialize ? _this.statesMethods.initialize : void 0,
            insert: viewSettings.insert ? viewSettings.insert : _this.statesMethods.insert ? _this.statesMethods.insert : void 0,
            update: viewSettings.update ? viewSettings.update : _this.statesMethods.update ? _this.statesMethods.update : void 0,
            remove: viewSettings.remove ? viewSettings.remove : _this.statesMethods.remove ? _this.statesMethods.remove : void 0,
            beforeInitialize: _this.statesMethods.beforeInitialize && viewSettings.beforeInitialize ? function() {
              _this.statesMethods.beforeInitialize();
              return viewSettings.beforeInitialize();
            } : _this.statesMethods.beforeInitialize ? function() {
              return _this.statesMethods.beforeInitialize();
            } : viewSettings.beforeInitialize ? function() {
              return viewSettings.beforeInitialize();
            } : void 0,
            afterInitialize: _this.statesMethods.afterInitialize && viewSettings.afterInitialize ? function() {
              _this.statesMethods.afterInitialize();
              return viewSettings.afterInitialize();
            } : _this.statesMethods.afterInitialize ? function() {
              return _this.statesMethods.afterInitialize();
            } : viewSettings.afterInitialize ? function() {
              return viewSettings.afterInitialize();
            } : void 0,
            beforeHide: _this.statesMethods.beforeHide && viewSettings.beforeHide ? function() {
              _this.statesMethods.beforeHide();
              return viewSettings.beforeHide();
            } : _this.statesMethods.beforeHide ? function() {
              return _this.statesMethods.beforeHide();
            } : viewSettings.beforeHide ? function() {
              return viewSettings.beforeHide();
            } : void 0,
            afterHide: _this.statesMethods.afterHide && viewSettings.afterHide ? function() {
              _this.statesMethods.afterHide();
              return viewSettings.afterHide();
            } : _this.statesMethods.afterHide ? function() {
              return _this.statesMethods.afterHide();
            } : viewSettings.afterHide ? function() {
              return viewSettings.afterHide();
            } : void 0
          });
          _this.loadManager.setListeners(viewName);
          _this.routerCoordinator.setCoorginate(viewName);
          return _this.priorityHandler.setPriority(viewName, viewSettings.priority);
        };
      })(this);
      for (viewName in viewsConfig) {
        viewSettings = viewsConfig[viewName];
        fn(viewSettings);
      }
      return this.stateNames = Object.keys(this.states);
    };

    Router.prototype.setAnimations = function(animationsConfig) {
      var animationConfig, i, len, results, stateName, statesList;
      results = [];
      for (i = 0, len = animationsConfig.length; i < len; i++) {
        animationConfig = animationsConfig[i];
        statesList = animationConfig.states;
        results.push((function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = statesList.length; j < len1; j++) {
            stateName = statesList[j];
            this.animationsHandler.setAnimations(stateName, animationConfig.animations);
            results1.push(this.animationsManager.setSettings(stateName, {
              show: animationConfig.show ? animationConfig.show : "free",
              swap: animationConfig.swap ? animationConfig.swap : "free",
              hide: animationConfig.hide ? animationConfig.hide : "free"
            }));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Router.prototype.setRoutes = function(routesConfig, doubleHashs) {
      this.doubleHashs = doubleHashs;
      return window.addEventListener("hashchange", (function(_this) {
        return function(event) {
          var currentHash, currentHashMulti, currentHashRoute, i, len, routeConfig, routeName, routeParams, routeStates, statesToRun;
          currentHash = location.hash;
          currentHashMulti = currentHash.split("|");
          statesToRun = {};
          for (i = 0, len = currentHashMulti.length; i < len; i++) {
            currentHashRoute = currentHashMulti[i];
            for (routeName in routesConfig) {
              routeConfig = routesConfig[routeName];
              if (currentHashRoute === routeName) {
                routeStates = routesConfig[routeName]();
                for (routeName in routeStates) {
                  routeParams = routeStates[routeName];
                  statesToRun[routeName] = routeParams;
                }
              }
            }
          }
          return _this.run(statesToRun);
        };
      })(this));
    };

    Router.prototype.go = function(newHash) {
      var beUpdated, containIndex, currentHash, currentHashMulti, currentHashRoute, currentHashRoutes, currentNestedMake, currentNestedRoot, currentNestedRoute, hashMultiIndex, hashRouteIndex, i, indexToReplace, isContain, isMultiple, j, k, len, len1, len2, makeIsEqual, newHashRoute, newHashRoutes, newNestedMake, newNestedRoot, newNestedRoute, resultHash, resultHashMulti;
      currentHash = location.hash;
      resultHash = "";
      isMultiple = currentHash.indexOf("|") !== -1;
      if (isMultiple) {
        currentHashMulti = currentHash.split("|");
        resultHashMulti = currentHash.split("|");
        containIndex = currentHashMulti.indexOf(newHash);
        isContain = containIndex !== -1;
        if (isContain) {
          resultHashMulti.splice(containIndex, 1);
          resultHash = resultHashMulti.join("|");
          location.hash = resultHash;
          return;
        }
        newHashRoutes = newHash.split("/");
        makeIsEqual = false;
        indexToReplace = null;
        for (hashMultiIndex = i = 0, len = currentHashMulti.length; i < len; hashMultiIndex = ++i) {
          currentHashRoute = currentHashMulti[hashMultiIndex];
          currentHashRoutes = currentHashRoute.split("/");
          for (hashRouteIndex = j = 0, len1 = currentHashRoutes.length; j < len1; hashRouteIndex = ++j) {
            currentHashRoute = currentHashRoutes[hashRouteIndex];
            currentNestedRoute = currentHashRoutes.slice(0, hashRouteIndex + 1).join("/");
            newHashRoute = newHashRoutes[hashRouteIndex];
            newNestedRoute = newHashRoutes.slice(0, hashRouteIndex + 1).join("/");
            if (currentHashRoute && newHashRoute && currentNestedRoot === newNestedRoot) {
              currentNestedRoot = currentHashRoutes.slice(0, hashRouteIndex).join("/");
              newNestedRoot = newHashRoutes.slice(0, hashRouteIndex).join("/");
              if (currentHashRoute !== newHashRoute) {
                newNestedMake = (function() {
                  try {
                    return this.doubleHashs[newNestedRoute];
                  } catch (_error) {}
                }).call(this);
                currentNestedMake = (function() {
                  try {
                    return this.doubleHashs[currentNestedRoute];
                  } catch (_error) {}
                }).call(this);
                if (currentNestedMake !== newNestedMake && !makeIsEqual) {
                  makeIsEqual = false;
                } else if (currentNestedMake === newNestedMake) {
                  makeIsEqual = true;
                  indexToReplace = hashMultiIndex;
                }
              }
            } else if (!currentHashRoute && newHashRoute) {
              resultHashMulti[hashMultiIndex] = newHash;
              resultHash = resultHashMulti.join("|");
              location.hash = resultHash;
              return;
            } else if (currentHashRoute && !newHashRoute) {
              resultHash = newHash;
              location.hash = resultHash;
              return;
            }
          }
        }
        if (!makeIsEqual) {
          resultHash = currentHash + "|" + newHash;
          return location.hash = resultHash;
        } else {
          resultHashMulti[indexToReplace] = newHash;
          resultHash = resultHashMulti.join("|");
          return location.hash = resultHash;
        }
      } else {
        currentHashRoutes = currentHash.split("/");
        newHashRoutes = newHash.split("/");
        currentNestedRoute = "";
        newNestedRoute = "";
        beUpdated = false;
        for (hashRouteIndex = k = 0, len2 = currentHashRoutes.length; k < len2; hashRouteIndex = ++k) {
          currentHashRoute = currentHashRoutes[hashRouteIndex];
          currentNestedRoute = currentHashRoutes.slice(0, hashRouteIndex + 1).join("/");
          newHashRoute = newHashRoutes[hashRouteIndex];
          newNestedRoute = newHashRoutes.slice(0, hashRouteIndex + 1).join("/");
          if (currentHashRoute && newHashRoute && currentHashRoute !== newHashRoute) {
            currentNestedRoot = currentHashRoutes.slice(0, hashRouteIndex).join("/");
            newNestedRoot = newHashRoutes.slice(0, hashRouteIndex).join("/");
            if (currentNestedRoot === newNestedRoot) {
              currentNestedMake = (function() {
                try {
                  return this.doubleHashs[currentNestedRoute];
                } catch (_error) {}
              }).call(this);
              newNestedMake = (function() {
                try {
                  return this.doubleHashs[newNestedRoute];
                } catch (_error) {}
              }).call(this);
              if (currentNestedMake !== newNestedMake) {
                resultHash = currentHash + "|" + newHash;
                location.hash = resultHash;
                return;
              } else if (currentNestedMake === newNestedMake) {
                resultHash = newHash;
                location.hash = resultHash;
                return;
              }
              beUpdated = true;
            }
          }
        }
        if (!beUpdated) {
          resultHash = newHash;
          return location.hash = resultHash;
        }
      }
    };

    Router.prototype.run = function(requiredStates) {
      var count, i, len, ref, results, routeName, stateCoordinates;
      stateCoordinates = this.routerCoordinator.update(requiredStates);
      ref = this.stateNames;
      results = [];
      for (count = i = 0, len = ref.length; i < len; count = ++i) {
        routeName = ref[count];
        results.push((function(_this) {
          return function(routeName, currentState, routeCoordinate) {
            var animationName, currentStateSelector;
            currentStateSelector = _getSelector(routeName);
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
                        if (_getType(currentState.beforeInitialize) === "Function") {
                          currentState.beforeInitialize();
                        }
                        return _this.animationsHandler["do"](routeName, "first", view, function() {
                          if (_getType(currentState.afterInitialize) === "Function") {
                            currentState.afterInitialize();
                          }
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
                        if (_getType(currentState.beforeInitialize) === "Function") {
                          currentState.beforeInitialize();
                        }
                        return _this.animationsHandler["do"](routeName, "first", view, function() {
                          if (_getType(currentState.afterInitialize) === "Function") {
                            currentState.afterInitialize();
                          }
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
                        if (_getType(currentState.beforeInitialize) === "Function") {
                          currentState.beforeInitialize();
                        }
                        return _this.animationsHandler["do"](routeName, animationName, view, function() {
                          if (_getType(currentState.afterInitialize) === "Function") {
                            currentState.afterInitialize();
                          }
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
                        if (_getType(currentState.beforeInitialize) === "Function") {
                          currentState.beforeInitialize();
                        }
                        return _this.animationsHandler["do"](routeName, animationName, view, function() {
                          if (_getType(currentState.afterInitialize) === "Function") {
                            currentState.afterInitialize();
                          }
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
                      if (_getType(currentState.beforeHide) === "Function") {
                        currentState.beforeHide();
                      }
                      return _this.animationsHandler["do"](routeName, "last", view, function() {
                        if (_getType(currentState.afterHide) === "Function") {
                          currentState.afterHide();
                        }
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
                      if (_getType(currentState.beforeHide) === "Function") {
                        currentState.beforeHide();
                      }
                      return _this.animationsHandler["do"](routeName, animationName, view, function() {
                        if (_getType(currentState.afterHide) === "Function") {
                          currentState.afterHide();
                        }
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
        })(this)(routeName, this.states[routeName], stateCoordinates[routeName]));
      }
      return results;
    };

    return Router;

  })());

}).call(this);
