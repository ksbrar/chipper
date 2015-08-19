// Copyright 2002-2015, University of Colorado Boulder

/**
 * Constants used by the PhET build process.
 * All fields are @public (read-only)
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
module.exports = {

  // Locale to use when no locale is specified
  FALLBACK_LOCALE: 'en',

  // Media types, also the directory names where the media files live
  MEDIA_TYPES: [ 'audio', 'images' ],

  // Used to fill in sim.html, the sim template
  START_THIRD_PARTY_LICENSE_ENTRIES: '### START THIRD PARTY LICENSE ENTRIES ###',

  // Used to fill in sim.html, the sim template
  END_THIRD_PARTY_LICENSE_ENTRIES: '### END THIRD PARTY LICENSE ENTRIES ###'
};