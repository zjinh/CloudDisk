let WinReg = require('winreg');
let startOnBoot = {
    enableAutoStart: function (name, file, callback) {
        let key = getKey();
        key.set(name, WinReg.REG_SZ, file, callback || noop)
    },
    disableAutoStart: function (name, callback) {
        let key = getKey();
        key.remove(name, callback || noop)
    },
    getAutoStartValue: function (name, callback) {
        let key = getKey();
        key.get(name, function (error, result) {
            if (result) {
                callback(null, result.value)
            } else {
                callback(error)
            }
        })
    }
};

let RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';

function getKey() {
    return new WinReg({
        hive: WinReg.HKCU, // CurrentUser,
        key: RUN_LOCATION
    })
}

function noop() {
}

module.exports = startOnBoot;