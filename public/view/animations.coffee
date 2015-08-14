define ->

  first: (view, done) ->

    params =
      opacity: 0
      scaleX: 0
      scaleY: 0

    view.$el.css
      opacity: params.opacity
      transform: "scaleX(#{params.scaleX}) scaleY(#{params.scaleY})"

    animate = new TimelineMax
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "scaleX(#{params.scaleX}) scaleY(#{params.scaleY})"
      onComplete: ->
        done()

    animate.to params, 3,
      ease: Power2.easeOut
      opacity: 1
      scaleX: 1
      scaleY: 1

    animate.play()

  last: (view, done) ->

    params =
      opacity: 1
      scaleX: 1
      scaleY: 1

    animate = new TimelineMax
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "scaleX(#{params.scaleX}) scaleY(#{params.scaleY})"
      onComplete: ->
        done()

    animate.to params, 3,
      opacity: 0
      scaleX: 0
      scaleY: 0

    animate.play()

  leftCenter: (view, done) ->

    params =
      opacity: 0
      translateX: -100

    view.$el.css
      opacity: params.opacity
      transform: "translateX(#{params.translateX}%)"

    animate = new TimelineMax
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 3,
      ease: Power2.easeOut
      opacity: 1
      translateX: 0

    animate.play()

  centerLeft: (view, done) ->

    params =
      opacity: 1
      translateX: 0

    view.$el.css
      opacity: params.opacity
      transform: "translateX(#{params.translateX}%)"

    animate = new TimelineMax
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 3,
      ease: Power2.easeOut
      opacity: 0
      translateX: -100

    animate.play()

  rightCenter: (view, done) ->

    params =
      opacity: 0
      translateX: 100

    view.$el.css
      opacity: params.opacity
      transform: "translateX(#{params.translateX}%)"

    animate = new TimelineMax
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 3,
      ease: Power2.easeOut
      opacity: 1
      translateX: 0

    animate.play()

  centerRight: (view, done) ->

    params =
      opacity: 1
      translateX: 0

    view.$el.css
      opacity: params.opacity
      transform: "translateX(#{params.translateX}%)"

    animate = new TimelineMax
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 3,
      ease: Power2.easeOut
      opacity: 0
      translateX: 100

    animate.play()