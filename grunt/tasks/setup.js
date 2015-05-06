var exec = require("child_process").exec;

module.exports = function(grunt) {

  var repositories = [
    'basic-web-components',
    'basic-element',
    'basic-autosize-textarea'
  ];

  grunt.initConfig({
    shell: {
      'git-clone': {
        command: function(repo) {
          return 'git clone git@github.com:basic-web-components/' + repo + '.git';
        },

        options: {
          execOptions: {
            cwd: 'repos'
          }
        }
      },

      'git-pull': {
        command: function(repo) {
          return 'git pull';
        }
      },

      'change-dir': {
        command: function(dir) {
          return 'cd ' + dir;
        }
      }
    }
  });

  grunt.registerTask('create-repos-dir', function() {
    if (grunt.file.exists('repos')) {
      return;
    }

    grunt.file.mkdir('repos');
  });

  grunt.registerTask('clone-repos', function() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      if (!grunt.file.exists('repos/' + repo)) {
        grunt.task.run(['shell:git-clone:' + repo]);
      }
    }
  });

  grunt.registerTask('update-repos', function() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      grunt.task.run(['shell:change-dir:repos/' + repo, 'shell:git-pull', 'shell:change-dir:../..']);
    }
  });

  grunt.registerTask('setup', function() {
    grunt.task.run(['create-repos-dir', 'clone-repos', 'update-repos']);
  })

};