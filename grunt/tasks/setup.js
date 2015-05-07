var exec = require("child_process").exec;

var BWC_SRC_DIR = 'repos/basic-web-components/src';
var BWC_DEST_DIR = 'repos';
var dirtyRepos = [];
var currentRepo;

module.exports = function(grunt) {

  var repositories = [
    'basic-web-components',
    'basic-autosize-textarea',
    'basic-carousel'/*,
    'basic-aspect',
    'basic-keyboard',
    'basic-keyboard-direction',
    'basic-trackpad-direction',
    'basic-swipe-direction',
    'basic-direction-selection',
    'basic-item-selection',
    'basic-accessible-list',
    'basic-content-items',
    'basic-children-content',
    'basic-sliding-viewport',
    'basic-spread-items'
    */
  ];

  var repositoriesCopyPaths = [];

  function buildRepositoriesCopyPaths() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      if (repo == 'basic-web-components') {
        continue;
      }

      repositoriesCopyPaths.push(repo + "/**");
    }
  }
  buildRepositoriesCopyPaths();

  var repositoriesDeletePaths = [];

  function buildRepositoriesDeletePaths() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      if (repo == 'basic-web-components') {
        continue;
      }

      // BUGBUG - Do we need to avoid deleting bower.json, README.md, preview.png?
      // Or should the consolidate repo have, under each component, everything that
      // component needs for deployment? If we include bower.json files within
      // the consolidated tree, does that interfere with a bower.json install
      // of the consolidated package?

      repositoriesDeletePaths.push('repos/' + repo + '/*');
      repositoriesDeletePaths.push('repos/' + repo + '/.gitignore');
      repositoriesDeletePaths.push('!repos/' + repo)
      repositoriesDeletePaths.push('!repos/' + repo + '/.git');
    }
  }
  buildRepositoriesDeletePaths();

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

      'change-dir': {
        command: function(dir) {
          return 'cd ' + dir;
        }
      }
    },

    copy: {
      bwc: {
        expand: true,
        cwd: BWC_SRC_DIR,
        src: repositoriesCopyPaths,
        dest: BWC_DEST_DIR
      }
    },

    clean: {
      bwc: repositoriesDeletePaths,
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

  grunt.registerTask('update-repos', function() {
    for (var i = 0; i < repositories.length; i++) {
      var repo = repositories[i];

      grunt.task.run(['shell:change-dir:repos/' + repo, 'shell:git-pull', 'shell:change-dir:../..']);
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

  grunt.registerTask('setup', function() {
    grunt.task.run(['clean:repos', 'create-repos-dir', 'clone-repos']);
  });

  grunt.registerTask('update-components', function() {
    grunt.task.run(['clean:bwc', 'copy:bwc']);
  });

  grunt.registerTask('check-status', function() {
    grunt.task.run(['fetch-status', 'report-status']);
  });

  grunt.registerTask('default', function() {
    grunt.task.run(['setup', 'update-components', 'check-status']);
  });

};