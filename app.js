'use strict';
var path = require('path');
var dirname = require('./util').dirname;
var fs = require('fs');
var app = angular.module('StarterApp', ['ngMaterial']);
var bluebird = require('bluebird');
var xml2js = require('xml2js');
var _ = require('lodash');

const configFile = 'config.json';
bluebird.promisifyAll(path);
bluebird.promisifyAll(fs);
require('nw.gui').Window.get().showDevTools()

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {

  initApp();
  readConfig();

  function initApp() {

    $scope.appTitle = "MSN Chat log"
    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    window.ondragover = function(e) {
      e.preventDefault();
      return false
    };
    window.ondrop = function(e) {
      e.preventDefault();
      return false
    };

    var holder = document.getElementById('dragdrop');
    holder.ondragover = function() {
      this.className = 'hover';
      return false;
    };
    holder.ondragleave = function() {
      this.className = '';
      return false;
    };

    holder.ondrop = function(e) {
      e.preventDefault();

      for (var i = 0; i < e.dataTransfer.files.length; ++i) {
        fs.readFile(e.dataTransfer.files[i].path, 'utf8', function(err, data) {
          if (!err) {
            xml2js.parseString(data, function(err, result) {
              var events = result.Log.Message.concat(result.Log.Join).concat(result.Log.Leave);
              debugger;
            });
          }
        });
        $scope.$broadcast('folderDropped', e.dataTransfer.files[i].path);

      }
      return false;
    };
  }

  function readConfig() {
    fs.readFileAsync(configFile).then(function(data) {
      var config = JSON.parse(data);
      console.log('Config file found', config);
      $scope.config = config;
      $scope.$broadcast('configLoaded', config);
    }).catch(function(err) {
      if (err.code === 'ENOENT') {
        console.log('Config file not found, creating default.')
        fs.writeFile(configFile, JSON.stringify({
          tags: [{
            name: 'wallpaper'
          }, {
            name: 'art'
          }]
        }), function(err) {
          if (err) return console.log(err);
          readConfig();
        });
      }
    });
  }

  $scope.$on('configLoaded', function(event, config) {
    $scope.$apply(function() {
      $scope.tags = config.tags;
    });
  });


  fs.readdir('images', function(err, tabFiles) {
    if (!err) {
      $scope.$broadcast('filesLoaded', tabFiles);
    }
  });

  $scope.$on('filesLoaded', function(event, mass) {

  });


}]);