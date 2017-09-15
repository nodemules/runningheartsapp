{
  module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        build: {
          src: ['public/javascripts/**/*.js'],
          dest: 'src/<%= pkg.name %>.es6'
        }
      },
      browserify: {
        dist: {
          files: {
            // destination for transpiled js : source js
            'src/<%= pkg.name %>.js': 'src/<%= pkg.name %>.es6'
          },
          options: {
            transform: [
              ['babelify', {
                presets: 'es2015'
              }]
            ],
            browserifyOptions: {
              debug: true
            }
          }
        }
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'public/dist/<%= pkg.name %>.min.js'
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('build', ['concat:build', 'browserify:dist', 'uglify:build']);

  };
}
