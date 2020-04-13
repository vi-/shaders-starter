"use strict";

const { series, parallel, src, dest, watch } = require("gulp");

// prettier-ignore
const	atImport      = require( 'postcss-import' ),
      autoprefixer  = require( 'autoprefixer' ),
      babel         = require( 'rollup-plugin-babel' ),
      browserSync   = require( 'browser-sync' ).create(),
      commonjs      = require( 'rollup-plugin-commonjs' ),
      cssnano       =	require( 'cssnano' ),
      del           =	require( 'del' ),
      fs            = require( 'fs' ),
      imagemin      = require( 'gulp-imagemin' ),
      maps          = require( 'gulp-sourcemaps' ),
      postcss       = require( 'gulp-postcss' ),
      replace       = require( 'gulp-replace' ),
      resolve       = require( 'rollup-plugin-node-resolve' ),
      shader        = require( 'rollup-plugin-shader' ),
      rollup        = require( 'rollup' ),
      sass          = require( 'gulp-sass' ),
      uglify        = require( 'rollup-plugin-uglify' );

const isProduction = process.env.NODE_ENV === "production";

const basePaths = {
  src: "./src/",
  dest: "./",
};
const paths = {
  scripts: {
    src: `${basePaths.src}js/**/*.js`,
    dest: `${basePaths.dest}js/`,
    entry: `${basePaths.src}js/myscript.js`,
    exit: `${basePaths.dest}js/script.js`,
  },
  styles: {
    entry: `${basePaths.src}scss/style.scss`,
    dest: `${basePaths.dest}css/`,
  },
};

const config = {
  rollup: {
    bundle: {
      input: paths.scripts.entry,
      plugins: [
        resolve({
          mainFields: ["module", "jsnext:main", "main"],
        }),
        commonjs(),
        babel({
          exclude: "node_modules/**",
        }),
        shader({
          // All match files will be parsed by default,
          // but you can also specifically include/exclude files
          include: "**/*.glsl",
          exclude: ["node_modules/**"],
          removeComments: true, // default: true
        }),
      ],
    },
    write: {
      file: paths.scripts.exit,
      format: "iife",
      globals: {
        jquery: "jQuery",
      },
      sourcemap: isProduction ? true : "inline",
    },
  },
};

// Modify build process for Production
if (isProduction) config.rollup.bundle.plugins.push(uglify.uglify());

async function compileJS() {
  const bundle = await rollup.rollup(config.rollup.bundle);
  await bundle.write(config.rollup.write);
}

const serveSite = (cb) => {
  browserSync.init({
    server: { baseDir: "./" },
  });
  watchFiles();
};

const compileCSS = () => {
  return src([paths.styles.entry])
    .pipe(maps.init())
    .pipe(
      sass().on("error", function (err) {
        console.error(err.message);
        browserSync.notify(err.message, 3000);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer(), atImport(), cssnano()]))
    .pipe(maps.write("./"))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
};

const minifyImages = () => {
  return src(`${basePaths.src}/images/*`)
    .pipe(imagemin())
    .pipe(dest(`${basePaths.dest}images/`));
};

const copyFonts = () => {
  return src("src/fonts/**").pipe(dest("./fonts"));
};

const browserReload = (done) => {
  browserSync.reload();
  done();
};

const watchFiles = () => {
  watch("src/scss/**/*.scss", compileCSS);
  watch("src/js/**/*.js", series(compileJS, browserReload));
  watch("src/shaders/*.glsl", series(compileJS, browserReload));
  watch("src/images/*", series(minifyImages, browserReload));
  watch("src/fonts/*", copyFonts);
  watch("index.html", browserReload);
  console.log("👀 Watching files 👀");
};

const clean = (done) => {
  del(["dist", "images", "css/style.css*", "js/script.js*"]);
  done();
};

const buildDest = () => {
  let files = [
    "css/style.css",
    "fonts/**",
    "images/**",
    "js/script.js",
    "index.html",
  ];
  if (fs.existsSync("favicon.ico")) files.push("favicon.ico");
  return src(files, { base: "./" }).pipe(dest("dist"));
};

exports.default = series(
  parallel(compileCSS, compileJS, minifyImages),
  serveSite
);

exports.build = series(
  clean,
  parallel(compileCSS, compileJS),
  parallel(copyFonts, minifyImages),
  buildDest
);
