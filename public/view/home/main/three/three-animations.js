(function() {
  define(function() {
    return {
      first: function(instance, done) {
        var animate, params;
        params = {
          opacity: 0,
          scaleX: 1.3,
          scaleY: 1.3
        };
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return instance.$el.css({
              opacity: params.opacity,
              transform: "scaleX(" + params.scaleX + ") scaleY(" + params.scaleY + ")"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 0.6, {
          opacity: 1,
          scaleX: 1,
          scaleY: 1
        });
        return animate.play();
      },
      last: function(instance, done) {
        var animate, params;
        params = {
          opacity: 1,
          scaleX: 1,
          scaleY: 1
        };
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return instance.$el.css({
              opacity: params.opacity,
              transform: "scaleX(" + params.scaleX + ") scaleY(" + params.scaleY + ")"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 0.6, {
          opacity: 0,
          scaleX: 1.3,
          scaleY: 1.3
        });
        return animate.play();
      }
    };
  });

}).call(this);
