module.exports = {
  transpileDependencies: ["quasar"],

  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: true,
    },
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/quasar.scss";`,
      },
    },
  },
};
