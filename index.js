const sharp = require("sharp");
const express = require("express");
const http = require("http");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const os = require("os");

const app = express();
const server = http.createServer(app);

// Set up multer for handling file uploads
const upload = multer({ dest: os.tmpdir() });

const uploadsDir = path.join(__dirname, "uploads");

// Ensure the uploads directory exists
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Route for converting image format
app.post("/convert", upload.single("image"), async (req, res) => {
  const format = req.body.format; // Get desired format from request body
  const filePath = req.file.path; // Path to the uploaded image
  const outputFileName = `output.${format}`; // Output file name based on desired format
  const outputFilePath = path.join(uploadsDir, outputFileName);

  try {
    let transformer = sharp(filePath);

    switch (format) {
      case "jpeg":
        transformer = transformer.jpeg();
        break;
      case "png":
        transformer = transformer.png();
        break;
      case "webp":
        transformer = transformer.webp();
        break;
      default:
        return res
          .status(400)
          .send("Unsupported format. Supported formats are jpeg, png, webp.");
    }

    await transformer.toFile(outputFilePath);

    res.download(outputFilePath, outputFileName, async (err) => {
      if (err) {
        console.error(err);
      }

      // Clean up files after response
      try {
        await fs.unlink(outputFilePath); // Optionally clean up the output file
      } catch (cleanupErr) {
        console.error("Error during cleanup:", cleanupErr);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the image.");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
