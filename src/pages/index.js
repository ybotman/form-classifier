import React, { useState, useEffect } from "react";

import ImageDropzone from "../components/ImageDropzone";
import ImageAttributesForm from "../components/ImageAttributesForm";
import axios from "axios";
import Modal from "react-modal";
import Image from "next/image";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";


Modal.setAppElement("#__next");

function ImageGrid({ images }) {
  return (
    <Grid container spacing={2}>
      {images.map((image) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={image.url}
              alt={image.description}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

const Index = () => {
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState({});
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, images]);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/images");
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  // const fetchImages = async () => {
  //   const { data } = await axios.get("api/images");
  //   setImages(data);
  // };

  const handleImageUpload = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    const { data } = await axios.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
    const newImage = { ...data, attributes: {} };
    const { data: savedImage } = await axios.post("api/images", newImage);
    setImages([...images, savedImage]);
  };

  const handleUpdateAttributes = async (updatedAttributes) => {
    const updatedImage = { ...selectedImage, attributes: updatedAttributes };
    const { data: savedImage } = await axios.put("api/images", updatedImage);
    setImages(images.map((img) => (img.id === savedImage.id ? savedImage : img)));
    setSelectedImage(null);
  };

  const applyFilters = () => {
    const filtered = images.filter((image) => {
      return Object.keys(filters).every((key) => {
        return filters[key] === "" || (image.attributes && image.attributes[key] === filters[key]);
      });
    });
    setFilteredImages(filtered);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };


  return (
    <div>
      <ImageDropzone onDrop={handleImageUpload} />
      <ImageAttributesForm onSubmit={handleApplyFilters} initialValues={filters} isFilter />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredImages.map((image) => (
          <Image
            key={image.id}
            src={image.filePath}
            alt=""
            onClick={() => setSelectedImage(image)}
            width={200}
            height={200} // Set a fixed height or calculate it based on the image aspect ratio
            objectFit="cover"
            className="image-thumbnail"
          />
        ))}
      </div>
      {selectedImage && (
        <Modal isOpen onRequestClose={() => setSelectedImage(null)}>
          <Image src={selectedImage.filePath} alt="" width={600} height={400} objectFit="contain" />
          <ImageAttributesForm onSubmit={handleUpdateAttributes} initialValues={selectedImage.attributes} />
        </Modal>
      )}
    </div>
  );

};

export default Index;
