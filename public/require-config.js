(function() {
  require.config({
    paths: {
      text: "lib/text",
      application: "../application"
    },
    shim: {
      "lib/backbone-min": ["lib/jquery-2.1.3.min.js", "lib/underscore-min.js"],
      "application-config": ["lib/backbone-min", "lib/TweenMax.min.js", "src/router"],
      "application": ["lib/backbone-min", "lib/TweenMax.min.js", "src/router", "application-config"]
    }
  });

  require(["application"]);

}).call(this);
