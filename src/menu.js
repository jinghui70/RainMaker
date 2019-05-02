const click = function(item, window) {
  if (window) {
    window.webContents.send("action", item.action);
  }
};

export var appMenuTemplate = [
  {
    label: "文件",
    submenu: [
      { label: "新建", accelerator: "CmdOrCtrl+N", action: "newFile", click },
      { label: "打开文件...", accelerator: "CmdOrCtrl+O", action: "open", click },
      { label: "保存", accelerator: "CmdOrCtrl+S", action: "save", click },
      { label: "另存为...", accelerator: "CmdOrCtrl+A", action: "saveAs", click },
      { type: "separator" },
      { label: "退出", role: "quit" }
    ]
  },
  {
    label: "编辑",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" }
    ]
  },
  {
    label: "显示",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    role: "help",
    submenu: [{ label: "关于", action: "about", click }]
  }
];
