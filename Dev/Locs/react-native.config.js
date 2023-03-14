module.exports = {
    project: {
      ios: {},
      android: {}, // grouped into "project"
    },
    assets: ["./assets/fonts/"], // stays the same,
    JWT_SECRET: process.env.JWT_SECRET || 'secretkey'
  };