# Image Converter API

This repository provides a simple Express server for converting image formats using Sharp. The server allows users to upload an image and convert it to a desired format (jpeg, png, webp) via an HTTP endpoint.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Code Flow](#code-flow)
- [How to Use](#how-to-use)
- [Example Request](#example-request)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/image-converter-api.git
   cd image-converter-api
    ```

2. **Install the dependencies:**

    ```sh
    npm install
    ```

## Usage

To start the server, run:

    ```sh
    npm run dev
    ```

The server will start and listen on port 3000 by default. You can access it at http://localhost:3000.

## Code Flow

1. **Server Setup:**

- An Express server is created and configured to listen on port 3000.
- Multer is configured to handle file uploads, storing them temporarily in the OS temp directory.
- The uploads directory is created if it doesn't already exist.

2. **Route for Image Conversion:**

- The /convert endpoint is set up to accept image uploads.
- The desired format for the image conversion is taken from the request body.
- Sharp processes the uploaded image and converts it to the specified format.
- The converted image is saved to the uploads directory.
- The server responds with the converted image file and cleans up temporary files.

## How to Use

1. **Send a Request to Convert an Image:**

Use an HTTP client like `Postman` or `curl` to send a `POST` request to `http://localhost:3000/convert` with the image file and the desired format.

Example using curl:

    ```sh
    curl -F "image=@path_to_your_image_file" -F "format=jpeg" "http://localhost:3000/convert"
    ```

Replace `path_to_your_image_file` with the path to your image file and `jpeg` with the desired format (`jpeg`, `png`, `webp`).

## Example Request
To convert an image to PNG format:

    ```sh
    curl -F "image=@/path/to/image.jpg" -F "format=png" "http://localhost:3000/convert"
    ```
This will return the converted image as a downloadable file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.