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
 * regular polygon handler, but works with an geometry object.
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
     * APIProperty: citeCompliant
     * {Boolean} If set to true, coordinates of features drawn in a map
     *      extent crossing the date line won't exceed the world bounds.
     */
    citeCompliant: false,


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
    angle: null,


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
     * Constructor: OpenLayers.Handler.Geometry
     * Create a new geometry handler.
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that owns this handler
     * callbacks - {Object} An object with a properties whose values are
     *      functions.  Various callbacks described below.
     * options - {Object} An object to be set on the handler.
     *
     * Named callbacks:
     * create - Called when a sketch is first created. Callback called
     *      with the creation point geometry and sketch feature.
     * done - Called when the sketch drawing is finished.  The callback
     *      will recieve a single argument, the sketch geometry.
     * cancel - Called when the handler is deactivated while drawing. The
     *      cancel callback will receive a geometry.
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
          control,
          callbacks,
          options
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
     * geometryCollection - {<OpenLayers.Layer.Vector>}
     */
    setGeometry: function (geometryCollection) {

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
                    calculateInRange: OpenLayers.Function.True,
                    wrapDateLine: this.citeCompliant
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
    // deactivate: function() {
    //     var deactivated = false;
    //     if(OpenLayers.Handler.Drag.prototype.deactivate.apply(this, arguments)) {
    //         // call the cancel callback if mid-drawing
    //         if(this.dragging) {
    //             this.cancel();
    //         }
    //         // If a layer's map property is set to null, it means that that
    //         // layer isn't added to the map. Since we ourself added the layer
    //         // to the map in activate(), we can assume that if this.layer.map
    //         // is null it means that the layer has been destroyed (as a result
    //         // of map.destroy() for example.
    //         if (this.layer.map !== null) {
    //             this.layer.destroy(false);
    //             if (this.feature) {
    //                 this.feature.destroy();
    //             }
    //         }
    //         this.layer = null;
    //         this.feature = null;
    //         deactivated = true;
    //     }
    //     return deactivated;
    // },


    /**
     * Method: down
     * Start drawing a new feature
     *
     * Parameters:
     * evt - {Event} The drag start event
     */
    down: function(evt) {
        console.log('down');

        // Store the location of the initiating click.
        var loc = this.layer.getLonLatFromViewPortPx(evt.xy);
        this.origin = new OpenLayers.Geometry.Point(loc.lon, loc.lat);
        this.radius = this.map.getResolution();

        // this.fixedRadius = !!(this.radius);
        // var maploc = this.layer.getLonLatFromViewPortPx(evt.xy); 
        // this.origin = new OpenLayers.Geometry.Point(maploc.lon, maploc.lat);
        // // create the new polygon
        // if(!this.fixedRadius || this.irregular) {
        //     // smallest radius should not be less one pixel in map units
        //     // VML doesn't behave well with smaller
        //     this.radius = this.map.getResolution();
        // }
        // if(this.persist) {
        //     this.clear();
        // }
        // this.feature = new OpenLayers.Feature.Vector();
        // this.createGeometry();
        // this.callback("create", [this.origin, this.feature]);
        // this.layer.addFeatures([this.feature], {silent: true});
        // this.layer.drawFeature(this.feature, this.style);
    },


    /**
     * Method: move
     * Respond to drag move events
     *
     * Parameters:
     * evt - {Evt} The move event
     */
    move: function(evt) {
        console.log('move');
    //     var maploc = this.layer.getLonLatFromViewPortPx(evt.xy); 
    //     var point = new OpenLayers.Geometry.Point(maploc.lon, maploc.lat);
    //     if(this.irregular) {
    //         var ry = Math.sqrt(2) * Math.abs(point.y - this.origin.y) / 2;
    //         this.radius = Math.max(this.map.getResolution() / 2, ry);
    //     } else if(this.fixedRadius) {
    //         this.origin = point;
    //     } else {
    //         this.calculateAngle(point, evt);
    //         this.radius = Math.max(this.map.getResolution() / 2,
    //                                point.distanceTo(this.origin));
    //     }
    //     this.modifyGeometry();
    //     if(this.irregular) {
    //         var dx = point.x - this.origin.x;
    //         var dy = point.y - this.origin.y;
    //         var ratio;
    //         if(dy == 0) {
    //             ratio = dx / (this.radius * Math.sqrt(2));
    //         } else {
    //             ratio = dx / dy;
    //         }
    //         this.feature.geometry.resize(1, this.origin, ratio);
    //         this.feature.geometry.move(dx / 2, dy / 2);
    //     }
    //     this.layer.drawFeature(this.feature, this.style);
    },


    /**
     * Method: up
     * Finish drawing the feature
     *
     * Parameters:
     * evt - {Event} The mouse up event
     */
    up: function(evt) {
        console.log('up');
    //     this.finalize();
    //     // the mouseup method of superclass doesn't call the
    //     // "done" callback if there's been no move between
    //     // down and up
    //     if (this.start == this.last) {
    //         this.callback("done", [evt.xy]);
    //     }
    },


    /**
     * Method: out
     * Finish drawing the feature.
     *
     * Parameters:
     * evt - {Event} The mouse out event
     */
    out: function(evt) {
        console.log('out');
        // this.finalize();
    },


    /**
     * Method: calculateAngle
     * Calculate the angle based on settings.
     *
     * Parameters:
     * point - {<OpenLayers.Geometry.Point>}
     * evt - {Event}
     */
    // calculateAngle: function(point, evt) {
    //     var alpha = Math.atan2(point.y - this.origin.y,
    //                            point.x - this.origin.x);
    //     if(this.snapAngle && (this.snapToggle && !evt[this.snapToggle])) {
    //         var snapAngleRad = (Math.PI / 180) * this.snapAngle;
    //         this.angle = Math.round(alpha / snapAngleRad) * snapAngleRad;
    //     } else {
    //         this.angle = alpha;
    //     }
    // },


    /**
     * APIMethod: cancel
     * Finish the geometry and call the "cancel" callback.
     */
    cancel: function() {
        console.log('cancel');
    //     // the polygon geometry gets cloned in the callback method
    //     this.callback("cancel", null);
    //     this.finalize();
    },


    /**
     * Method: finalize
     * Finish the geometry and call the "done" callback.
     */
    finalize: function() {
        console.log('finalize');
    //     this.origin = null;
    //     this.radius = this.options.radius;
    },


    /**
     * APIMethod: clear
     * Clear any rendered features on the temporary layer.  This is called
     *     when the handler is deactivated, canceled, or done (unless persist
     *     is true).
     */
    clear: function() {
        console.log('finalize');
    //     if (this.layer) {
    //         this.layer.renderer.clear();
    //         this.layer.destroyFeatures();
    //     }
    },


    /**
     * Method: callback
     * Trigger the control's named callback with the given arguments
     *
     * Parameters:
     * name - {String} The key for the callback that is one of the properties
     *     of the handler's callbacks object.
     * args - {Array} An array of arguments with which to call the callback
     *     (defined by the control).
     */
    // callback: function (name, args) {
    //     // override the callback method to always send the polygon geometry
    //     if (this.callbacks[name]) {
    //         this.callbacks[name].apply(this.control,
    //                                    [this.feature.geometry.clone()]);
    //     }
    //     // since sketch features are added to the temporary layer
    //     // they must be cleared here if done or cancel
    //     if(!this.persist && (name == "done" || name == "cancel")) {
    //         this.clear();
    //     }
    // },


    CLASS_NAME: "OpenLayers.Handler.Geometry"


});
