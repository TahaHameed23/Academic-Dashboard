import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
    
    //const distributionUrl = "https://d245zut7f3nyri.cloudfront.net/user-upload"
    const cmd = new GetObjectCommand({
        Bucket: "att-s3-dev",
        Key: key,
    });
    return getSignedUrl(s3Client,cmd);

    // const url = getSignedUrl({
    //     url:`${distributionUrl}/${encodeURI(key)}`,
    //     dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    //     privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    //     keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
    // TODO: to use cf, change `getSignedUrl` import   

    // })
    return url;
}

export async function putObject(filename, body, contentType) {
    const cmnd = new PutObjectCommand({
        Bucket: "att-s3-dev",
        Key: `user-upload/${filename}`,
        Body: body,
        ContentType: contentType,
    });

    const res = await s3Client.send(cmnd);  
    //const url = await getSignedUrl(s3Client, cmnd);
    //return url;
}

async function init() {

    //console.log("URL: ", await getObjectURL("user-upload/image_e@e_1701494948.jpeg"));
    //console.log("URL for upload: ",await putObject(`image-${Date.now()}.jpeg`));
}

init();