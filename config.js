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
exports.database = {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    timezone: process.env.DATABASE_TIMEZONE,
    host: process.env.DATABASE_HOSTNAME,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    benchmark: true,
    pool: {
        acquire: parseInt(process.env.DATABASE_ACQUIRE_TIME),
        max: parseInt(process.env.DATABASE_MAX_CONNECTION),
        min: parseInt(process.env.DATABASE_MIN_CONNECTION),
        idle: parseInt(process.env.DATABASE_IDLE_TIME),
        evict: parseInt(process.env.DATABASE_EVICT_TIME)
    }

};
exports.sessionSecret = process.env.SESSION_SECRET;
exports.saveVideo = parseInt(process.env.SAVE_VIDEO);