const {
  series,
  parallel,
  src,
  dest,
  watch
} = require('gulp')
const htmlClean = require('gulp-htmlclean'); // 压缩 html
const less = require('gulp-less'); // 将 less 转换为 css
var autoprefixer = require('gulp-autoprefixer'); // css 样式添加前缀
const cleanCss = require('gulp-clean-css'); // 压缩 css
const stripDebug = require('gulp-strip-debug'); // 去掉 js 中的调试语句
const uglify = require('gulp-uglify'); // 压缩 js
const imgMin = require('gulp-imagemin'); // 压缩图片
const connect = require('gulp-connect'); // 监听文件改动

// 保存当前环境是否为生产环境的 boolean 值
let isProMod = process.env.NODE_ENV === 'production';

// 保存输入地址和输出地址
const folder = {
  src: 'src/',
  dist: 'dist/'
}

// 创建处理 html 文件任务
const html = () => {

  // 拿到文件并监听修改
  let page = src(folder.src + 'html/*').pipe(connect.reload());

  // 执行压缩，并输出文件
  if (isProMod) page.pipe(htmlClean()).pipe(dest(folder.dist + 'html/'))

  // 直接打包输出的文件地址 ./dist/html/
  return page.pipe(dest(folder.dist + 'html/'))
}

// 创建处理 less 文件任务
const css = () => {

  // 拿到文件并监听修改、将less转换成css、给样式添加前缀
  let page = src(folder.src + 'less/*').pipe(connect.reload()).pipe(less()).pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions'] // autoprefixer 一定要有值，否则不会加前缀
  }))

  // 执行压缩，并输出文件
  if (isProMod) page.pipe(cleanCss()).pipe(dest(folder.dist + 'css/'));

  // 直接打包输出的文件地址 ./dist/css/
  return page.pipe(dest(folder.dist + 'css/'));
}

// 创建处理 js 文件任务
const js = () => {

  // 拿到文件并监听修改
  let page = src(folder.src + 'js/*').pipe(connect.reload());

  // 删除调试用的代码（debug等）、执行压缩，并输出文件
  if (isProMod) page.pipe(stripDebug()).pipe(uglify());

  // 直接打包输出的文件地址 ./dist/js/
  return page.pipe(dest(folder.dist + 'js/')); //输出地址./dist/js/
}

// 创建处理图片文件任务     拿到文件并监听修改、执行压缩、最后打包输出的文件地址 ./dist/images/
const image = () => src(folder.src + 'image/*').pipe(imgMin()).pipe(dest(folder.dist + 'image/'))

// 开启服务
const server = () => {
  return connect.server({
    port: '8080',
    livereload: true, //自动刷新
  });
}

watch([folder.src + 'html/*'], html);
watch([folder.src + 'less/*'], css);
watch([folder.src + 'js/*'], js);
watch([folder.src + 'image/*'], image);

exports.default = parallel(html, css, js, image, server)