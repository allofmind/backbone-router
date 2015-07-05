define ->

  speed = 5

  first: (view, done) ->
    params =
      opacity: 0
      translateZ: -120

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateZ(#{params.translateZ}px)"
      onComplete: ->
        done()

    animate.to params, 1.6 / speed,
      opacity: 1
      translateZ: -180

    animate.to params, 2 / speed,
      delay: 0.5 / speed
      ease: Sine.easeOut
      translateZ: 0

    animate.play()

  leftCenter: (view, done) ->
    params =
      opacity: 0
      translateX: -100

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 1.6 / speed,
      opacity: 1
      ease: Sine.easeOut
      translateX: 0

    animate.play()

  centerLeft: (view, done) ->
    params =
      opacity: 1
      translateX: 0

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 1.6 / speed,
      opacity: 0
      ease: Sine.easeOut
      translateX: -100

    animate.play()

  rightCenter: (view, done) ->
    params =
      opacity: 0
      translateX: 100

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 1.6 / speed,
      opacity: 1
      ease: Sine.easeOut
      translateX: 0

    animate.play()

  centerRight: (view, done) ->
    params =
      opacity: 1
      translateX: 0

    view.$el.css opacity: params.opacity

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        view.$el.css
          opacity: params.opacity
          transform: "translateX(#{params.translateX}%)"
      onComplete: ->
        done()

    animate.to params, 1.6 / speed,
      opacity: 0
      ease: Sine.easeOut
      translateX: 100

    animate.play()

  # update: (view, done) ->
  #   params.skewX = 0 unless params.skewX
  #   params.skewY = 0 unless params.skewY
  #   params.opacity = 1 unless params.opacity

  #   animate = new TimelineMax
  #     paused: on
  #     onUpdate: ->
  #       view.$el.css
  #         opacity: params.opacity
  #         transform: "skewX(#{params.skewX}deg) skewY(#{params.skewY}deg)"
  #     onComplete: ->
  #       done()

  #   animate.to params, 0.6 / speed,
  #     opacity: 0.6
  #     skewX: 1
  #     skewY: 1

  #   animate.to params, 0.6 / speed,
  #     skewX: -1
  #     skewY: -1

  #   animate.to params, 0.6 / speed,
  #     opacity: 1
  #     skewX: 0
  #     skewY: 0

  #   animate.play()