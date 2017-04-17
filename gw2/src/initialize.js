var robot   = require('robot-js');
var offsets = require('./offsets');

var Memory  = robot.Memory;
var Window  = robot.Window;

module.exports = (cb) => {

  let memory;
  let process;
  let module;
  let window;

  /*
   * Resolves the given multi level pointer to
   * the correct offset of the memory
   */
  const readMultiLevelPtr = function(offsets) {
    var address = module + Number(offsets[0]);
    for (var i = 1; i < offsets.length; i++) {
      address = memory.readPtr(address);
      address += offsets[i];
    }
    return address;
  };

  function selectByWindow(wind) {
    // Check if arguments are correct
    if (!(wind instanceof Window)) {
      throw new TypeError('Invalid arguments');
    }

    // Check if the window title correctly matches
    if (wind.getTitle() !== offsets.WINDOW_NAME) {
      return false;
    }

    process = wind.getProcess();
    // Ensure that the process was opened
    if (!process.isValid()) return false;
    /* eslint-disable quotes, no-useless-escape */
    module = process.getModules(".*\.exe")[0];
    if (!module) return false;
    module = module.getBase();

    // Determine if game is 64Bit
    let is64Bit = process.is64Bit();

    if (is64Bit) {
      return cb(new Error('64bit process is not supported at the moment'));
    }

    // Create a new memory object
    memory = Memory(process);
    memory.readMultiLevelPtr = readMultiLevelPtr;
    window = wind;
    return true;
  }

  for (let w of Window.getList(offsets.WINDOW_NAME)) {
    if (selectByWindow(w)) {
      return cb(null, process, module, memory, w);
    }
  }

  return cb(new Error('Cannot find "' + offsets.WINDOW_NAME + '" window'));
};
