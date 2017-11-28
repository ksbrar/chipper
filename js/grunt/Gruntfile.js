// Copyright 2013-2015, University of Colorado Boulder

/**
 * Grunt configuration file for PhET projects.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
/* eslint-env node */
'use strict';

const assert = require( 'assert' );
const buildRunnable = require( './buildRunnable' );
const buildStandalone = require( './buildStandalone' );
const chipperGlobals = require( './chipperGlobals' );
const fs = require( 'fs' );
const generateA11yViewHTML = require( './generateA11yViewHTML' );
const generateConfig = require( './generateConfig' );
const generateCoverage = require( './generateCoverage' );
const generateDevelopmentColorsHTML = require( './generateDevelopmentColorsHTML' );
const generateDevelopmentHTML = require( './generateDevelopmentHTML' );
const generateREADME = require( './generateREADME' );
const generateThumbnails = require( './generateThumbnails' );
const generateTwitterCard = require( './generateTwitterCard' );
const getPhetLibs = require( './getPhetLibs' );
const lint = require( './lint' );

module.exports = function( grunt ) {
  const packageObject = grunt.file.readJSON( 'package.json' );

  // Handle the lack of build.json
  var buildObject;
  try {
    buildObject = grunt.file.readJSON( '../chipper/build.json' );
  } 
  catch ( e ) {
    buildObject = {};
  }

   // TODO: grunt error on promise rejection

  const brand = grunt.option( 'brand' ) || buildObject.brand || 'adapted-from-phet';
  assert( grunt.file.exists( '../brand/' + brand ), 'no such brand: ' + brand );

  const repo = grunt.option( 'repo' ) || packageObject.name;

  chipperGlobals.initialize( grunt );

  grunt.registerTask( 'default', 'Builds the repository', ( grunt.option( 'lint' ) === false ? [] : [ 'lint-all' ] ).concat( [ 'clean', 'build' ] ) );

  grunt.registerTask( 'clean',
    'Erases the build/ directory and all its contents, and recreates the build/ directory',
    function() {
      var buildDirectory = '../' + repo + '/build';
      if ( grunt.file.exists( buildDirectory ) ) {
        grunt.file.delete( buildDirectory );
      }
      grunt.file.mkdir( buildDirectory );
    } );

  grunt.registerTask( 'build',
    'TODO',
    async function() {
      const done = grunt.task.current.async();

      const instrument = !!grunt.option( 'instrument' );
      const uglify = !instrument && ( grunt.option( 'uglify' ) !== false ); // Do not uglify if it is being instrumented
      const mangle = grunt.option( 'mangle' ) !== false;

      try {
        if ( repo === 'scenery' || repo === 'kite' || repo === 'dot' ) {
          fs.writeFileSync( '../' + repo + '/build/' + repo + '.min.js', await buildStandalone( grunt, repo, uglify, mangle ) );
        }
        else {
          await buildRunnable( grunt, repo, uglify, mangle, instrument, brand );
        }
      }
      catch ( e ) {
        console.log( e );
        grunt.log.error( e );
      }

      done();
    }
  );

  grunt.registerTask( 'build-for-server', 'meant for use by build-server only',
    [ 'build', 'generate-thumbnails', 'generate-twitter-card' ]
  );
  grunt.registerTask( 'lint', 'lint js files that are specific to this repository', function() {
    lint( grunt, [ repo ] );
  } );

  grunt.registerTask( 'lint-all', 'lint all js files that are required to build this repository', async function() {
    const done = grunt.task.current.async();

    lint( grunt, getPhetLibs( grunt, repo, brand ) );

    done();
  } );

  grunt.registerTask( 'lint-everything', 'lint all js files that are required to build this repository', function() {
    lint( grunt, grunt.file.read( '../chipper/data/active-repos' ).trim().split( /\r?\n/ ) );
  } );

  grunt.registerTask( 'generate-thumbnails', 'Generate 128x84 and 600x394 thumbnails to be used on the website.',
    async function() {
      const done = grunt.task.current.async();

      await Promise.all( [
        generateThumbnails( grunt, repo, 128, 84 ),
        generateThumbnails( grunt, repo, 600, 394 )
      ] );

      done();
    } );

  grunt.registerTask( 'generate-twitter-card', 'Generate image for twitter summary card to be used on the website.',
    async function() {
      const done = grunt.task.current.async();

      await generateTwitterCard( grunt, repo );

      done();
    } );

  grunt.registerTask( 'generate-development-html',
    'Generates top-level SIM_en.html file based on the preloads in package.json.',
    function() {
      generateDevelopmentHTML( grunt, repo );
    } );

  grunt.registerTask( 'generate-development-colors-html',
    'Generates top-level SIM-colors.html file used for testing color profiles and color values.',
    function() {
      generateDevelopmentColorsHTML( grunt, repo );
    } );

  grunt.registerTask( 'generate-a11y-view-html',
    'Generates top-level SIM-a11y-view.html file used for visualizing accessible content.',
    function() {
      generateA11yViewHTML( grunt, repo );
    } );

  grunt.registerTask( 'generate-config',
    'Generates the js/SIM-config.js file based on the dependencies in package.json.',
    function() {
      generateConfig( grunt, repo );
    } );

  grunt.registerTask( 'generate-coverage',
    'Generates a code coverage report using Istanbul. See generateCoverage.js for details.',
    function() {
      generateCoverage( grunt, repo );
    } );

  grunt.registerTask( 'published-README',
    'Generates README.md file for a published simulation.',
    function() {
      generateREADME( grunt, repo, true /* published */ );
    } );

  grunt.registerTask( 'unpublished-README',
    'Generates README.md file for an unpublished simulation.',
    function() {
      generateREADME( grunt, repo, false /* published */ );
    } );

};
