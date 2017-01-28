module.exports = function(grunt) {

  grunt.initConfig({

    // JS TASKS

    //combine files
    //order seems to matter in these bower components and since some have random
    //sub folders like 'release' I am listing them out individually
    concat: {
      app: {
        src: ['public/javascripts/**/*.js', 'public/javascripts/*.js'],
        dest: 'dist/app.js'
      },
      vendor: {
        src: ['public/bower_components/angular/angular.min.js',
          'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
          'public/bower_components/angular-material/angular-material.min.js',
          'public/bower_components/angular-animate/angular-animate.js',
          'public/bower_components/angular-aria/angular-aria.min.js',
          'public/bower_components/angular-messages/angular-messages.min.js',
          'public/bower_components/angular-resource/angular-resource.min.js'
        ],
        dest: 'public/vendor.js'
      }
    },
    //turn back to es5
    babel: {
      options: {
        presets: ['es2015']
      },
      dist: {
        files: [{
          src: ['dist/app.js'],
          dest: 'dist/app.js'
        }]
      }
    },
    //minify
    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          'public/app.js': ['dist/app.js']
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      rhp: {
        files: {
          'dist/app.js': ['dist/app.js'],
        },
      }
    },

    // watch css and js files and process the above tasks
    watch: {
      js: {
        files: ['public/javascripts/**/*.js', 'public/javascripts/*.js'],
        tasks: ['concat', 'babel', 'uglify']
      }
    },

    // watch our node server for changes
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    // run watch and nodemon at the same time
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  //Main Grunt pipeline of tasks to run
  grunt.registerTask('default', ['concat', 'babel', 'ngAnnotate', 'uglify', 'concurrent']);

};
