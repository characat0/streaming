exports.port = process.env.PORT;
exports.streamPostRoute = process.env.STREAMROUTE;
exports.streamApiKey = process.env.STREAMKEY;
exports.awsConfig = {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3: {
        bucketName: process.env.AWS_S3_BUCKET_NAME
    }
};
exports.saveVideo = parseInt(process.env.SAVE_VIDEO);