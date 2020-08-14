const ipc = require("electron").ipcRenderer;
var term = new Terminal();
term.open(document.getElementById('terminal'));

ipc.on("terminal.incomingData", (event, data) => {
    term.write(data);
});

term.onData(e => {
    ipc.send("terminal.keystroke", e);
});