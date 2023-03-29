const mix = require("laravel-mix");
const path = require('path');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js("resources/js/app.js", "public/js").react();
mix.sass("resources/sass/app.scss", "public/css");

if (mix.inProduction()) {
  mix.version();
}

mix.webpackConfig({
    resolve: {
        alias: {
            '@BeesImages': path.resolve(__dirname, 'public/images'),
            '@BeesJs': path.resolve(__dirname, 'public/js'),
            '@BeesCss': path.resolve(__dirname, 'public/css')
        }
    }
});


