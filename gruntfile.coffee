module.exports = (grunt) ->

  grunt.loadNpmTasks "grunt-contrib-sass"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-express-server"
  grunt.loadNpmTasks "grunt-shell-spawn"

  grunt.config.init

    watch:

      express:
        files:  [ "server.coffee", "controller/**/*.coffee" ]
        tasks:  [ "express:dev" ]
        options:
          spawn: off
          debounceDelay: 0
          interval: 0
          atBegin: on
          livereload: on
          interrupt: on

      style:
        files: [ "public/**/*.sass" ]
        tasks: [ "sass:compile" ]
        options:
          spawn: off
          debounceDelay: 0
          interval: 0
          atBegin: on
          livereload: on
          interrupt: on

      script:
        files: [ "controller/**/*.coffee", "public/**/*.coffee", "!gruntfile.coffee" ]
        tasks: [ "coffee:compile" ]
        options:
          spawn: off
          debounceDelay: 0
          interval: 0
          atBegin: on
          livereload: on
          interrupt: on

    express:
      dev:
        options:
          script: "server.coffee"
          opts: [ "node_modules/coffee-script/bin/coffee" ]

    coffee:
      compile:
        files: [
          expand: on
          cwd: "./"
          src: [ "controller/**/*.coffee", "public/**/*.coffee", "!gruntfile.coffee" ]
          dest: "./"
          ext: ".js"
        ]

    sass:
      compile:
        options:
          sourcemap: "none"
        files: [
          expand: on
          cwd: "./"
          src: [ "public/**/*.sass" ]
          dest: "./"
          ext: ".css"
        ]

    shell:
      mongodb:
        command: "mongod --dbpath db"
        options:
          async: on
          stdout: off
          stderr: on
          failOnError: on
          execOptions:
            cwd: "."

  grunt.task.run "shell:mongodb"