###

  Код для формировнаия множественного урла

  Посмотреть на событие DOMSubtreeModified и постаратся автоматизировать бинды на ссылка

###

class MultipleRouter

  constructor: (@config) ->

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
              newNestedMake = try @config[newNestedRoute].make
              currentNestedMake = try @config[currentNestedRoute].make
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
            currentNestedMake = try @config[currentNestedRoute].make
            newNestedMake = try @config[newNestedRoute].make
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