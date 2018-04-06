# JSDoc Comments

[![Build Status](https://travis-ci.org/pixijs/jsdoc-comments.svg?branch=master)](https://travis-ci.org/pixijs/jsdoc-comments)

This commandline utility exports all JSDoc-style comments from files into another folder without any code. This is useful if you want to use JSDoc but file formats do not support JavaScript parsing, for instance, TypeScript files.

This is a port of [**gulp-comments**](https://github.com/jiborobot/gulp-comments) but for use without Gulp.

## Install

```
npm i @pixi/jsdoc-comments -D
```

## Usage

Directory (either `--dir` or `-d`) is required as the output directory location. Additional arguments are used as the glob of files to include.

```
comments -d .docs "src/**/*.ts"
```

### Filters

Additional you can add a filter argument (either `--filter` or `-f`) of a tag that will exclude comment. For instance:

```
comments -d .docs -f "@internal" "src/**/*.ts"
```
