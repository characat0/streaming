const AWS = require("aws-sdk");
const { awsConfig } = require("./config");
AWS.config = new AWS.Config({
    accessKeyId: awsConfig.accessKey,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});
module.exports = new AWS.S3();