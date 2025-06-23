const serverlessExpress = require("@vendia/serverless-express");
const app = require("../server");

module.exports.handler = serverlessExpress({ app });
