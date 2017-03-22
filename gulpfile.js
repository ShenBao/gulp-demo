// require
var gulp = require('gulp'),

    htmlmin = require('gulp-htmlmin'),

    rev = require('gulp-rev-append'),//给页面引用url添加版本号，以清除页面缓存

    cssver = require('gulp-make-css-url-version'),//给css文件里引用url加版本号
    autoprefixer = require('gulp-autoprefixer'),//设置浏览器版本自动处理浏览器前缀
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),

    uglify = require('gulp-uglify'),

    imagemin = require('gulp-imagemin'),

    concat = require('gulp-concat'),//合并文件
    sourcemaps = require('gulp-sourcemaps'),//调试时sourcemaps
    livereload = require('gulp-livereload')//当监听文件发生变化时，浏览器自动刷新页面
    
    connect = require('gulp-connect'),
    webserver = require('gulp-webserver')
    ;

// =========================================================================HTML
// html
gulp.task('html', function () {
    gulp.src('src/html/*.html')
        .pipe(rev())//给页面引用url添加版本号，以清除页面缓存
        .pipe(gulp.dest('dist/html'));
});
// htmlMin
gulp.task('htmlMin', function () {
    var options = {
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/htmlMin'))
        .pipe(livereload());
});

// =============================================================================CSS
//css
gulp.task('css', function () {
    gulp.src('src/css/*.css')
        .pipe(cssver())//给css文件里引用文件加版本号（文件MD5）
        .pipe(gulp.dest('dist/css'));
});
//cssMin
gulp.task('cssMin', function () {
    var options = {
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        };
    var autoprefixeroptions = {
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }
    gulp.src('src/css/*.css')
        .pipe(cssver())//给css文件里引用文件加版本号 文件MD5
        .pipe(cssmin(options))
        .pipe(autoprefixer(autoprefixeroptions))
        .pipe(gulp.dest('dist/cssMin'));
});

// less
gulp.task('less', function () {
    gulp.src('src/css/**/*.less') 
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});
// lessMin
gulp.task('lessMin', function () {
    gulp.src('src/css/*') 
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/cssMin'));
});

// ================================================================================JS
// js
gulp.task('js', function () {
    gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'));
});
// jsmin
gulp.task('jsMin', function () {
    var option = {
            mangle: true,//类型：Boolean 默认：true 是否修改变量名     // mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        };
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/jsmin'));
});

// jsConcat
gulp.task('jsConcat', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/jsConcat'));
});

// ================================================================================IMG
// image
gulp.task('image', function () {
    gulp.src('src/img/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});
// imageMin
gulp.task('imageMin', function () {
    var options = {
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        };
    gulp.src('src/img/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin(options))
        .pipe(gulp.dest('dist/imgMin'));
});
// ================================================================================webserver
// webserver
gulp.task('webserver', function() {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: {
                enable:true,
                path: 'dist'
            },
            host: '127.0.0.1',
            port: 8000
        }));
});
// connect
gulp.task('connect', function () {
	connect.server({
		root: 'dist',
		livereload: true
	});
});
// ==================================================================================WATCH
// watch
gulp.task('watch', function () {
    gulp.watch('src/css/**/*.less', ['less','lessMin']);
});

gulp.task('watchHtml', function() {
    livereload.listen();
    gulp.watch('src/html/*.html', ['html',htmlMin]);
});

// default
gulp.task('default',[]);































