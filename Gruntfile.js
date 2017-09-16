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
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
        },
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'public/dist/<%= pkg.name %>.min.js'
        }
      },
      nodemon: {
        dev: {
          script: 'server.js',
          options: {
            ignore: ['src', 'public/javascripts']
          }
        }
      },
      watch: {
        files: ['public/javascripts/**/*.js'],
        tasks: ['concat:build', 'browserify:dist', 'uglify:build']
      },
      concurrent: {
        dev: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('develop', ['concat:build', 'browserify:dist', 'uglify:build', 'concurrent:dev']);

  };
}
