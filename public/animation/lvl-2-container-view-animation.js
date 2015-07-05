(function() {
  define(function() {
    var speed;
    speed = 5;
    return {
      first: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          scaleX: 0,
          scaleY: 0
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "scale(" + params.scaleX + ", " + params.scaleY + ")"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1 / speed, {
          opacity: 1,
          scaleX: 1,
          scaleY: 1
        });
        return animate.play();
      },
      topCenter: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          translateY: -100
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateY(" + params.translateY + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1 / speed, {
          opacity: 1,
          translateY: 0
        });
        return animate.play();
      },
      centerTop: function(view, done) {
        var animate, params;
        params = {
          opacity: 1,
          translateY: 0
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateY(" + params.translateY + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1 / speed, {
          opacity: 0,
          translateY: -100
        });
        return animate.play();
      },
      bottomCenter: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          translateY: 100
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateY(" + params.translateY + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1 / speed, {
          opacity: 1,
          translateY: 0
        });
        return animate.play();
      },
      centerBottom: function(view, done) {
        var animate, params;
        params = {
          opacity: 1,
          translateY: 0
        };
        view.$el.css({
          opacity: params.opacity
        });
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "translateY(" + params.translateY + "%)"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 1 / speed, {
          opacity: 0,
          translateY: 100
        });
        return animate.play();
      }
    };
  });

}).call(this);
