const path = require("path");
const { defineConfig } = require("@vue/cli-service");
// momentjs语言包
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
// 多线程压缩
const HappyPack = require("happypack");
const os = require("os");
// 开辟一个线程池，拿到系统CPU的核数，happypack 将编译工作利用所有线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// Gzip压缩
const CompressionPlugin = require("compression-webpack-plugin");
// elementplus 按需引入
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/style/base.less")],
    },
  },
  configureWebpack: (config) => {
    // 去console.log;
    // config.optimization.minimizer("terser").tap((args) => {
    //   args[0].terserOptions.compress.drop_console = true;
    //   return args;
    // });
    // 不是开发环境时生效
    if (process.env.NODE_ENV !== "development") {
      config["performance"] = {
        // 警告 webpack 的性能提示
        hints: "warning",
        // 入口起点的最大体积
        maxEntrypointSize: 50000000,
        // 生成文件的最大体积
        maxAssetSize: 30000000,
        // 只给出 js 文件的性能提示
        assetFilter: (assetFilename) => {
          assetFilename.endsWith(".vue") || assetFilename.endsWith(".js");
        },
      };
    }
    return {
      externals: {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
      },
      plugins: [
        new MomentLocalesPlugin({ localesToKeep: ["zh-cn"] }),
        new HappyPack({
          id: "happybabel",
          loaders: ["babel-loader"],
          threadPool: happyThreadPool,
        }),
        new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
          threshold: 1024, //文件大小大于这个值时启用压缩
          deleteOriginalAssets: false, //压缩后保留原文件
        }),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
    };
  },
  // disable source map in production
  productionSourceMap: false,
});
