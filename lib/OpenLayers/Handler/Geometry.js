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
     * Property: angle
     * {Float} The angle from the location of the first click that started
     * the drag to the current cursor position. Measured clockwise from
     * the positive x-axis.
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
     * Constructor: OpenLayers.Handler.RegularPolygon
     * Create a new regular polygon handler.
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that owns this handler
     * callbacks - {Object} An object with a properties whose values are
     *     functions.  Various callbacks described below.
     * options - {Object} An object with properties to be set on the handler.
     *     If the options.sides property is not specified, the number of sides
     *     will default to 4.
     *
     * Named callbacks:
     * create - Called when a sketch is first created.  Callback called with
     *     the creation point geometry and sketch feature.
     * done - Called when the sketch drawing is finished.  The callback will
     *     recieve a single argument, the sketch geometry.
     * cancel - Called when the handler is deactivated while drawing.  The
     *     cancel callback will receive a geometry.
     */
    // initialize: function(control, callbacks, options) {
    //     if(!(options && options.layerOptions && options.layerOptions.styleMap)) {
    //         this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style['default'], {});
    //     }

    //     OpenLayers.Handler.Drag.prototype.initialize.apply(this,
    //                                             [control, callbacks, options]);
    //     this.options = (options) ? options : {};
    // },
    
    /**
     * APIMethod: setOptions
     * 
     * Parameters:
     * newOptions - {Object} 
     */
    // setOptions: function (newOptions) {
    //     OpenLayers.Util.extend(this.options, newOptions);
    //     OpenLayers.Util.extend(this, newOptions);
    // },
    
    /**
     * APIMethod: activate
     * Turn on the handler.
     *
     * Returns:
     * {Boolean} The handler was successfully activated
     */
    // activate: function() {
    //     var activated = false;
    //     if(OpenLayers.Handler.Drag.prototype.activate.apply(this, arguments)) {
    //         // create temporary vector layer for rendering geometry sketch
    //         var options = OpenLayers.Util.extend({
    //             displayInLayerSwitcher: false,
    //             // indicate that the temp vector layer will never be out of range
    //             // without this, resolution properties must be specified at the
    //             // map-level for this temporary layer to init its resolutions
    //             // correctly
    //             calculateInRange: OpenLayers.Function.True,
    //             wrapDateLine: this.citeCompliant
    //         }, this.layerOptions);
    //         this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
    //         this.map.addLayer(this.layer);
    //         activated = true;
    //     }
    //     return activated;
    // },

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
    // down: function(evt) {
    //     this.fixedRadius = !!(this.radius);
    //     var maploc = this.layer.getLonLatFromViewPortPx(evt.xy); 
    //     this.origin = new OpenLayers.Geometry.Point(maploc.lon, maploc.lat);
    //     // create the new polygon
    //     if(!this.fixedRadius || this.irregular) {
    //         // smallest radius should not be less one pixel in map units
    //         // VML doesn't behave well with smaller
    //         this.radius = this.map.getResolution();
    //     }
    //     if(this.persist) {
    //         this.clear();
    //     }
    //     this.feature = new OpenLayers.Feature.Vector();
    //     this.createGeometry();
    //     this.callback("create", [this.origin, this.feature]);
    //     this.layer.addFeatures([this.feature], {silent: true});
    //     this.layer.drawFeature(this.feature, this.style);
    // },
    
    /**
     * Method: move
     * Respond to drag move events
     *
     * Parameters:
     * evt - {Evt} The move event
     */
    // move: function(evt) {
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
    // },

    /**
     * Method: up
     * Finish drawing the feature
     *
     * Parameters:
     * evt - {Event} The mouse up event
     */
    // up: function(evt) {
    //     this.finalize();
    //     // the mouseup method of superclass doesn't call the
    //     // "done" callback if there's been no move between
    //     // down and up
    //     if (this.start == this.last) {
    //         this.callback("done", [evt.xy]);
    //     }
    // },

    /**
     * Method: out
     * Finish drawing the feature.
     *
     * Parameters:
     * evt - {Event} The mouse out event
     */
    // out: function(evt) {
    //     this.finalize();
    // },

    /**
     * Method: createGeometry
     * Create the new polygon geometry.  This is called at the start of the
     *     drag and at any point during the drag if the number of sides
     *     changes.
     */
    // createGeometry: function() {
    //     this.angle = Math.PI * ((1/this.sides) - (1/2));
    //     if(this.snapAngle) {
    //         this.angle += this.snapAngle * (Math.PI / 180);
    //     }
    //     this.feature.geometry = OpenLayers.Geometry.Polygon.createRegularPolygon(
    //         this.origin, this.radius, this.sides, this.snapAngle
    //     );
    // },
    
    /**
     * Method: modifyGeometry
     * Modify the polygon geometry in place.
     */
    // modifyGeometry: function() {
    //     var angle, point;
    //     var ring = this.feature.geometry.components[0];
    //     // if the number of sides ever changes, create a new geometry
    //     if(ring.components.length != (this.sides + 1)) {
    //         this.createGeometry();
    //         ring = this.feature.geometry.components[0];
    //     }
    //     for(var i=0; i<this.sides; ++i) {
    //         point = ring.components[i];
    //         angle = this.angle + (i * 2 * Math.PI / this.sides);
    //         point.x = this.origin.x + (this.radius * Math.cos(angle));
    //         point.y = this.origin.y + (this.radius * Math.sin(angle));
    //         point.clearBounds();
    //     }
    // },
    
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
    // cancel: function() {
    //     // the polygon geometry gets cloned in the callback method
    //     this.callback("cancel", null);
    //     this.finalize();
    // },

    /**
     * Method: finalize
     * Finish the geometry and call the "done" callback.
     */
    // finalize: function() {
    //     this.origin = null;
    //     this.radius = this.options.radius;
    // },

    /**
     * APIMethod: clear
     * Clear any rendered features on the temporary layer.  This is called
     *     when the handler is deactivated, canceled, or done (unless persist
     *     is true).
     */
    // clear: function() {
    //     if (this.layer) {
    //         this.layer.renderer.clear();
    //         this.layer.destroyFeatures();
    //     }
    // },
    
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
