import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.EXPO_PUBLIC_AWS_BUCKET_NAME!

export async function uploadToS3(file: File, key: string) {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: file.type,
      },
    })

    await upload.done()
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw error
  }
}

export async function getSignedS3Url(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  } catch (error) {
    console.error("Error getting signed URL:", error)
    throw error
  }
}

