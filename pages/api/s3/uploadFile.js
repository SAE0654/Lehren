import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "v4"
});

export default async (req, res) => {
  if (req.method === "DELETE") {
    let { name, type } = req.body;
    const params = {
      Bucket: "sae-files",
      Key: name
    }

    try {
      await s3.headObject(params).promise()
      
      console.log("File Found in S3")
      try {
        await s3.deleteObject(params).promise()
        console.log("file deleted Successfully")
      }
      catch (err) {
        console.log("ERROR in file Deleting : " + JSON.stringify(err))
      }
    } catch (err) {
      console.log(req.body)
      console.log("File not Found ERROR : " + err.code)
    }
    return res.status(500).json({ message: "Internal server error" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { name, type } = req.body;

    const fileParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ url });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb"
    }
  }
}
