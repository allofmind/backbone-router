(function() {
  define(function() {
    return {
      first: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          scaleX: 0,
          scaleY: 0
        };
        view.$el.css({
          opacity: params.opacity,
          transform: "scaleX(" + params.scaleX + ") scaleY(" + params.scaleY + ")"
        });
        animate = new TimelineMax({
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "scaleX(" + params.scaleX + ") scaleY(" + params.scaleY + ")"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 3, {
          ease: Power2.easeOut,
          opacity: 1,
          scaleX: 1,
          scaleY: 1
        });
        return animate.play();
      },
      last: function(view, done) {
        var animate, params;
        params = {
          opacity: 1,
          scaleX: 1,
          scaleY: 1
        };
        animate = new TimelineMax({
          onUpdate: function() {
            return view.$el.css({
              opacity: params.opacity,
              transform: "scaleX(" + params.scaleX + ") scaleY(" + params.scaleY + ")"
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 3, {
          opacity: 0,
          scaleX: 0,
          scaleY: 0
        });
        return animate.play();
      }
    };
  });

}).call(this);
