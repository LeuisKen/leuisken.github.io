module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            includes: {
                src: '_includes/head.raw.html',
                dest: '_includes/head.html'
            }
        },
        useminPrepare: {
            html: '_includes/head.html',
            options: {
                root: '.',
                dest: '.tmp'
            }
        },
        filerev: {
            files: {
                src: ['<%= pkg.srcRoot %>/js/**/*.js', '.tmp/<%= pkg.dstRoot %>/style.css'],
                dest: '<%= pkg.dstRoot %>'
            }
        },
        usemin: {
            html: '_includes/head.html',
            options: {
                assetsDirs: ['.tmp']
            }
        },
        concat: {
            react_debug: {
                src: ['articles.raw/articles.md', 'articles.raw/debug.html'],
                dest: 'pages/1_articles.md'
            },
            react_release: {
                src: ['articles.raw/articles.md', 'articles.raw/release.html'],
                dest: 'pages/1_articles.md'
            }
        },
        shell: {
            jekyll_build: {
                command: 'jekyll build'
            },
            jekyll_serve: {
                command: 'jekyll serve --watch'
            },
            clean_tmp: {
                command: 'rm -r .tmp'
            },
            react_parse: {
                command: 'jsx pages/ build/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');

    grunt.task.registerTask('debug_test', 'A sample task that logs stuff.', function(arg1, arg2) {
        //console.log(grunt.config('cssmin.generated'));
        console.log(grunt.filerev.summary);
    });

    grunt.registerTask('build', [
        'copy:includes',
        'concat:react_debug',
        'shell:jekyll_build'
    ]);

    grunt.registerTask('debug', [
        'copy:includes',
        'concat:react_debug',
        'shell:jekyll_serve'
    ]);

    grunt.registerTask('release', [
        'copy:includes',
        'concat:react_release',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'filerev',
        'usemin',
        'shell:clean_tmp',
        'shell:react_parse',
        'shell:jekyll_build'
    ]);

    grunt.registerTask('serve', [
        'copy:includes',
        'concat:react_release',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'filerev',
        'usemin',
        'shell:clean_tmp',
        'shell:react_parse',
        'shell:jekyll_serve'
    ]);
};