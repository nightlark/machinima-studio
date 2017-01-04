/* eslint-disable no-console */
'use strict';

const gw2          = require(__dirname + '/src/initialize.js');
const offsets      = require(__dirname + '/src/offsets.js');

/**
 * Start by trying to find the correct GW2 process
 * Terminates with an error if no process is found
 */
gw2(function(err, process, module, memory) {
  if (err) {
    throw new Error(err);
  }

  /* eslint-disable no-extend-native */
  String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length) {
      str = padString + str;
    }
    return str;
  };

  var interpretAsPTRBuffer = new Buffer(0x4);
  const pointerFound = (descriptor, ptr, substract, add, interpretAsPTR, offsetAdjustement) => {
    if (ptr) {
      var base = ptr[0] - module;
      if (substract) {
        base = base - substract;
      }
      if (add) {
        base = base + add;
      }
      if (interpretAsPTR) {
        memory.readData(module + base, interpretAsPTRBuffer, 0x4);
        base = interpretAsPTRBuffer.readInt32LE() - module;
      }
      if (offsetAdjustement) {
        base += offsetAdjustement;
      }
      console.log(descriptor, '0x' + (base).toString(16).toUpperCase().lpad('0', 8));
    } else {
      console.log(descriptor, 'ptr base not found');
    }
  };

  const findPattern = (pattern) => {
      return memory.find(pattern, 0, -1, 1, "-x");
  }

  const findStringRef = (str) => {
      var searchPattern = Buffer.from(str).toString('hex');
      var results = memory.find(searchPattern, 0, -1, 1, '--');

      if (results.length > 0)
      {
          results = memory.find(results[0].toString(16).lpad('0', 8).match(/[a-fA-F0-9]{2}/g).reverse().join(''), 0, -1, 1, '-x');
      }

      return results;
  };

  let pattern;

	/**
  * Debug related pointers
  * @type {String}
  */
  pattern = offsets.debug.original;
  pointerFound('offsets.debug.original', findPattern(pattern), 0, 22, true, module - 1104);

  /**
  * Animation related pointers
  * @type {String}
  */
  pattern = offsets.advancedView.animation.original.toString('hex');
  pointerFound('offsets.advancedView.animation.original', findPattern(pattern), 5, -0x450);

  /**
  * Agent related pointers
  * @type {String}
  */
  pattern = offsets.agent.highlight_effect.original.toString('hex');
  pointerFound('offsets.agent.highlight_effect.original', findPattern(pattern));

  /**
  * Camera related pointers
  * @type {String}
  */

  pattern = offsets.camera.original.toString('hex');
  pointerFound('offsets.camera.original', findPattern(pattern), 0, 0x45, true);

  pattern = offsets.camera.instructions.patch_1.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_1.original', findPattern(pattern));
  pattern = offsets.camera.instructions.patch_2.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_2.original', findPattern(pattern));
  pattern = offsets.camera.instructions.patch_3.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_3.original', findPattern(pattern));
  pattern = offsets.camera.instructions.patch_4.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_4.original', findPattern(pattern));
  pattern = offsets.camera.instructions.patch_5.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_5.original', findPattern(pattern));
  pattern = offsets.camera.instructions.patch_6.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_6.original', findPattern(pattern));
  pattern = offsets.camera.instructions.patch_7.original.toString('hex');
  pointerFound('offsets.camera.instructions.patch_7.original', findPattern(pattern));

  /**
  * Player related offsets
  * @type {String}
  */
  pattern = offsets.player.original.toString('hex');
  pointerFound('offsets.player.original', findPattern(pattern));

  /**
  * Environment related offsets
  * @type {String}
  */
  pointerFound('offsets.environment.fog.original', findStringRef("s_dxContext"), 0, 10, true);

  /**
  * Movement related offsets
  * @type {String}
  */
  pattern = offsets.player.movement.original.toString('hex');
  pointerFound('offsets.player.movement.original',  findPattern(pattern), 10);

  /**
  * Time of day related offsets
  * @type {String}
  */
  pattern = offsets.environment.timeOfDayOriginal.toString('hex');
  pointerFound('offsets.environment.timeOfDayOriginal', findPattern(pattern), 5);

  /**
  * Map rendering functions offsets
  * @type {String}
  */
  pattern = offsets.environment.rendering.audio.original.toString('hex');
  pointerFound('offsets.environment.rendering.audio', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.blocks.original.toString('hex');
  pointerFound('offsets.environment.rendering.blocks', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.decal.original.toString('hex');
  pointerFound('offsets.environment.rendering.decal', findPattern(pattern), 0x2A);
  pattern = offsets.environment.rendering.environment.original.toString('hex');
  pointerFound('offsets.environment.rendering.environment', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.river.original.toString('hex');
  pointerFound('offsets.environment.rendering.river', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.under_water.original.toString('hex');
  pointerFound('offsets.environment.rendering.under_water', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.zone.original.toString('hex');
  pointerFound('offsets.environment.rendering.zone', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.lights.original.toString('hex');
  pointerFound('offsets.environment.rendering.lights', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.shadows.original.toString('hex');
  pointerFound('offsets.environment.rendering.shadows', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.terrain.original.toString('hex');
  pointerFound('offsets.environment.rendering.terrain', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.cube_map.original.toString('hex');
  pointerFound('offsets.environment.rendering.cube_map', findPattern(pattern), 5);
  pattern = offsets.environment.rendering.props.original.toString('hex');
  pointerFound('offsets.environment.rendering.props', findPattern(pattern), 5);
});
