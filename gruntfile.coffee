module.exports = (grunt) ->
  require('load-grunt-config') grunt

  grunt.initConfig
    concat:
      js:
        src: [
          'src/js/app.js'
          'src/**/*.js'

          'dist/js/templates.js'
        ]
        dest: 'dist/js/script.js'
      css:
        src: [
          'src/blocks/**/*.css'
        ]
        dest: 'dist/css/style.css'

    watch:
      js:
        files: [
          'src/**/*.js'
          'src/**/*.html'
        ]
        tasks: ['js']
        options:
          nospawn: true

      css:
        files: [
          'src/**/*.css'
        ]
        tasks: ['css']
        options:
          nospawn: true

    ngtemplates:
      dataLab:
        cwd: 'src/blocks'
        src: '**/*.html'
        dest: 'dist/js/templates.js'
        options:
          module: 'dataLab'

    docco:
      readme:
        src: ['index.js']
        options:
          output: 'docs/'
          layout: 'linear'
      code:
        src: ['src/**/*.js']
        options:
          output: 'blocks/'

  grunt.registerTask 'default', ['js', 'css', 'docs']
  grunt.registerTask 'docs', ['docco:code', 'docco:readme']
  grunt.registerTask 'templates', ['ngtemplates:dataLab']
  grunt.registerTask 'js', ['templates', 'concat:js']
  grunt.registerTask 'css', ['concat:css']