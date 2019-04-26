export var appMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "打开文件...",
        accelerator: "CmdOrCtrl+O",
        click(item, window) {
          if (window) {
            // eslint-disable-next-line no-console
            console.log(window);
            window.webContents.send("action", "open");
          }
        }
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      {
        role: "undo"
      },
      {
        role: "redo"
      },
      {
        type: "separator"
      },
      {
        role: "cut"
      },
      {
        role: "copy"
      },
      {
        role: "paste"
      },
      {
        role: "pasteandmatchstyle"
      },
      {
        role: "delete"
      },
      {
        role: "selectall"
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        role: "reload"
      },
      {
        role: "forcereload"
      },
      {
        role: "toggledevtools"
      },
      {
        type: "separator"
      },
      {
        role: "resetzoom"
      },
      {
        role: "zoomin"
      },
      {
        role: "zoomout"
      },
      {
        type: "separator"
      },
      {
        role: "togglefullscreen"
      }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Home Page",
        click() {
          //require("electron").shell.openExternal("http://");
        }
      }
    ]
  }
];
