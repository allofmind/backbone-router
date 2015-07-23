define ->

  first: (instance, done) ->

    params =
      opacity: 0

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 1

    animate.play()

  last: (instance, done) ->

    params =
      opacity: 1

    animate = new TimelineMax
      paused: on
      onUpdate: ->
        instance.$el.css
          opacity: params.opacity
      onComplete: ->
        done()

    animate.to params, 0.6,
      opacity: 0

    animate.play()