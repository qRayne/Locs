module.exports = {
    project: {
      ios: {},
      android: {}, // grouped into "project"
    },
    assets: ["./assets/fonts"], // stays the same
    transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles']
    }
  };