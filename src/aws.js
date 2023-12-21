import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv"
dotenv.config()

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
})


export async function getObjectURL(key) {

    //     const cmd = new GetObjectCommand({
    //         Bucket: "att-s3-dev",
    //         Key: key,
    //     });
    //     return getSignedUrl(s3Client, cmd);
    // }
    //TODO: to use cf, change `getSignedUrl` import   

    const url = getSignedUrl({
        url: `${process.env.CLOUDFRONT_DISTRIBUTION_URL}${encodeURI(key)}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID

    })
    return url;
}

export async function putObject(filename, body, contentType) {
    const cmnd = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: body,
        ContentType: contentType,
        ContentDisposition: "inline"
    });

    const res = await s3Client.send(cmnd);
    //const url = await getSignedUrl(s3Client, cmnd);
    //return url;
}


export async function getAllObjects(req, res, next) {
    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        MaxKeys: 2,
        Name: "resources/",
        Prefix: "resources/"
    });
    try {
        let isTruncated = true;
        let contents = "";
        let ObjectKey = [];
        while (isTruncated) {
            const { Contents, IsTruncated, NextContinuationToken } =
                await s3Client.send(command);
            const contentsList = Contents.map((c) => `${c.Key}`).join("\n");
            contents += contentsList + "\n";
            isTruncated = IsTruncated;
            command.input.ContinuationToken = NextContinuationToken;
            Contents.forEach(obj => {
                ObjectKey.push(obj.Key);
            })
        }
        req.objs = ObjectKey;
        next();

    } catch (err) {
        console.error(err);
    }

}
