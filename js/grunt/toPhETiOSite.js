// Copyright 2015, University of Colorado Boulder

/**
 * Copy a simulation and its API to the local phet-io-site, see phet-io-site-readme.md
 *
 * @author Sam Reid
 */

// modules
var assert = require( 'assert' );

// constants
var directory = process.cwd();

/**
 * @param grunt the grunt instance
 */
module.exports = function( grunt, buildConfig ) {
  'use strict';

  grunt.log.writeln( 'hello' );
  console.log( buildConfig );

  var simVersion = buildConfig.version;

  console.log( 'brand', buildConfig.brand );

  assert( buildConfig.brand === 'phet-io', 'the brand must be phet-io to get the version name right' );

  var siteVersion = grunt.option( 'siteversion' ) + ''; // convert number to string
  var simHash = grunt.option( 'simshash' );
  var apiHash = grunt.option( 'apihash' );

  if ( siteVersion.indexOf( '.' ) < 0 ) {
    siteVersion = siteVersion + '.0'; // Drop missing ".0" suffix if missing
  }

  assert( siteVersion, '--siteversion must be specified' );
  assert( simHash, '--simHash must be specified' );
  assert( apiHash, '--apiHash must be specified' );

  var simName = buildConfig.name;

  var simPath = directory + '/../phet-io-site/' + siteVersion + '/sims/' + simHash + '/' + simName + '/' + simVersion;
  var apiPath = directory + '/../phet-io-site/' + siteVersion + '/api/' + apiHash + '/' + simName + '/' + simVersion;

  // Clean if present
  grunt.file.delete( simPath, { force: true } );
  grunt.file.delete( apiPath, { force: true } );

  // Create
  grunt.file.mkdir( simPath );
  grunt.file.mkdir( apiPath );

  var destinationPath = simPath;

  // Copy built sim files (assuming they exist from a prior grunt command)
  grunt.file.recurse( directory + '/build', function callback( abspath, rootdir, subdir, filename ) {

    // TODO: this line is duplicated around chipper
    var contentsPath = subdir ? ( destinationPath + '/' + subdir + '/' + filename ) : ( destinationPath + '/' + filename );
    grunt.file.copy( abspath, contentsPath );
    grunt.log.writeln( 'copied ' + abspath + ' -> ' + contentsPath );
  } );

  // Copy each of the API files
  //var packageJSON = grunt.file.readJSON( directory + '/package.json' );
};