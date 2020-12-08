# AVIF in CSS

<img src="https://github.com/nucliweb/avif-in-css/blob/main/assets/AV1.svg?raw=true" align="right"
     alt="AVIF logo" width="180" height="100">

[PostCSS] plugin and tiny JS script *(315B gzipped)* to use [AVIF] image format in CSS background.

With this PostCSS Plugin you can use **AVIF** image format in your CSS background in [Supported Browsers](#supported-browsers), and fallback with the original image.

> AVIF offers significant compression gains vs. JPEG and WebP, with a recent Netflix study showing 50% savings vs. standard JPEG and > 60% savings on 4:4:4 content

## How works?

You add `require('avif-in-css')` to your JS bundle and write CSS like:

```css
.logo {
  width: 80px;
  height: 80px;
  background-image: url(logo.jpg);
}
```

The script will set `avif` or `no-avif` class on `<body>` and PostCSS plugin will generate:

```css
.logo {
  width: 80px;
  height: 80px;
}
body.avif .logo {
  background-image: url(logo.avif);
}
body.no-avif .logo {
  background-image: url(logo.jpg);
}
```

## Usage
### 1. Convert to AVIF

Convert you images to AVIF format, you can use [Squoosh], [Avif.app], [Convertio.co], [avif.io] or any other tool. **Important**: this don't convert the images to AVIF format.

### 2. Install `avif-in-css`

```sh
npm install --save-dev webp-in-css
```
#### 2.1 Load the polyfill

Add the JS script to your client-side JS bundle:

```diff js
+ require('avif-in-css')
```

Since JS script is very small (315B gzipped), the best way for landings
is to inline it to HTML:

```diff html
+   <script><%= readFile('node_modules/AVIF-in-css') %></script>
  </head>
```

You can load the script via CDN:

```diff html
+   <script src=""></script>
  </head>
```

#### 2.2 Load the PostCSS plugin

Check do you use PostCSS already in your bundler. You can check `postcss.config.js` in the project root, `"postcss"` section in `package.json` or `postcss` in bundle config.

If you don’t have it already, add PostCSS to your bundle:

* For webpack see [postcss-loader] docs.
* For Parcel create `postcss.config.js` file.
  It already has PostCSS support.
#### Add `avif-in-css` to PostCSS plugins

```diff js
module.exports = {
  plugins: [
+   require('avif-in-css'),
    require('autoprefixer')
  ]
}
```
If you use CSS Modules in webpack add `modules: true` option:

```diff js
module.exports = {
  plugins: [
-   require(avif-in-css'),
+   require(avif-in-css')({ modules: true }),
    require('autoprefixer')
  ]
}
```

## PostCSS Options

```js
module.exports = {
  plugins: [
    require('avif-in-css')({ /* options */ }),
  ]
}
```

* `modules` boolean: wrap classes to `:global()` to support CSS Modules.
  `false` by default.
* `avifClass` string: class name for browser with AVIF support.
* `noAvifClass` string: class name for browser without AVIF support.
* `rename` function: get a new file name from old name, like `(oldName: string) => string`, then `url(./image.png)` → `url(./image.png.avif)`.

## Supported browsers

* Chrome Desktop 85+
* Firefox 63+ (with `media.av1.enabled` activated)
* Firefox for Android 64+ (with `media.av1.enabled` and `media.av1.use-dav1d` activated)
* Edge 18+ (with `AV1 Video Extension` installed)

[PostCSS]: https://github.com/postcss/postcss
[AVIF]: https://aomediacodec.github.io/av1-avif/
[Squoosh]: https://squoosh.app/
[Avif.app]: https://avif.app
[Convertio.co]: https://convertio.co/avif-converter/
[avif.io]: https://avif.io/
[postcss-loader]: https://github.com/postcss/postcss-loader#usage
