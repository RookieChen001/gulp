/****/
var gulp = require('gulp'),
    del = require('del'),//删除
    shell = require('gulp-shell'),//shell命令
    runSequence = require('run-sequence'),//让gulp任务，可以相互独立，解除任务间的依赖，增强task复用
    gulpLoadPlugins = require('gulp-load-plugins'),//模块化管理插件
    proxy = require('http-proxy-middleware'),//用于把请求代理转发到其他服务器的中间件
    browserSync = require('browser-sync'),//实时刷新
    plugins = gulpLoadPlugins();

//监听
//gulp.task('watch', ['browserSync'], function (){
    //gulp.watch('app/scss/**/*.scss', ['sass']);
    //gulp.watch('app/html/**/*.html', browserSync.reload);
    //gulp.watch('app/js/**/*.js', browserSync.reload);
//});

//实时刷新
gulp.task('browserSync',['sass'],function(){
    var aipProxy = proxy('/api', {
        target: "http://targetUrl",//要代理的目标地址
        changeOrigin: true,
        pathRewrite: {
            '^/api': '/',  //需要rewrite的,
        }
    });
    browserSync.init({
        //设置监听的文件,以gulpfile.js所在的根目录未起点,如果不在根目录要加上路径,单个文件就用字符串,多个文件就用数组
        files:['app/html/**/*.html','app/js/**/*.js','app/scss/**/*.scss'],
        // 启动静态服务器,设置启动时打开的index.html的路径
        server: {
            baseDir: ['app','app/html'],//文件目录
            middleware:[aipProxy],
            index: "html/index.html"//首页
        },
        host:'localhost',
        port:'7777',
    });
});

//删除之前生成public文件
gulp.task('clean', function () {
    return del(['dist/**/*']);//task异步,只有return之后，其他依赖了clean的任务，才能保证执行顺序
});

//编译sass
gulp.task('sass',['clean'],function () {
    return gulp.src('app/scss/*.scss')
        //.pipe(plugins.changed('app',{extension:'.css'}))// gulp-changed 可以只让更改过的文件传递过管道
        //.pipe(plugins.debug({title: 'sass编译:'}))//调试查看哪些文件通过通道
        .pipe(plugins.sass())//编译sass
        .pipe(plugins.csso())//压缩css
        .pipe(gulp.dest('app/css'))
        //.pipe(browserSync.reload({stream: true}));  // 调用 reload
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss',['sass'],function(){
    return gulp.src('app/css/*.css')
        .pipe(plugins.rev())//给文件添加hash编码
        .pipe(gulp.dest('dist/css'))
        .pipe(plugins.rev.manifest())//生成rev-mainfest.json文件作为记录
        .pipe(gulp.dest('dist/css'));
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs',function(){
    return gulp.src('app/js/*.js')
        .pipe(plugins.babel())
        .pipe(plugins.uglify({ mangle: false }))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

//Html替换css、js文件版本
gulp.task('revHtmlCss',function () {
    return gulp.src(['dist/css/*.json', 'app/html/*.html'])
        .pipe(plugins.revCollector())             //替换html中对应的记录
        .pipe(gulp.dest('dist/html'));        //输出到该文件夹中
});
gulp.task('revHtmlJs',function () {
    return gulp.src(['dist/js/*.json', 'dist/html/*.html'])
        .pipe(plugins.revCollector())
        .pipe(gulp.dest('dist/html'));
});

//复制压缩图片
gulp.task('copyImg',function(){
    return gulp.src('app/img/*')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/img'))
});

//复制第三方库js
gulp.task('copyJs',function(){
    return gulp.src('app/js/lib/**/*')
        .pipe(gulp.dest('dist/js/lib'));
});

//复制压缩公共js部分
gulp.task('copyJsCommon',function(){
    return gulp.src('app/js/common/**/*')
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js/common'));
});

//开发执行任务
gulp.task('default', function (callback) {
    runSequence(['browserSync'],
        callback
    )
});

//测试环境执行任务
gulp.task('test',['testConfig'], function (done) {
    //依次顺序执行
    runSequence(
        ['revCss'],
        ['revHtmlCss'],
        ['revJs'],
        ['revHtmlJs'],
        ['copyImg'],
        ['copyJs'],
        ['copyJsCommon'],
        done);
});

//测试环境执行任务
gulp.task('product',['productConfig'], function (done) {
    //依次顺序执行
    runSequence(
        ['revCss'],
        ['revHtmlCss'],
        ['revJs'],
        ['revHtmlJs'],
        ['copyImg'],
        ['copyJs'],
        ['copyJsCommon'],
        done);
});


//测试环境配置文件执行任务
gulp.task('testConfig',shell.task(['node node-main.js test']));

//测试环境配置文件执行任务
gulp.task('productConfig',shell.task(['node node-main.js product']));


