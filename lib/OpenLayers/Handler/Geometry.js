/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


/**
 * @requires OpenLayers/Handler/Drag.js
 */

/**
 * Class: OpenLayers.Handler.Geometry
 * Handler to drag out a geometry collection on the map. Similar to the
 * regular polygon handler, but renders a geometry collection.
 *
 * Inherits from:
 *  - <OpenLayers.Handler.Drag>
 */
OpenLayers.Handler.Geometry = OpenLayers.Class(OpenLayers.Handler.Drag, {


    /**
     * Property: layerOptions
     * {Object} Any optional properties to be set on the sketch layer.
     */
    layerOptions: null,


    /**
     * Property: geometry
     * {<OpenLayers.Geometry.Collection>} The current collection.
     */
    geometry: null,


    /**
     * Property: feature
     * {<OpenLayers.Feature.Vector>} The currently drawn polygon feature
     */
    feature: null,


    /**
     * Property: angle
     * {Float} The angle from the location of the first click that started
     *      the drag to the current cursor position. Measured clockwise
     *      from the positive x-axis.
     */
    angle: 0,


    /**
     * Property: width
     * {Float} The current width of the geometry collection.
     */
    width: null,


    /**
     * Property: layer
     * {<OpenLayers.Layer.Vector>} The temporary drawing layer.
     */
    layer: null,


    /**
     * Property: origin
     * {<OpenLayers.Geometry.Point>} Location of the first mouse down.
     */
    origin: null,


    /**
     * Property: wkt
     * {String} The original wkt of the input geometry collection.
     */
    wkt: null,


    /**
     * Constructor: OpenLayers.Handler.Geometry
     * Create a new geometry handler.
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that owns this handler
     * callbacks - {Object} An object with a properties whose values are
     *      functions.  Various callbacks described below.
     * options - {Object} An object to be set on the handler.
     */
    initialize: function(control, callbacks, options) {

        // Set the default style man if none is defined.
        if(!(options && options.layerOptions &&
            options.layerOptions.styleMap)) {

            this.style = OpenLayers.Util.extend(
              OpenLayers.Feature.Vector.style['default'], {}
            );

        }

        // Initialize the drag handler.
        OpenLayers.Handler.Drag.prototype.initialize.apply(this, [
          control, callbacks, options
        ]);

        this.options = options ? options : {};

    },


    /**
     * APIMethod: setOptions
     *
     * Parameters:
     * newOptions - {Object}
     */
    setOptions: function (newOptions) {
        OpenLayers.Util.extend(this.options, newOptions);
        OpenLayers.Util.extend(this, newOptions);
    },


    /**
     * APIMethod: setOptions
     *
     * Parameters:
     * geometry- {<OpenLayers.Geometry>}
     */
    setGeometry: function (geometry) {
        this.geometry = geometry;
    },


    /**
     * APIMethod: activate
     * Turn on the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully activated
     */
    activate: function() {

        var activated = false;

        // Activate the drag handler.
        if (OpenLayers.Handler.Drag.prototype.activate.apply(
            this, arguments)) {

            // Create the sketch layer.
            this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME,
                OpenLayers.Util.extend({
                    displayInLayerSwitcher: false,
                    calculateInRange: OpenLayers.Function.True
                }, this.layerOptions)
            );

            // Add the layer.
            this.map.addLayer(this.layer);
            activated = true;

        }

        return activated;

    },


    /**
     * APIMethod: deactivate
     * Turn off the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully deactivated
     */
    deactivate: function() {

        var deactivated = false;

        if (OpenLayers.Handler.Drag.prototype.deactivate.apply(
            this, arguments)) {

            // Remove the sketch layer and feature.
            if (this.layer.map !== null) {
                this.layer.destroy(false);
                if (this.feature) this.feature.destroy();
            }

            this.layer = null;
            this.feature = null;
            deactivated = true;
        }

        return deactivated;

    },


    /**
     * Method: down
     * Start drawing a new feature
     *
     * Parameters:
     * evt - {Event} The drag start event
     */
    down: function(evt) {

        if (!this.geometry) return;
        this.clear();

        // Clone a copy of the original geoemtry.
        this.dragGeometry = this.geometry.clone();

        // Get the location of the initiating click.
        var loc = this.layer.getLonLatFromViewPortPx(evt.xy);
        this.origin = new OpenLayers.Geometry.Point(loc.lon, loc.lat);
        this.radius = this.measureWidth();

        // Create the sketch feature.
        this.feature = new OpenLayers.Feature.Vector();
        this.feature.geometry = this.dragGeometry;
        this.layer.addFeatures([this.feature], { silent: true });
        this.callback("create", [this.origin, this.feature]);

        // Move bottom left corner to origin.
        var dx = loc.lon - this.dragGeometry.bounds.left;
        var dy = loc.lat - this.dragGeometry.bounds.bottom;
        this.dragGeometry.move(dx, dy);

    },


    /**
     * Method: move
     * Respond to drag move events
     *
     * Parameters:
     * evt - {Evt} The move event
     */
    move: function(evt) {

        if (!this.geometry) return;

        // Compute the current radius of the drag.
        var loc = this.layer.getLonLatFromViewPortPx(evt.xy);
        var point = new OpenLayers.Geometry.Point(loc.lon, loc.lat);

        // Rotate.
        var prevAngle = this.angle;
        this.angle = this.calculateAngle(point, evt);
        this.dragGeometry.rotate(this.angle - prevAngle, this.origin);

        // Scale.
        var prevRadius = this.radius;
        this.radius = point.distanceTo(this.origin);
        this.dragGeometry.resize(this.radius / prevRadius, this.origin);

        // Redraw.
        this.layer.drawFeature(this.feature, this.style);

    },


    /**
     * Method: calculateAngle
     * Calculate the angle based on settings.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     * evt - {Event}
     */
    calculateAngle: function(point, evt) {
        return Math.atan2(
            point.y - this.origin.y,
            point.x - this.origin.x
        ) * (180 / Math.PI);
    },


    /**
     * Method: measureWidth
     * Measure and store the current width of the geometry collection.
     *
     * Returns:
     * {Number} The width of the collection.
     */
    measureWidth: function() {
        this.dragGeometry.calculateBounds();
        return Math.abs(
            this.dragGeometry.bounds.right -
            this.dragGeometry.bounds.left
        );
    },


    /**
     * Method: up
     * Finish drawing the feature
     *
     * Parameters:
     * evt - {Event} The mouse up event
     */
    up: function(evt) {
        this.callback('done', [evt.xy]);
        this.finalize();
    },


    /**
     * Method: out
     * Finish drawing the feature.
     *
     * Parameters:
     * evt - {Event} The mouse out event
     */
    out: function(evt) {
        this.finalize();
    },

    /**
     * APIMethod: cancel
     * Finish the geometry and call the `cancel` callback.
     */
    cancel: function() {
        this.callback('cancel', null);
        this.finalize();
    },


    /**
     * Method: finalize
     * Teset `origin` and `angle`.
     */
    finalize: function() {
        this.origin = null;
        this.angle  = 0;
    },


    /**
     * APIMethod: clear
     * Clear any rendered features on the temporary layer.
     */
    clear: function() {
        if (this.layer) {
            this.layer.renderer.clear();
            this.layer.destroyFeatures();
        }
    },


    /**
     * Method: callback
     * Trigger the control's named callback with the given arguments
     *
     * Parameters:
     * name - {String} The callback key.
     * args - {Array} An array of arguments.
     */
    callback: function (name, args) {

        // Fire the callback.
        if (this.callbacks[name]) {
            this.callbacks[name].apply(
                this.control, [this.dragGeometry.clone()]
            );
        }

        // Clear the sketch layer if drag is ending.
        if (name == 'done' || name == 'cancel') this.clear();

    },


    CLASS_NAME: "OpenLayers.Handler.Geometry"


});
