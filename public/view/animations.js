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
      },
      leftCenter: function(view, done) {
        var animate, params;
        params = {
          opacity: 0,
          translateX: -100
        };
        view.$el.css({
          opacity: params.opacity,
          transform: "translateX(" + params.translateX + "%)"
        });
        animate = new TimelineMax({
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
        animate.to(params, 3, {
          ease: Power2.easeOut,
          opacity: 1,
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
          opacity: params.opacity,
          transform: "translateX(" + params.translateX + "%)"
        });
        animate = new TimelineMax({
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
        animate.to(params, 3, {
          ease: Power2.easeOut,
          opacity: 0,
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
          opacity: params.opacity,
          transform: "translateX(" + params.translateX + "%)"
        });
        animate = new TimelineMax({
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
        animate.to(params, 3, {
          ease: Power2.easeOut,
          opacity: 1,
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
          opacity: params.opacity,
          transform: "translateX(" + params.translateX + "%)"
        });
        animate = new TimelineMax({
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
        animate.to(params, 3, {
          ease: Power2.easeOut,
          opacity: 0,
          translateX: 100
        });
        return animate.play();
      }
    };
  });

}).call(this);
