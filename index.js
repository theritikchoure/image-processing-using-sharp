///////////////////////////////////////////////////////////////////////////////////////////////////////
const sharp = require("sharp"); // Importing Sharp module for image processing
const express = require("express"); // Importing Express framework for creating server
const http = require("http"); // Importing HTTP module to create HTTP server
const multer = require("multer"); // Importing Multer for handling file uploads
const path = require("path"); // Importing Path module for working with file paths
const fs = require("fs").promises; // Importing File System module with promises
const os = require("os"); // Importing OS module for working with operating system paths
///////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////
const app = express(); // Creating an Express application
const server = http.createServer(app); // Creating an HTTP server using Express
///////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////
// Set up multer for handling file uploads
const upload = multer({ dest: os.tmpdir() });

// Define the uploads directory path
const uploadsDir = path.join(__dirname, "uploads");
///////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Ensure the uploads directory exists; create if it doesn't
fs.mkdir(uploadsDir, { recursive: true })
  .then(() => {
    console.log(`Uploads directory created at ${uploadsDir}`);
  })
  .catch((err) => {
    console.error(`Error creating uploads directory: ${err}`);
  });
///////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////
// Route for converting image format
app.post("/convert", upload.single("image"), async (req, res) => {
  const format = req.body.format; // Get desired format from request body
  const filePath = req.file.path; // Path to the uploaded image
  const outputFileName = `output.${format}`; // Output file name based on desired format
  const outputFilePath = path.join(uploadsDir, outputFileName); // Path for saving converted image

  try {
    let transformer = sharp(filePath); // Initialize Sharp transformer with uploaded image

    // Configure Sharp based on desired output format
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
        // If format is unsupported, send a 400 Bad Request response
        return res
          .status(400)
          .send("Unsupported format. Supported formats are jpeg, png, webp.");
    }

    // Process the image and save it to the specified output file path
    await transformer.toFile(outputFilePath);

    // Send the converted image as a downloadable file
    res.download(outputFilePath, outputFileName, async (err) => {
      if (err) {
        console.error("Download error:", err);
      }

      // Clean up: Delete the output file after it has been sent
      try {
        await fs.unlink(outputFilePath);
        console.log(`Deleted output file: ${outputFilePath}`);
      } catch (cleanupErr) {
        console.error("Error during cleanup:", cleanupErr);
      }
    });
  } catch (error) {
    // Catch and handle any errors that occur during image processing
    console.error("Image processing error:", error);
    res.status(500).send("An error occurred while processing the image.");
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Start the HTTP server and listen on port 3000
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
