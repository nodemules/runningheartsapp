{
  module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      commands: {
        clear: {
          cmd: [
            'rm -rf src/',
            'rm -rf public/dist'
          ]
        },
        bower_install: {
          cmd: [
            'bower prune',
            'bower install'
          ]
        },
        npm_install: {
          cmd: [
            'npm prune',
            'npm install'
          ]
        },
        start_prod: {
          cmd: [
            'pm2 startOrRestart ecosystem.config.js --env production'
          ]
        },
        git_prod: {
          cmd: [
            'git checkout .',
            'git clean -d -f',
            'git checkout master',
            'git pull'
          ]
        }
      },
      copy: {
        fonts: {
          cwd: 'public/',
          src: ['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.otf', '!dist/**'],
          dest: 'public/dist/fonts/',
          expand: true,
          flatten: true
        }
      },
      concat: {
        build: {
          src: ['public/javascripts/**/*.js'],
          dest: 'src/<%= pkg.name %>.es6'
        },
        css: {
          src: ['public/stylesheets/**/*.css'],
          dest: 'src/<%= pkg.name %>.css'
        }
      },
      bower_concat: {
        build: {
          dest: {
            js: 'src/vendor.js',
            css: 'src/vendor.css'
          },
          dependencies: {
            'angular': 'jquery',
            'angular-material': 'angular'
          }
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
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'public/dist/js/<%= pkg.name %>.min.js'
        },
        vendor: {
          src: 'src/vendor.js',
          dest: 'public/dist/js/vendor.min.js'
        }
      },
      cssmin: {
        build: {
          files: {
            'public/dist/css/<%= pkg.name %>.min.css': ['src/<%= pkg.name %>.css']
          }
        },
        vendor: {
          files: {
            'public/dist/css/vendor.min.css': ['src/vendor.css']
          }
        }
      },
      nodemon: {
        dev: {
          script: 'server.js',
          options: {
            ignore: ['src', 'public/javascripts', 'Gruntfile.js']
          }
        }
      },
      watch: {
        build: {
          files: ['public/javascripts/**/*.js'],
          tasks: ['concat:build', 'browserify:dist', 'uglify:build']
        },
        css: {
          files: ['public/stylesheets/**/*.css'],
          tasks: ['concat:css', 'cssmin:build']
        },
        fonts: {
          cwd: 'public/',
          files: ['!dist/**', '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.otf'],
          tasks: ['copy:fonts']
        },
        vendor: {
          files: ['public/bower_components/**/*.js', 'public/bower_components/**/*.css', 'bower.json'],
          tasks: ['bower_concat:build', 'uglify:vendor', 'cssmin:vendor']
        }
      },
      concurrent: {
        dev: ['nodemon:dev', 'watch:build', 'watch:css', 'watch:vendor', 'watch:fonts'],
        concat: ['concat:build', 'concat:css', 'bower_concat:build'],
        minify: ['uglify:build', 'uglify:vendor', 'cssmin:build', 'cssmin:vendor'],
        options: {
          logConcurrentOutput: true
        }
      }
    });

    grunt.loadNpmTasks('grunt-commands');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');


    // Default task(s).
    grunt.registerTask('develop', ['commands:clear', 'commands:bower_install', 'commands:npm_install', 'copy:fonts',
      'concurrent:concat', 'browserify:dist', 'concurrent:minify', 'concurrent:dev'
    ]);

    grunt.registerTask('production', ['commands:clear', 'commands:git_prod', 'commands:bower_install', 'commands:npm_install', 'copy:fonts',
      'concurrent:concat', 'browserify:dist', 'concurrent:minify', 'commands:start_prod'
    ]);

    grunt.registerTask('build', ['commands:clear', 'commands:bower_install', 'commands:npm_install', 'copy:fonts',
      'concurrent:concat', 'browserify:dist', 'concurrent:minify'
    ]);

  };
}
