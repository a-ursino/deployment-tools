## Contents
A node.js scripts that helps you to compile and deploy the static assets (css/JavaScript) of your website


- [Tasks](#tasks)
- [Features](#features)


## Tasks
The scripts available at the moment are:
* `clean`: delete and create again the JavaScript (`buildPathJs` config key) and Css (`buildPathCss` config key) folder
* `bump`: update the version inside `package.json` (`packageJson` config key) and `Web.config` (`webConfig` config key) according to major/minor/patch
* `buildJs`: lint(`eslint-loader`), transpile(`babel-loader`) and minify(`UglifyJsPlugin`) js files with `webpack`
* `build`: test -> clean -> build[ js | style ]
* `upload`: upload the compiled files on the Azure Storage (CDN)
* `deploy`: bump -> clean -> build[ js | style ] -> upload
* `watch`: starts `webpack-dev-server` for js files
* `test`: test files inside folder with tape/blue-tape (TAP specification) and format the output with faucet

*note: -> means in serial, | means in parallel*

## Configuration

**General**
* `domain`: the domain of the Azure CDN, used to built up the path (webpack splitting) for resources on Azure CDN
* `projectName`: name of the project, used to built up the path for resources ond CDN
* `webConfig`: the relative path with filename of the webConfig file (es: data/Web.Config). When set, version in the file as `appSettings key swversion` is updated during bump process
* `packageJson`: the relative path with filename of the `package.json` file


**Style**
* `srcSass`: the path of the sass files (es: sass/). When set __Sass__ is used [OPT-IN]
* `srcLess`: the path of the less files (es: less/). When set __Less__ is used [OPT-IN]
* `mainStyle`: the entry file of the front's styles (es: main.less/main.sass)
* `mainBackoffileStyle`: the entry file of the backoffice's styles (es: main-admin.less/main.sass) [OPT-IN]
* `buildPathCss`: the path of the compiled Css files (es: css)
* `cleanBuildPathCss`: when set and true, avoid to delete the css folder during `clean` task

**JavaScript**
* `srcJsPath`: the path with the JavaScript files
* `mainJs`: the main entry (es: main.js)
* `vendorsJs`: the filename of the vendors file (es: vendors.js)[OPT-IN]
* `mainBackoffileJs`: the backoffice main-entry (es: main-backoffice.js) [OPT-IN]
* `vendorsBackoffileJs`: the filename of the vendors file for backoffice (es: vendors-backoffice.js)[OPT-IN]
* `buildPathJs`: the path of the compiled JavaScript files (es: bundles)


*note all the config path must ends with trailing slash*


### Web.config
If your your website is a .net website (so with a web.config file) you can add a key to appSetting named `swversion`. When you run `npm run bump` or `npm run deploy` the version inside is upgraded automatically.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
    <add key="swversion" value="1.42.2" />
  </appSettings>
</configuration>
```
In this way you can track project version in your .net website easily (for example alongside error reporting).
This is an example of how it could works with Sentry and Raven Client in an MVC website server-side

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
while client-side

```html
<html>
	....
	<body>
		<script src="https://cdn.ravenjs.com/3.0.5/raven.min.js"></script>
<script>
    Raven.config('...', {
        release: '@ConfigurationManager.AppSettings["swversion"]',
    }).install();
</script>
	</body>
</html>
```


# Features

* *Transpile* JavaScript files with [Babel 6](https://babeljs.io) and [webpack](http://webpack.github.io/)
* *Lint* JavaScript files with [ESLint](http://eslint.org/)
* serve js files via [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
* compile Less files
* compile Sass files
* process css files with [postcss](https://github.com/postcss/postcss)
* add vendor prefixes with [autoprefixer](https://github.com/postcss/autoprefixer) postcss's plugin
* minify css files with [cssnano](https://github.com/ben-eb/cssnano) postcss's plugin

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
		"build": "babel-node tools/run build",
		"bump": "babel-node tools/run bump",
		"deploy": "babel-node tools/run deploy",
		"upload": "babel-node tools/run upload",
		"watch": " babel-node tools/run watch"
	}
}
```
and the relative confing settings to `package.json` file

```json
{
	"config": {
    "domain": "http://YOURCDNDOMAIN",
    "projectName": "projectname",
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
    "cleanBuildPathCss": "true"
	}
}
```

## TODO
* add `amazon` CDN provider
* code coverage

## License

Copyright (c) 2016 Alessandro Ursino (killanaca)

MIT (http://opensource.org/licenses/mit-license.php)
