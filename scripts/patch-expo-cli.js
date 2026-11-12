/**
 * Patch for @expo/cli to support Xcode 27+ / macOS DeviceHub Simulators
 *
 * In Xcode 27, Apple redesigned the Simulator into DeviceHub.app and mounts runtimes
 * via cryptexd. This script adapts @expo/cli to recognize booted devices seamlessly.
 */

const fs = require('fs');
const path = require('path');

const targetPrerequisite = path.join(
  __dirname,
  '../node_modules/@expo/cli/build/src/start/doctor/apple/SimulatorAppPrerequisite.js'
);

const targetRunning = path.join(
  __dirname,
  '../node_modules/@expo/cli/build/src/start/platforms/ios/ensureSimulatorAppRunning.js'
);

const targetSimctl = path.join(
  __dirname,
  '../node_modules/@expo/cli/build/src/start/platforms/ios/simctl.js'
);

const targetBestSim = path.join(
  __dirname,
  '../node_modules/@expo/cli/build/src/start/platforms/ios/getBestSimulator.js'
);

const targetDeviceMgr = path.join(
  __dirname,
  '../node_modules/@expo/cli/build/src/start/platforms/ios/AppleDeviceManager.js'
);

function patchFile(filePath, searchStr, replaceStr) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(replaceStr)) return; // Already patched
  if (content.includes(searchStr)) {
    const updated = content.replace(searchStr, replaceStr);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`[KineticFit Setup] Patched ${path.basename(filePath)} for Xcode 27 compatibility.`);
  }
}

// 1. SimulatorAppPrerequisite fallback
patchFile(
  targetPrerequisite,
  'async function getSimulatorAppIdAsync() {\n    try {\n        return (await (0, _osascript().execAsync)(\'id of app "Simulator"\')).trim();\n    } catch  {\n    // This error may occur in CI where the users intends to install just the simulators but no Xcode.\n    }\n    return null;\n}',
  'async function getSimulatorAppIdAsync() {\n    try {\n        return (await (0, _osascript().execAsync)(\'id of app "Simulator"\')).trim();\n    } catch  {\n        return "com.apple.CoreSimulator.SimulatorTrampoline";\n    }\n}'
);

// 2. ensureSimulatorAppRunning
patchFile(
  targetRunning,
  'async function isSimulatorAppRunningAsync() {\n    try {\n        const zeroMeansNo = (await _osascript().execAsync(\'tell app "System Events" to count processes whose name is "Simulator"\')).trim();\n        if (zeroMeansNo === "0") {\n            return false;\n        }\n    } catch (error) {\n        if (error.message.includes("Application isn’t running")) {\n            return false;\n        }\n        throw error;\n    }\n    return true;\n}',
  'async function isSimulatorAppRunningAsync() {\n    return true;\n}'
);

// 3. simctl JSON parsing banner strip
patchFile(
  targetSimctl,
  'function parseSimControlJSONResults(input) {\n    try {\n        return JSON.parse(input);',
  'function parseSimControlJSONResults(input) {\n    try {\n        const jsonStart = input.indexOf(\'{\');\n        if (jsonStart !== -1) {\n            return JSON.parse(input.slice(jsonStart));\n        }\n        return JSON.parse(input);'
);

// 4. getBestSimulator selectable check
patchFile(
  targetBestSim,
  'return simulators.filter((device)=>device.isAvailable && device.osType === osType);',
  'return simulators.filter((device)=>(device.isAvailable || device.state === "Booted") && (device.osType === osType || !device.osType));'
);

// 5. AppleDeviceManager activateWindowAsync
patchFile(
  targetDeviceMgr,
  'await _osascript().execAsync(`tell application "Simulator" to activate`);',
  'try {\n            await _osascript().execAsync(`tell application "Simulator" to activate`);\n        } catch {\n            try {\n                await _osascript().execAsync(`tell application "Xcode" to activate`);\n            } catch {}\n        }'
);
