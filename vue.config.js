module.exports = {
  pluginOptions: {
    electronBuilder: {
      productName: "RainMaker",
      builderOptions: {
        appId: "jinghui70.RainMaker",
        mac: {
          icon: "build/icons/icon.icns"
        },
        win: {
          icon: "build/icons/icon.ico"
        },
        linux: {
          icon: "build/icons/icon.png"
        }
      }
    },
    i18n: {
      locale: "zh-CN",
      fallbackLocale: "zh-CN",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
