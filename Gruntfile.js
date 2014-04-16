'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // vars for folders
    config: {
      src: 'src',
      dist: 'dist'
    },

    // Sass to CSS via libSass
    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'nested'
        },
        files: {
          '<%= config.dist %>/assets/css/app.css': '<%= config.src %>/scss/app.scss'
        }
      }
    },

    // automagically append vendor prefixes in CSS
    autoprefixer: {
      single_file: {
        options: {
          browsers: ['last 2 version', 'ie 8', 'ie 7']
        },
        src: '<%= config.dist %>/assets/css/app.css',
        dest: '<%= config.dist %>/assets/css/app.css'
      },
    },
    
    // concatenating JS
    concat: {
      app: {
        src: [
          '<%= config.src %>/js/app.js'
        ],
        dest: '<%= config.dist %>/assets/js/app.js'
      }
    },

    // JS minify
    uglify: {
      app: {
        src: '<%= config.dist %>/assets/js/app.js',
        dest: '<%= config.dist %>/assets/js/app.min.js'
      }
    },

    // gather all CSS media queries
    cmq: {
      options: {
        log: false
      },
      your_target: {
        files: {
          '<%= config.dist %>/assets/css/cmq': ['<%= config.dist %>/assets/css/app.css']
        }
      }
    },

    // minify CSS
    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= config.dist %>/assets/css/cmq/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= config.dist %>/assets/css/',
        ext: '.min.css'
      }
    },


    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
        tasks: ['assemble']
      },
      sass: {
        files: '<%= config.src %>/scss/{,*/}*.scss',
        tasks: ['sass', 'autoprefixer']
      },
      concat: {
      files: '<%= config.src %>/js/{,*/}*.js',
        tasks: ['concat']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: false,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= config.dist %>/assets',
          layout: '<%= config.src %>/templates/layouts/default.hbs',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/templates/partials/*.hbs'
        },
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= config.dist %>/**/*.{html,xml}']

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('server', [
    'clean',
    'newer:assemble',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'assemble',
    'uglify',
    'cmq',
    'cssmin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
