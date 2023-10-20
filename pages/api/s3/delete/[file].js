import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "v4"
});

export default async (req, res) => {
  if (req.method === "DELETE") {
    let { file } = req.query;
    const params = {
      Bucket: "sae-files",
      Key: file
    }

    try {
      await s3.headObject(params).promise(); // Busca y encuentra el archivo
      try {
        await s3.deleteObject(params).promise()
        return res.status(200).json({message: "Archivo borrado con éxito"});
      }
      catch (err) {
        return res.status(500).json({ message: "Error al borrar este archivo" });
      }
    } catch (err) {
      console.log("File not Found ERROR : " + err.code)
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb"
    }
  }
}