## Contents

- [Tasks](#tasks)


## Tasks
* `clean`: delete and create again the JavaScript (`buildPathJs` config key) and Css (`buildPathCss` config key) folder
* `bump`: update the version inside `package.json` (`packageJson` config key) and `Web.config` (`webConfig` config key)
* `buildJs`: lint(`eslint-loader`), transpile(`babel-loader`) and minify(`UglifyJsPlugin`) js files with `webpack`
* `build`: test -> clean -> build[ js | style ]
* `upload`: upload the compiled files on the Azure Storage (CDN)
* `deploy`: bump -> clean -> build[ js | style ] -> upload
* `watch`: starts `webpack-dev-server` for js files
* `test`: test files inside folder with tape/blue-tape (TAP specification) and format the output with faucet

*note: -> means serial, | means in parallel*

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


### Web.config Example
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
    <add key="swversion" value="1.42.2" />
  </appSettings>
</configuration>
```


# Features

* *Transpile* with [Babel 6](https://babeljs.io) and [webpack](http://webpack.github.io/)
* *Lint* with [ESLint](http://eslint.org/)
* *Tests* with [blue-tape](https://github.com/spion/blue-tape) and [sinon](https://github.com/sinonjs/sinon)
* Serve js files via [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
* Compile Less files
* Compile Sass files [OPT-IN]
* Process css files with [postcss](https://github.com/postcss/postcss)
* Add vendor prefixes with [autoprefixer](https://github.com/postcss/autoprefixer) postcss's plugin
* Minify css files with [cssnano](https://github.com/ben-eb/cssnano) postcss's plugin


## Getting Started

Add your getting started instructions here.

## Packages
* blue-tape
* faucet


## TODO

## License

Copyright (c) 2016 Alessandro Ursino (killanaca)

MIT (http://opensource.org/licenses/mit-license.php)
