const {app, BrowserWindow, ipcMain} = require("electron");
const pty = require("node-pty");
const os = require("os");
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 450,
        width: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on("closed", function() {
        mainWindow = null;
    });


    //ipcing

    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.on('data', function(data) {
        mainWindow.webContents.send("terminal.incomingData", data);
        console.log("Data sent");
    });
    ipcMain.on("terminal.keystroke", (event, key) => {
        ptyProcess.write(key);
    });




}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow === null) {
        createWindow();
    }
});