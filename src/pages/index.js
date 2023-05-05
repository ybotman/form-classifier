import React, { useState, useEffect } from "react";

import ImageDropzone from "../components/ImageDropzone";
import ImageAttributesForm from "../components/ImageAttributesForm";
import axios from "axios";
import Modal from "react-modal";
import Image from "next/image";
import { jsonServerUrl, nextApiUrl } from "./apiConfig";  //second file
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
    console.log("fetching images:", jsonServerUrl);
    try {
      const { data } = await axios.get(`${jsonServerUrl}/images`);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading image");
      const response = await axios.post("/uploads", formData);
      console.log("Image upload response status:", response.status);
      console.log("Image upload response data:", response.data);

      const { data } = response;
      const { data: newImage } = await axios.post(`${jsonServerUrl}/images`, { url: data.filePath, });

      setImages([...images, newImage]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };



  const handleUpdateAttributes = async (updatedAttributes) => {
    try {
      console.log("Image udpate");
      const updatedImage = { ...selectedImage, attributes: updatedAttributes };
      const { data: savedImage } = await axios.put(`${jsonServerUrl}/images/${updatedImage.id}`, updatedImage);
      setImages(images.map((img) => (img.id === savedImage.id ? savedImage : img)));
      setSelectedImage(null);
    } catch (error) {
      console.error("Error updating attributes:", error);
    }
  };


  const applyFilters = () => {
    try {
      console.log("ApplyFilter")
      const filtered = images.filter((image) => {
        return Object.keys(filters).every((key) => {
          return filters[key] === "" || (image.attributes && image.attributes[key] === filters[key]);
        });
      });
      setFilteredImages(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <ImageDropzone onDrop={handleImageUpload} />

      <ImageAttributesForm onSubmit={handleApplyFilters} initialValues={filters} isFilter />
      <ImageGrid images={filteredImages} />
      {selectedImage && (
        <Modal isOpen onRequestClose={() => setSelectedImage(null)}>
          <Image src={selectedImage.filePath} alt="" width={600} height={400} style={{ objectFit: "cover" }} />
          <ImageAttributesForm onSubmit={handleUpdateAttributes} initialValues={selectedImage.attributes} />
        </Modal>
      )}
    </div>
  );
};

export default Index;