module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/testanalyzer/" : "/my/",
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  pluginOptions: {
    i18n: {
      locale: "de",
      fallbackLocale: "de",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  transpileDependencies: ["vuetify"]
};
