
/*

  Код для формировнаия множественного урла

  Посмотреть на событие DOMSubtreeModified и постаратся автоматизировать бинды на ссылка
 */

(function() {
  var MultipleRouter;

  MultipleRouter = (function() {
    function MultipleRouter(config) {
      this.config = config;
    }

    MultipleRouter.prototype.go = function(newHash) {
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
                    return this.config[newNestedRoute].make;
                  } catch (_error) {}
                }).call(this);
                currentNestedMake = (function() {
                  try {
                    return this.config[currentNestedRoute].make;
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
                  return this.config[currentNestedRoute].make;
                } catch (_error) {}
              }).call(this);
              newNestedMake = (function() {
                try {
                  return this.config[newNestedRoute].make;
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

    return MultipleRouter;

  })();

}).call(this);
