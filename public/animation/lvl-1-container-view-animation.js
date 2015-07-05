(function() {
  define(function() {
    var speed;
    speed = 5;
    return {
      first: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          translateZ: -120
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateZ(" + params.translateZ + "px)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1.6 / speed, {
          opacity: 1,
          translateZ: -180
        });
        animate.to(params, 2 / speed, {
          delay: 0.5 / speed,
          ease: Sine.easeOut,
          translateZ: 0
        });
        return animate.play();
      },
      leftCenter: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          translateX: -100
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateX(" + params.translateX + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1.6 / speed, {
          opacity: 1,
          ease: Sine.easeOut,
          translateX: 0
        });
        return animate.play();
      },
      centerLeft: function(view, done) {
        var animate, params;
        params = {
          opacity: 1,
          translateX: 0
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateX(" + params.translateX + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1.6 / speed, {
          opacity: 0,
          ease: Sine.easeOut,
          translateX: -100
        });
        return animate.play();
      },
      rightCenter: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          translateX: 100
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateX(" + params.translateX + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1.6 / speed, {
          opacity: 1,
          ease: Sine.easeOut,
          translateX: 0
        });
        return animate.play();
      },
      centerRight: function(view, done) {
        var animate, params;
        params = {
          opacity: 1,
          translateX: 0
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateX(" + params.translateX + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1.6 / speed, {
          opacity: 0,
          ease: Sine.easeOut,
          translateX: 100
        });
        return animate.play();
      }
    };
  });

}).call(this);
