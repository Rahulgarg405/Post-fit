import React, { useState } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const socialMediaSizes = [
  {
    label: "Instagram Post (1080x1080)",
    value: { name: "Instagram Post", width: 1080, height: 1080 },
  },
  {
    label: "Instagram Story (1080x1920)",
    value: { name: "Instagram Story", width: 1080, height: 1920 },
  },

  {
    label: "Facebook Post (1200x630)",
    value: { name: "Facebook Post", width: 1200, height: 630 },
  },
  {
    label: "Facebook Cover (820x312)",
    value: { name: "Facebook Cover", width: 820, height: 312 },
  },
  {
    label: "Facebook Profile (180x180)",
    value: { name: "Facebook Profile", width: 180, height: 180 },
  },
  {
    label: "Facebook Story (1080x1920)",
    value: { name: "Facebook Story", width: 1080, height: 1920 },
  },

  {
    label: "Twitter Post (1600x900)",
    value: { name: "Twitter Post", width: 1600, height: 900 },
  },
  {
    label: "Twitter Profile (400x400)",
    value: { name: "Twitter Profile", width: 400, height: 400 },
  },
  {
    label: "Twitter Header (1500x500)",
    value: { name: "Twitter Header", width: 1500, height: 500 },
  },

  {
    label: "LinkedIn Post (1200x627)",
    value: { name: "LinkedIn Post", width: 1200, height: 627 },
  },
  {
    label: "LinkedIn Profile (400x400)",
    value: { name: "LinkedIn Profile", width: 400, height: 400 },
  },
  {
    label: "LinkedIn Cover (1584x396)",
    value: { name: "LinkedIn Cover", width: 1584, height: 396 },
  },

  {
    label: "YouTube Thumbnail (1280x720)",
    value: { name: "YouTube Thumbnail", width: 1280, height: 720 },
  },
  {
    label: "YouTube Profile (800x800)",
    value: { name: "YouTube Profile", width: 800, height: 800 },
  },
  {
    label: "YouTube Banner (2560x1440)",
    value: { name: "YouTube Banner", width: 2560, height: 1440 },
  },

  {
    label: "SnapChat Story (1080x1920)",
    value: { name: "Snapchat Story", width: 1080, height: 1920 },
  },

  {
    label: "Threads Post (1080x1350)",
    value: { name: "Threads Post", width: 1080, height: 1350 },
  },

  // Generic Sizes
  {
    label: "Square (1:1)(1080x1080)",
    value: { name: "Square (1:1)", width: 1080, height: 1080 },
  },
  {
    label: "Portrait (4:5)(1080x1350)",
    value: { name: "Portrait (4:5)", width: 1080, height: 1350 },
  },
  {
    label: "Landscape (16:9) (1920x1080)",
    value: { name: "Landscape (16:9)", width: 1920, height: 1080 },
  },
  {
    label: "Banner (3:1) (1500x500)",
    value: { name: "Banner (3:1)", width: 1500, height: 500 },
  },
];

const App = () => {
  const [image, setImage] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectionChange = (selectedOptions) => {
    setSelectedSizes(selectedOptions.map((option) => option.value)); // Store selected sizes
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImage(reader.result);
  };

  const processImage = () => {
    if (!image) return alert("Please upload an image first!");

    const img = new Image();
    img.src = image;

    img.onload = () => {
      // Ensure the image is fully loaded before processing
      console.log("Image loaded successfully");

      const links = selectedSizes.map(({ name, width, height }) => {
        const croppedCanvas = cropToAspectRatio(img, width, height);
        const resizedCanvas = resizeCanvas(croppedCanvas, width, height);
        return createDownloadLink(resizedCanvas, name);
      });

      Promise.all(links).then((results) => setDownloadLinks(results));
    };

    img.onerror = () => alert("Failed to load the image. Try a different one.");
  };

  // Crop image to maintain aspect ratio
  const cropToAspectRatio = (img, targetWidth, targetHeight) => {
    const originalRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    // Create a canvas with the final size
    const paddedCanvas = document.createElement("canvas");
    paddedCanvas.width = targetWidth;
    paddedCanvas.height = targetHeight;
    const ctx = paddedCanvas.getContext("2d");

    // Set background color (optional, default is transparent)
    ctx.fillStyle = "#ffffff"; // Change this for a different background
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    let drawWidth, drawHeight, offsetX, offsetY;

    if (originalRatio > targetRatio) {
      // Image is wider, fit by width
      drawWidth = targetWidth;
      drawHeight = targetWidth / originalRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2; // Center vertically
    } else {
      // Image is taller, fit by height
      drawHeight = targetHeight;
      drawWidth = targetHeight * originalRatio;
      offsetX = (targetWidth - drawWidth) / 2; // Center horizontally
      offsetY = 0;
    }

    // Draw the image in the center without cutting
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    return paddedCanvas;
  };

  // Resize image smoothly
  const resizeCanvas = (croppedCanvas, targetWidth, targetHeight) => {
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;
    const ctx = resizedCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(croppedCanvas, 0, 0, targetWidth, targetHeight);

    return resizedCanvas;
  };

  // Create a download link
  const createDownloadLink = (canvas, name) => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const link = URL.createObjectURL(blob);
          resolve({ name, link });
        },
        "image/jpeg",
        0.9
      );
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-200 min-h-screen font-mono w-full">
      <div className="flex items-center justify-between">
        <div className="absolute top-4 left-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition cursor-pointer transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            About
          </button>
        </div>

        <div className="absolute top-4 right-6 flex gap-4">
          <a
            href="https://github.com/Rahulgarg405"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-black text-3xl cursor-pointer" />
          </a>
          <a
            href="https://www.linkedin.com/in/rahul-garg-210778257"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />
          </a>
        </div>
      </div>
      <div className="text-center mb-12 lg:mt-0 mt-7">
        <h1 className="text-4xl font-extrabold">
          Post-Fit : Resize Your Images in Seconds
        </h1>
        <p className="text-lg mt-2 opacity-80">
          Perfectly formatted for all social media platforms.
        </p>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
        <div className="">
          <h1 className="text-3xl ">Image Resizer</h1>
          <div className="flex justify-center m-3">
            <div
              className="relative w-64 cursor-pointer shadow-xl font-bold text-lg"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                className="bg-blue-500
            font-sans text-white text-center py-3 rounded-lg shadow-md hover:bg-indigo-600 hover:scale-110 hover:-translate-y-1 
            transition-all duration-300"
              >
                Upload Image
              </div>
            </div>
          </div>
          <div className="flex justify-center m-3">
            {image && (
              <img
                src={image}
                alt="Preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </div>

          <h3 className="text-xl">Select Platforms & Post Types</h3>
          <div className="">
            <Select
              options={socialMediaSizes}
              isMulti
              onChange={handleSelectionChange}
              placeholder="Select platforms..."
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={processImage}
              className="m-5 bg-blue-500 p-1 text-lg font-bold text-center w-48 rounded-xl text-white cursor-pointer hover:bg-indigo-600 transition-all duration-300"
            >
              Generate Images
            </button>
          </div>
        </div>

        {/* Download Links */}
        {/* Download Links (Fixed Layout + Scrollable) */}
        <div className="mt-6 w-full max-w-md overflow-y-auto max-h-64">
          {downloadLinks.map(({ name, link }, index) => (
            <a
              key={index}
              href={link}
              download={`${name}.jpg`}
              className="block bg-green-500 text-white px-4 py-2 rounded-lg my-2 hover:bg-green-600 text-center"
            >
              Download {name}
            </a>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Transparent Blurred Background */}
            <motion.div
              className="fixed inset-0 bg-transparent backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/80 p-6 rounded-2xl shadow-3xl w-[90%] max-w-lg text-center text-white"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
            >
              <h2 className="text-2xl font-semibold mb-4">About Post-Fit</h2>
              <p className="text-white font-semibold mb-4">
                Post-Fit is a powerful tool that resizes images for multiple
                social media platforms with just one upload. Optimized for
                Instagram, Facebook, Twitter, LinkedIn, and more!
              </p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <footer className="text-center text-gray-600 mt-15 pb-4">
        © {new Date().getFullYear()} Post-Fit. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
