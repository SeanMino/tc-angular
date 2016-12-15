var fs = require('fs');
var child_process = require('child_process');
var os = require('os');
var path = require('path');
var utils = require('tc-utils');

for(var name in utils){
  global[name] = utils[name];

}

var argvs = process.argv;
var params = {};
argvs.slice(2).forEach(function(arg){
  if (arg.indexOf('-') !== 0) {
    params.path = arg;
  }
})

if (params.path) {
  createProject();
}

var appDist = 'app';

/**
 * 创建项目
 * @return {[type]} [description]
 */
function createProject(){
  var projectpath = params.path +'/'+appDist;

  mkdir(projectpath, '0755');
  var files = fs.readdirSync(projectpath);
  if (files.indexOf('app') > -1 ) {
    console.log('path `' + projectpath + '` has create angular project');
    return false;
  }
  mkpath(projectpath);
  copyFiles(projectpath);
  console.log('Application create finished');
  
}

/**
 * 创建项目目录
 * @param  {[type]} projectpath [description]
 * @return {[type]}             [description]
 */
function mkpath(projectpath){
  var paths = [
    '/styles',
    '/modules',
    '/image'
  ];
  paths.forEach(function(item){
    mkdir(projectpath + item, '0755');
  });
}

/**
 * 拷贝文件
 * @return {[type]} [description]
 */
function copyFiles(projectpath){
  var prefixPath = __dirname + '/tmp';
  var sourceFiles = [
    prefixPath + '/home/home.js',
    prefixPath + '/home/home.html',
    prefixPath + '/home/home.css',
    prefixPath + '/app.js',
    prefixPath + '/jshintrc',
    prefixPath + '/gulpfile.js',
    prefixPath + '/bower.json',
    prefixPath + '/index.html',
    prefixPath + '/package.json'
  ];
  var dstFiles = [
    '/modules/home/home.js',
    '/modules/home/home.html',
    '/styles/home.css',
    '/app.js',
    '/.jshintrc',
    '/gulpfile.js',
    '/bower.json',
    '/index.html',
    '/package.json'
  ];
  dstFiles.forEach(function(file, i) {
    file = projectpath + file;

    if (!isFile(file)) {
      console.log(path.dirname(file))
      mkdir(path.dirname(file), '0755');
      var buffer = fs.readFileSync(path.normalize(sourceFiles[i]));
      fs.writeFileSync(path.normalize(file), buffer);
    }
  });
}
