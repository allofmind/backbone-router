(function() {
  var hasProp = {}.hasOwnProperty;

  define(function() {

    /*
    
    Баги:
      1) Не исчезает вид если при настройках выключенного порядка;
      2) Если быстро менять виды то не появляется;
     */

    /*
    
    Модель роутинга:
     */
    var Router;
    return Router = (function() {

      /*
      
      2) На основе конфига создается классы с видами:
        1) Хранятся в общем объекте коллекции под уникальным именем;
       */
      var Animations, AnimationsManager, LoadManager, RouterController, RouterCoordinator, StatesCollection;

      StatesCollection = (function() {
        var View;

        View = (function() {
          function View(url, position, init, insert, update, remove) {
            this.url = url;
            this.position = position;
            this.init = init;
            this.insert = insert;
            this.update = update;
            this.remove = remove;
            this.instance = null;
            this.view = null;
          }

          View.prototype.get = function(callback) {
            if (this.instance) {
              return callback(this.instance);
            } else {
              return require([this.url], (function(_this) {
                return function(instance) {
                  return callback(_this.instance = instance);
                };
              })(this));
            }
          };

          return View;

        })();

        function StatesCollection(routerConfig) {
          var routeName, routeSettings;
          this.routes = {};
          for (routeName in routerConfig) {
            routeSettings = routerConfig[routeName];
            this.routes[routeName] = new View(routeSettings.url, routeSettings.position, routeSettings.init, routeSettings.insert, routeSettings.update, routeSettings.remove);
          }
        }

        StatesCollection.prototype.find = function(requiredStateName) {
          var ref, stateConfig, stateName;
          ref = this.routes;
          for (stateName in ref) {
            if (!hasProp.call(ref, stateName)) continue;
            stateConfig = ref[stateName];
            if (requiredStateName === stateName) {
              return stateConfig;
            }
          }
        };

        return StatesCollection;

      })();


      /*
      
      4) Выстраивается два объекта каллбеков с зависимостями:
        1) Зависимости при загрузке от родительского;
        2) Зависимости от анимации родительского;
       */

      LoadManager = (function() {
        var Observer, getParent;

        Observer = (function() {
          function Observer() {
            this.callbacks = [];
          }

          Observer.prototype.add = function(callback) {
            return this.callbacks.push(callback);
          };

          Observer.prototype.run = function() {
            var callback, i, len, ref;
            ref = this.callbacks;
            for (i = 0, len = ref.length; i < len; i++) {
              callback = ref[i];
              callback();
            }
            return this.callbacks.length = 0;
          };

          return Observer;

        })();

        getParent = function(routeName) {
          var parentIndex;
          parentIndex = routeName.lastIndexOf(">");
          if (parentIndex !== -1) {
            return routeName.slice(0, parentIndex);
          }
        };

        function LoadManager(config) {
          var name, params;
          this.status = {};
          this.observers = {};
          for (name in config) {
            params = config[name];
            this.observers[name] = new Observer;
          }
        }

        LoadManager.prototype.onready = function(routeName, callback) {
          var parent;
          parent = getParent(routeName);
          if (parent) {
            if (this.status[parent] === "loaded") {
              this.status[routeName] = "loaded";
              callback();
              return this.observers[routeName].run();
            } else {
              return this.observers[parent].add((function(_this) {
                return function() {
                  callback();
                  return _this.observers[routeName].run();
                };
              })(this));
            }
          } else {
            this.status[routeName] = "loaded";
            callback();
            return this.observers[routeName].run();
          }
        };

        return LoadManager;

      })();


      /*
      
      5) Анимационный движок:
        1) Хранит функции анимаций;
        2) Выполняет анимацию в зависимости от priority;
        3) Проверяет свойства alwaysRun и запускает анимации для дочерних;
        4) Проверяет свойство inOrder и проводит анимации в порядке;
       */

      Animations = (function() {
        function Animations(animations) {
          var animationConfig, animationName;
          this.animations = {};
          for (animationName in animations) {
            animationConfig = animations[animationName];
            this.animations[animationName] = animationConfig;
          }
        }

        Animations.prototype.go = function(selectorName, animationName, element, callback) {
          if (selectorName.indexOf(">") === -1 || selectorName.indexOf(">") !== -1 && this.animations[selectorName].alwaysRun) {
            if (this.animations[selectorName].animations[animationName]) {
              return this.animations[selectorName].animations[animationName](element, callback);
            } else {
              return callback();
            }
          } else {
            return callback();
          }
        };

        return Animations;

      })();


      /*
      
      1) Главный контролирующий загрузки и анимации объект:
        1) Берет объект каллбеков загрузки и пользуется им;
        2) Берет объект каллбеков анимаций и пользуется им;
       */

      AnimationsManager = (function() {
        var DoubleListener;

        DoubleListener = (function() {
          function DoubleListener() {
            this.preCallbacks = [];
            this.postCallbacks = [];
          }

          DoubleListener.prototype.pre = function(callback) {
            return this.preCallbacks.push(callback);
          };

          DoubleListener.prototype.post = function(callback) {
            return this.postCallbacks.push(callback);
          };

          DoubleListener.prototype.run = function(callback) {
            var i, len, preCallback, ref;
            callback((function(_this) {
              return function() {
                var i, len, postCallback, ref;
                ref = _this.postCallbacks;
                for (i = 0, len = ref.length; i < len; i++) {
                  postCallback = ref[i];
                  postCallback();
                }
                return _this.postCallbacks.length = 0;
              };
            })(this));
            ref = this.preCallbacks;
            for (i = 0, len = ref.length; i < len; i++) {
              preCallback = ref[i];
              preCallback();
            }
            return this.preCallbacks.length = 0;
          };

          return DoubleListener;

        })();

        function AnimationsManager(animationsSettings) {
          var animationName, animationSettings;
          this.settings = {};
          this.listeners = {};
          this.parents = [];
          for (animationName in animationsSettings) {
            animationSettings = animationsSettings[animationName];
            this.settings[animationName] = animationSettings;
            this.listeners[animationName] = new DoubleListener;
          }
        }

        AnimationsManager.prototype.onready = (function() {
          var count;
          count = 0;
          return function(routeName, callback) {
            var i, len, parent, parentIndex, ref, startCallback;
            parentIndex = routeName.lastIndexOf(">");
            if (parentIndex !== -1) {
              parent = routeName.slice(0, parentIndex);
            }
            if (parent) {
              if (this.settings[routeName].inOrder) {
                this.listeners[parent].post((function(_this) {
                  return function() {
                    return _this.listeners[routeName].run(callback);
                  };
                })(this));
              } else {
                this.listeners[parent].pre((function(_this) {
                  return function() {
                    return _this.listeners[routeName].run(callback);
                  };
                })(this));
              }
            } else {
              this.parents.push((function(_this) {
                return function() {
                  return _this.listeners[routeName].run(callback);
                };
              })(this));
            }
            if (++count === this.callbacksLength) {
              ref = this.parents;
              for (i = 0, len = ref.length; i < len; i++) {
                startCallback = ref[i];
                startCallback();
              }
              this.parents.length = 0;
              this.callbacksLength = 0;
              return count = 0;
            }
          };
        })();

        AnimationsManager.prototype.maxCalls = function(callbacksLength) {
          this.callbacksLength = callbacksLength;
        };

        return AnimationsManager;

      })();

      RouterController = (function() {
        var PriorityHandler;

        PriorityHandler = (function() {
          function PriorityHandler(priorities) {
            var priorityName, prioritySettings;
            this.priorityMap = {};
            for (priorityName in priorities) {
              prioritySettings = priorities[priorityName];
              this.priorityMap[priorityName] = prioritySettings.priority;
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

          PriorityHandler.prototype["return"] = function(routes, routeName, routeParam) {
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

        function RouterController(routesConfig, animationsConfig) {
          this.states = new StatesCollection(routesConfig);
          this.loadManager = new LoadManager(routesConfig);
          this.animations = new Animations(animationsConfig.animations);
          this.animationsQueueManager = new AnimationsManager(animationsConfig.animationsSettings);
          this.priorityHandler = new PriorityHandler(animationsConfig.priorities);
        }

        RouterController.prototype.run = function(routes, params) {
          var count, i, len, results, routeName, routerKeys;
          routerKeys = Object.keys(routes);
          this.animationsQueueManager.maxCalls(routerKeys.length);
          results = [];
          for (count = i = 0, len = routerKeys.length; i < len; count = ++i) {
            routeName = routerKeys[count];
            results.push((function(_this) {
              return function(routeName, routeParam, count) {
                var animationName, currentState;
                currentState = _this.states.find(routeName);
                switch (routeParam) {
                  case "first":
                    return currentState.get(function(instance) {
                      return _this.loadManager.onready(routeName, function() {
                        currentState.view = currentState.init(instance, params != null ? params[routeName] : void 0);
                        return _this.animationsQueueManager.onready(routeName, function(callback) {
                          _this.animations.go(routeName, "first", currentState.view, function() {
                            return callback();
                          });
                          return currentState.insert(currentState.view);
                        });
                      });
                    });
                  case "first cache":
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      _this.animations.go(routeName, "first", currentState.view, function() {
                        return callback();
                      });
                      return currentState.insert(currentState.view);
                    });
                  case "update":
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      _this.animations.go(routeName, "update", currentState.view, function() {
                        return callback();
                      });
                      return currentState.update(currentState.view, params != null ? params[routeName] : void 0);
                    });
                  case "new":
                    animationName = _this.priorityHandler["return"](routes, routeName, "new");
                    return currentState.get(function(instance) {
                      return _this.loadManager.onready(routeName, function() {
                        currentState.view = currentState.init(instance, params != null ? params[routeName] : void 0);
                        return _this.animationsQueueManager.onready(routeName, function(callback) {
                          _this.animations.go(routeName, animationName, currentState.view, function() {
                            return callback();
                          });
                          return currentState.insert(currentState.view);
                        });
                      });
                    });
                  case "new cache":
                    animationName = _this.priorityHandler["return"](routes, routeName, "new cache");
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      _this.animations.go(routeName, animationName, currentState.view, function() {
                        return callback();
                      });
                      return currentState.insert(currentState.view);
                    });
                  case "last":
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      return _this.animations.go(routeName, "last", currentState.view, function() {
                        currentState.remove(currentState.view);
                        return callback();
                      });
                    });
                  case "old":
                    animationName = _this.priorityHandler["return"](routes, routeName, "old");
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      return _this.animations.go(routeName, animationName, currentState.view, function() {
                        currentState.remove(currentState.view);
                        return callback();
                      });
                    });
                  case "visible":
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      return callback();
                    });
                  default:
                    return _this.animationsQueueManager.onready(routeName, function(callback) {
                      return callback();
                    });
                }
              };
            })(this)(routeName, routes[routeName], count));
          }
          return results;
        };

        return RouterController;

      })();


      /*
      
      3) Объект предоставляющий текущее состояние роутера:
        1) Хранит и обновляет текущее состояние роутера;
       */

      RouterCoordinator = (function() {

        /*
          
          Мы можем узнать был ли на одном из селекторов ранее new или first или update или visible но на другом
         */
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
              if (cacheName === stateName && cacheValue === stateParamsJSON) {
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

        function RouterCoordinator(statesConfig) {
          var stateConfig, stateName;
          this.config = {};
          for (stateName in statesConfig) {
            stateConfig = statesConfig[stateName];
            this.config[stateName] = "unused";
          }
        }

        RouterCoordinator.prototype.update = function(requiredStates) {
          var configStateName, configStateValue, currentStateParam, isActive, isNew, isOld, isUpdate, ref, requiredStateName, requiredStateParams, results;
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
          results = [];
          for (configStateName in ref) {
            configStateValue = ref[configStateName];
            isActive = _isActive(requiredStates, configStateName);
            isOld = _isOld(this.config, configStateName);
            if (!isActive && !isOld && (configStateValue === "first" || configStateValue === "first cache" || configStateValue === "new" || configStateValue === "new cache" || configStateValue === "update" || configStateValue === "visible")) {
              results.push(this.config[configStateName] = "last");
            } else if (!isActive && isOld && (configStateValue === "first" || configStateValue === "first cache" || configStateValue === "new" || configStateValue === "new cache" || configStateValue === "update" || configStateValue === "visible")) {
              results.push(this.config[configStateName] = "old");
            } else if (configStateValue === "last" || configStateValue === "old") {
              results.push(this.config[configStateName] = "invisible");
            } else {
              results.push(void 0);
            }
          }
          return results;
        };

        return RouterCoordinator;

      })();

      function Router(statesConfig, animationsConfig) {
        this.routerController = new RouterController(statesConfig, animationsConfig);
        this.routerCoordinator = new RouterCoordinator(statesConfig);
      }

      Router.prototype.go = function(requiredStates) {
        this.routerCoordinator.update(requiredStates);
        return this.routerController.run(this.routerCoordinator.config, requiredStates);
      };

      return Router;

    })();
  });

}).call(this);
