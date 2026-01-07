"use client";
import { useState, useEffect, useRef } from "react";

export default function ImageManager({ title, limit }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fileInputRef = useRef(null);

  const type = title.toLowerCase().includes("carousel")
    ? "carousel"
    : "gallery";

  // Fetch images
  async function fetchImages() {
    const res = await fetch(`/api/images/list?type=${type}`);
    const data = await res.json();
    if (res.ok) setCurrentImages(data.images || []);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  // Drag & Drop handlers
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) return;

    if (currentImages.length + files.length > limit) {
      setMessage(`Limit exceeded. Max ${limit} images allowed.`);
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
  }

  // Upload images
  async function handleUpload() {
    if (selectedFiles.length === 0) return;

    setLoading(true);
    setMessage("");

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Upload failed");
        setLoading(false);
        return;
      }
    }

    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await fetchImages();
    setMessage("Images uploaded successfully");
    setLoading(false);
  }

  // Delete handlers
  function openDeletePopup(id) {
    setDeleteId(id);
    setShowDeletePopup(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    const res = await fetch(`/api/images/delete/${deleteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCurrentImages((prev) =>
        prev.filter((img) => img.id !== deleteId)
      );
    } else {
      alert("Delete failed");
    }

    setShowDeletePopup(false);
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full p-4 lg:p-6">
      {/* LEFT SIDE */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">Limit: {limit} images</p>

        {/* Drag & Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors
            ${
              isDragging
                ? "border-blue-600 bg-blue-100"
                : "border-blue-300 bg-blue-50 hover:bg-blue-100"
            }`}
        >
          <div className="flex flex-col items-center text-center">
            <p className="font-semibold text-gray-700 mb-1">
              Drag & Drop images here
            </p>
            <p className="text-sm text-gray-500 mb-3">or</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setSelectedFiles(Array.from(e.target.files))
              }
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Browse Files
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-gray-700 mb-2">Preview</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded-lg"
                    alt=""
                  />
                  <button
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h3 className="text-xl font-bold mb-4">Current Images</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentImages.map((img) => (
            <div key={img.id} className="border rounded-lg p-3">
              <img
                src={img.image_url}
                className="w-full h-24 object-cover rounded-md mb-3"
                alt=""
              />
              <button
                onClick={() => openDeletePopup(img.id)}
                className="w-full bg-red-500 text-white py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <p className="mb-4">Are you sure you want to delete this image?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
