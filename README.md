## Contents
A node.js scripts that help you to compile and deploy the static assets (css/JavaScript) of your website.
More why [here](https://medium.freecodecamp.com/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.hsmyojdpj).

- [Tasks](#tasks)
- [Features](#features)


## Tasks
The tasks available at the moment are:

* `clean`: delete and create again the JavaScript (`buildPathJs` config key) and Css (`buildPathCss` config key) folder
* `bump`: update the version inside `package.json` (`packageJson` config key) and `Web.config` (`webConfig` config key) according to major/minor/patch
* `buildJs`: lint(`eslint-loader`), transpile(`babel-loader`) and minify(`UglifyJsPlugin`) js files with `webpack`
* `build`: test -> clean -> build[ js | style ]
* `upload`: upload the compiled files on the Azure Storage (CDN)
* `deploy`: bump -> clean -> build[ js | style ] -> upload
* `watch`: starts `webpack-dev-server` for js files
* `test`: test files inside folder with tape/blue-tape (TAP specification) and format the output with faucet
* `imagemin`: compress images inside a folder

*note: -> means in serial, | means in parallel*

## Configuration

**General**
* `domain`: the domain of the Azure CDN, used to built up the path (webpack splitting) for resources on Azure CDN
* `projectName`: name of the project, used to built up the path for resources and CDN
* `webConfig`: the relative path with filename of the webConfig file (es: data/Web.Config). When set, version in the file as `appSettings key swversion` is updated during bump process
* `packageJson`: the relative path with filename of the `package.json` file


**Style**
* `srcSass`: the path of the sass files (es: sass/). When set __Sass__ is used [OPT-IN]
* `srcLess`: the path of the less files (es: less/). When set __Less__ is used [OPT-IN]
* `mainStyle`: the entry file of the front's styles (es: main.less/main.sass)
* `mainBackoffileStyle`: the entry file of the backoffice's styles (es: main-admin.less/main.sass) [OPT-IN]
* `buildPathCss`: the path of the compiled css files (es: css)
* `preserveBuildPathCss`: when true, avoid to delete the css folder during `clean` task [OPT-IN]

**JavaScript**
* `srcJsPath`: the path with the JavaScript files
* `mainJs`: the main entry (es: main.js)
* `vendorsJs`: the filename of the vendors file (es: vendors.js)[OPT-IN]
* `mainBackoffileJs`: the backoffice main-entry (es: main-backoffice.js) [OPT-IN]
* `vendorsBackoffileJs`: the filename of the vendors file for backoffice (es: vendors-backoffice.js)[OPT-IN]
* `buildPathJs`: the path of the compiled JavaScript files (es: bundles)
* `jsLongTermHash`: use hash for js filename

**Image**
* `imagesPath` minify and copy to CDN the images inside the path (es: /data/images/)[OPT-IT]


*note: all the config's path must ends with trailing slash*


### .Net website and Web.config

#### Version

If your your website is a .net website (so with a `Web.config` file) you can add a key to appSetting named `swversion`. When you run `npm run bump` or `npm run deploy` the version inside is upgraded automatically alongside `package.json` .

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
    <add key="swversion" value="1.42.2" />
  </appSettings>
</configuration>
```
In this way you can track project version in your .net website easily (for example alongside error reporting).
This is an example of how it could works with Sentry and Raven Client in an MVC website.

server-side:
```csharp
protected void Application_Error(object sender, EventArgs e) {
	string v = ConfigurationManager.AppSettings["swversion"];
	string sentrykey = ConfigurationManager.AppSettings["sentry.keybackend"];
	var ravenClient = new RavenClient(sentrykey);
	System.Exception exe = Server.GetLastError();
	ravenClient.CaptureException(exe, sentryMessage,SharpRaven.Data.ErrorLevel.Error, new Dictionary<string, string>() { { "scope", "backend" } }, new { Release = v, Environment = enviroment });
	Response.Redirect("/Error/error");
	HttpContext.Current.ClearError();
}
```
client-side:

```html
<html>
	....
	<body data-swversion='@ConfigurationManager.AppSettings["swversion"]'>
		<script src="https://cdn.ravenjs.com/3.0.5/raven.min.js"></script>
<script>
    Raven.config('...', {
        release: '@ConfigurationManager.AppSettings["swversion"]',
    }).install();
</script>
	</body>
</html>
```

#### Long-Term-Caching
If you want to use long term caching (more [there](https://webpack.github.io/docs/long-term-caching.html)) you can
use `jsLongTermHash` option. When so the build process try to update the relative keys inside `Web.config` with the hash of single chunk

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
		<add key="vendors" value="http://YOUR.CDN.DOMAIN/projectname/data/bundles/8f763123f0f046e64dba.js" />
    <add key="main" value="http://YOUR.CDN.DOMAIN/projectname/data/bundles/63ccb10c3a23c226a662.js" />
    <add key="vendors-backoffice" value="http://YOUR.CDN.DOMAIN/projectname/data/bundles/5f015639e77466a19e5d.js" />
    <add key="main-backoffice" value="http://YOUR.CDN.DOMAIN/projectname/data/bundles/5f015639e77466a19e5d.js" />
		<add key="modernizr" value="http://YOUR.CDN.DOMAIN/projectname/data/bundles/modernizr.45f645c83986c0f3e169.js" />
  </appSettings>
</configuration>
```

and you can change your `razor` views in this way

```html
<html>
	....
	<body>
		@if (System.Diagnostics.Debugger.IsAttached) {
        <script src="http://localhost:8080/vendors.js" type="text/javascript"></script>
        <script src="http://localhost:8080/main.js" type="text/javascript"></script>
    } else {
        <script src="@ConfigurationManager.AppSettings['vendors']" type="text/javascript"></script>
        <script src="@ConfigurationManager.AppSettings['main']" type="text/javascript"></script>
    }
	</body>
</html>
```



# Features

#### JavaScript

* serving static content from a cookieless domain (so we can reduce sent payload)
* *Transpile* JavaScript files with [Babel 6](https://babeljs.io) and [webpack](http://webpack.github.io/)
* *Lint* JavaScript files with [ESLint](http://eslint.org/)
* serve js files in dev mode via [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
* [long-term-caching](https://webpack.github.io/docs/long-term-caching.html)
* generate a custom build for `modernizr` with [ModernizrWebpackPlugin](https://github.com/alexpalombaro/modernizr-webpack-plugin)

#### Style sheet

* serving static content from a cookieless domain (so we can reduce sent payload)
* compile Less files with [less](https://github.com/less/less.js)
* process css files with [postcss](https://github.com/postcss/postcss)
* add vendor prefixes with [autoprefixer](https://github.com/postcss/autoprefixer) postcss's plugin
* adjust images urls inside css for CDN with [postcss-url](https://github.com/postcss/postcss-url) postcss's plugin
* minify css files with [cssnano](https://github.com/ben-eb/cssnano) postcss's plugin

#### Images
* serving static content from a cookieless domain (so we can reduce sent payload)
* compress images with [imagemin](https://github.com/imagemin/imagemin) and plugins ([imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant) [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle))

## Package Features
* conventional commit message validator (`commitizen`, `pre-git`) with [conventional-commit-message](https://github.com/bahmutov/conventional-commit-message)
* more functional `npm publish` with [publish-please](https://github.com/inikulin/publish-please)
* *Tests* with [blue-tape](https://github.com/spion/blue-tape) and [sinon](https://github.com/sinonjs/sinon)
* automatic linting and testing with `git hook` and [pre-git](https://github.com/bahmutov/pre-git)

## Getting Started

Setup process of *deployment-tools* is quite easy - just run

```shell
npm install deployment-tools --save-dev
```

then you must copy the `npm` scripts that you want to use to your `package.json` file

```json
{
	"scripts": {
		"lint": "babel-node tools/run lint",
		"clean": "babel-node tools/run clean",
		"preimagemin": "npm run clean",
		"imagemin": "babel-node src/run imagemin",
		"build": "cross-env NODE_ENV=production babel-node tools/run build",
		"bump": "babel-node tools/run bump",
		"deploy": "cross-env NODE_ENV=production babel-node tools/run deploy",
		"upload": "babel-node tools/run upload",
		"watch": "babel-node tools/run watch"
	}
}
```
and the relative confing settings to `package.json` file

```json
{
	"config": {
    "domain": "http://YOUR.CDN.DOMAIN",
    "projectName": "project",
    "webConfig": "Web.config",
    "packageJson": "/package.json",
    "srcJsPath": "/script/",
    "mainJs": "main.js",
    "mainBackoffileJs": "main-backoffice.js",
    "buildPathJs": "/data/bundles/",
    "srcSassOUT": "/sass/",
    "srcLess": "/less/",
    "mainStyle": "main.less",
    "mainBackoffileStyle": "main-admin.less",
    "buildPathCss": "/data/css/",
    "preserveBuildPathCss": "true",
    "imagesPath": "/data/images/"
	}
}
```

## TODO
* compile sass files
* add `amazon` CDN provider
* add more test
* add code coverage

## License

Copyright (c) 2016 Alessandro Ursino (killanaca)

MIT (http://opensource.org/licenses/mit-license.php)
