var gulp = require('gulp')
var postcss = require('gulp-postcss')
var rucksack = require('rucksack-css') //Fuentes Responsive
var cssnested = require('postcss-nested')
var cssnext = require('postcss-cssnext')
var lost = require('lost') //Manejo de grillas 
var atImport = require('postcss-import')
var csswring = require('csswring') //Para minificar el codigo
var mqpacker = require('css-mqpacker')
//var browserSync = require('browser-sync').create()
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

// servidor de desarrollo
//gulp.task('serve', function (){
//	browserSync.init({
//		proxy: "http://localhost:8888/www.nrc.org.co/dist/"
//	})
//})

// Tarea para procesar el CSS
gulp.task('css', function (){
	var processors = [
		atImport(),
		cssnested,
		lost(),
		rucksack(),
		cssnext({ browsers: ['> 5%', 'ie 8'] }),
		mqpacker,
		//csswring() // Minifica el CSS
	];
	
	return gulp.src('./src/style.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('./dist/wp-content/themes/nrc'))
		//.pipe(browserSync.stream())
})

//Tarea para vigilar los cambios
gulp.task('watch', function (){
	gulp.watch('./src/**', ['css'])
	gulp.watch('./dist/wp-content/themes/nrc/**')/*.on('change', browserSync.reload)*/
})

gulp.task('default', ['watch'/*, 'serve'*/])


/** Configuration FTP **/
var user = process.env.FTP_USER;
var password = process.env.FTP_PWD;
var host = '190.61.4.77';
var port = 21;
var localFilesGlob = [//Referencia a los archivos y carpetas actualizar
	'./dist/wp-content/themes/nrc/*.php', 
	'./dist/wp-content/themes/nrc/404.php', 
	'./dist/wp-content/themes/nrc/*.css',
	//'./dist/wp-content/themes/nrc/images/*.*',
	// './dist/wp-content/uploads/**',
	//'./dist/wp-content/themes/nrc/js/*.*',
	'./dist/wp-content/plugins/**',
	//'./dist/wp-content/themes/nrc/template/*.*',
	];
var remoteFolder = '/wp-content/' //RUTA DONDE SE SUBIRAN LOS ARCHIVOS AL SERVIDOR
//ftp://ftp.cardioalejoteam.com:21//public_html/wp-content/themes/rafagaviria/prueba

// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
	return ftp.create({
		host: '190.61.4.77',
		port: 21,
		user: 'rafaelgaviria',
		password: 'rWma86&2',
		parallel: 2,
		log: gutil.log
	});
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function() {

	var conn = getFtpConnection();
	//return gulp.src(localFilesGlob, { base: '/Users/apple/Googledrive/www/www.nrc.org.co/dist/wp-content/', buffer: false })
	return gulp.src(localFilesGlob, { base: '/home/ubuntu/workspace/dist/wp-content/', buffer: false })
		.pipe( conn.newer( remoteFolder ) ) // only upload newer files
		.pipe( conn.dest( remoteFolder ) )
		// .pipe(notify({
		// 	 message: 'Finished deployment.',
		// 	 sound: 'Hero',
		// 	 onLast: true
		// }));
});