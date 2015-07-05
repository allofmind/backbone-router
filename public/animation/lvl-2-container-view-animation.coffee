define ->

  speed = 5

  first: (view, done) ->
    params =
      opacity: 0
      scaleX: 0
      scaleY: 0

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "scale(#{params.scaleX}, #{params.scaleY})"
      onComplete: ->
        done()

    animate.to params, 1 / speed,
      opacity: 1
      scaleX: 1
      scaleY: 1

    animate.play()

  topCenter: (view, done) ->
    params =
      opacity: 0
      translateY: -100

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateY(#{params.translateY}%)"
      onComplete: ->
        done()

    animate.to params, 1 / speed,
      opacity: 1
      translateY: 0

    animate.play()

  centerTop: (view, done) ->
    params =
      opacity: 1
      translateY: 0

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateY(#{params.translateY}%)"
      onComplete: ->
        done()

    animate.to params, 1 / speed,
      opacity: 0
      translateY: -100

    animate.play()

  bottomCenter: (view, done) ->
    params =
      opacity: 0
      translateY: 100

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateY(#{params.translateY}%)"
      onComplete: ->
        done()

    animate.to params, 1 / speed,
      opacity: 1
      translateY: 0

    animate.play()

  centerBottom: (view, done) ->
    params =
      opacity: 1
      translateY: 0

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateY(#{params.translateY}%)"
      onComplete: ->
        done()

    animate.to params, 1 / speed,
      opacity: 0
      translateY: 100

    animate.play()