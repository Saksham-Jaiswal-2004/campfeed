import cloudinary from "@/lib/cloudinary";

const allowedFolders = ["announcements", "events", "issues"];

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const folder = formData.get("folder");

    let transformOptions;

    if (folder === "events") {
      transformOptions = [
        { width: 1920, height: 800, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ];
    } else {
      transformOptions = [
        { width: 1920, height: 1920, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ];
    }

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!allowedFolders.includes(folder)) {
      return Response.json({ error: "Invalid folder" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `campfeed/${folder}`,
          resource_type: "image",

          transformation: transformOptions
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    return Response.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}