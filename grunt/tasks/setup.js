var exec = require("child_process").exec;

var BWC_SRC_DIR = 'repos/basic-web-components/src';
var BWC_DEST_DIR = 'repos';
var dirtyRepos = [];
var currentRepo;

module.exports = function(grunt) {

  var repositories = [
    'basic-accessible-list',
    'basic-arrow-direction',
    'basic-aspect',
    'basic-autosize-textarea',
    'basic-carousel',
    'basic-carousel-fit',
    'basic-children-content',
    'basic-content-items',
    'basic-data-items',
    'basic-direction-selection',
    'basic-framed-content',
    'basic-item-selection',
    'basic-keyboard',
    'basic-keyboard-direction',
    'basic-keyboard-paging',
    'basic-keyboard-prefix-selection',
    'basic-selection-scroll',
    'basic-list-box',
    'basic-page-dots',
    'basic-selection-highlight',
    'basic-shared',
    'basic-sliding-viewport',
    'basic-sliding-viewport-fit',
    'basic-spread-fit',
    'basic-spread-items',
    'basic-stack',
    'basic-swipe-direction',
    'basic-tap-selection',
    'basic-timer-selection',
    'basic-trackpad-direction',
    'basic-web-components'
  ];

  var copyPathsForRepositories = [];

  function buildCopyPathsForRepositories() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      if (repo == 'basic-web-components') {
        continue;
      }

      copyPathsForRepositories.push(repo + "/**");
    }
  }
  buildCopyPathsForRepositories();

  var deletePathsForRepositories = [];

  function buildDeletePathsForRepositories() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      if (repo == 'basic-web-components') {
        continue;
      }

      // Delete everything under repos but the repo directory and its .git directory
      deletePathsForRepositories.push('repos/' + repo + '/*');
      deletePathsForRepositories.push('repos/' + repo + '/.gitignore');
      deletePathsForRepositories.push('!repos/' + repo)
      deletePathsForRepositories.push('!repos/' + repo + '/.git');
    }
  }
  buildDeletePathsForRepositories();

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

      'git-status': {
        command: function(repo) {
          currentRepo = repo;
          return 'git --git-dir=./repos/' + repo + '/.git --work-tree=./repos/' + repo + ' status --porcelain';
        },

        options: {
          callback: function(err, stdout, stderr, cb) {
            if (stdout && stdout.length > 0) {
              dirtyRepos.push(currentRepo);
            }
            currentRepo = null;
            cb();
          }
        }
      },

      'git-pull': {
        command: function(repo) {
          return 'git pull';
        }
      },

      'git-commit': {
        command: function(repo, comment) {
          var commandString = 'git --git-dir=./repos/' + repo + '/.git/ --work-tree=./repos/' + repo + '/ commit -a -m ' + comment;
          return commandString;
        }
      },

      'git-push': {
        command: function(repo) {
          var commandString = 'git --git-dir=./repos/' + repo + '/.git/ --work-tree=./repos/' + repo + '/ push';
          return commandString;
        }
      }
    },

    copy: {
      bwc: {
        expand: true,
        cwd: BWC_SRC_DIR,
        src: copyPathsForRepositories,
        dest: BWC_DEST_DIR
      }
    },

    replace: {
      bower_components: {
        src: ['repos/**/*.html', '!repos/basic-web-components/**'],
        overwrite: true,
        replacements: [{
          from: '../../bower_components',
          to: '..'
        }]
      }
    },

    clean: {
      bwc: deletePathsForRepositories,
      repos: ['repos']
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

  grunt.registerTask('fetch-status', function() {
    dirtyRepos = [];
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      grunt.task.run(['shell:git-status:' + repo]);
    }
  });

  grunt.registerTask('report-status', function() {
    if (!dirtyRepos || dirtyRepos.length == 0) {
      grunt.log.writeln('No components have been modified');
    }
    else {
      grunt.log.writeln('The following components have been modified:');
      for (var i = 0; i < dirtyRepos.length; i++) {
        grunt.log.writeln('-- ' + dirtyRepos[i]);
      }
    }
  });

  grunt.registerTask('push-changes-to-dirtyRepos', function(comment) {
    if (!dirtyRepos || dirtyRepos.length == 0) {
      grunt.log.writeln('There are no modified components to push');
    }
    else {
      for (var i = 0; i < dirtyRepos.length; i++) {
        // Commit and push
        var commitString = 'shell:git-commit:' + dirtyRepos[i] + ':\"' + comment + '\"';
        var pushString = 'shell:git-push:' + dirtyRepos[i];
        grunt.task.run([commitString, pushString]);
      }
    }
  });

  grunt.registerTask('push-changes', function(comment) {
    if (!comment) {
      grunt.log.writeln('Please provide a commit comment: grunt push-changes:\"Your comment in quotation marks\"');
      return;
    }

    grunt.task.run(['check-status', 'push-changes-to-dirtyRepos:' + comment]);
  });

  grunt.registerTask('setup', function() {
    grunt.task.run(['clean:repos', 'create-repos-dir', 'clone-repos']);
  });

  grunt.registerTask('update-components', function() {
    grunt.task.run(['clean:bwc', 'copy:bwc', 'replace:bower_components']);
  });

  grunt.registerTask('check-status', function() {
    grunt.task.run(['fetch-status', 'report-status']);
  });

  grunt.registerTask('default', function() {
    grunt.task.run(['setup', 'update-components', 'check-status']);
  });

};