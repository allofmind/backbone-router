define ->

  first: (instance, done) ->

    params =
      opacity: 0
      scaleX: 1.3
      scaleY: 1.3

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
          transform: "scaleX(#{params.scaleX}) scaleY(#{params.scaleY})"
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 1
      scaleX: 1
      scaleY: 1

    animate.play()

  last: (instance, done) ->

    params =
      opacity: 1
      scaleX: 1
      scaleY: 1

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
          transform: "scaleX(#{params.scaleX}) scaleY(#{params.scaleY})"
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 0
      scaleX: 1.3
      scaleY: 1.3

    animate.play()

  leftCenter: (instance, done) ->

    params =
      opacity: 0
      translateX: -100

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 1
      translateX: 0

    animate.play()

  centerLeft: (instance, done) ->

    params =
      opacity: 1
      translateX: 0

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 0
      translateX: -100

    animate.play()

  rightCenter: (instance, done) ->

    params =
      opacity: 0
      translateX: 100

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 1
      translateX: 0

    animate.play()

  centerRight: (instance, done) ->

    params =
      opacity: 1
      translateX: 0

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 0
      translateX: 100

    animate.play()