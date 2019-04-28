export var appMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "新建",
        accelerator: "CmdOrCtrl+N",
        click(item, window) {
          if (window) {
            window.webContents.send("action", "newFile");
          }
        }
      },
      {
        label: "打开文件...",
        accelerator: "CmdOrCtrl+O",
        click(item, window) {
          if (window) {
            window.webContents.send("action", "open");
          }
        }
      },
      {
        label: "保存",
        accelerator: "CmdOrCtrl+S",
        click(item, window) {
          if (window) {
            window.webContents.send("action", "save");
          }
        }
      },
      {
        label: "另存为...",
        accelerator: "CmdOrCtrl+A",
        click(item, window) {
          if (window) {
            window.webContents.send("action", "saveAs");
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
