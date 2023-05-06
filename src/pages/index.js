import React, { useState, useEffect } from "react";

import ImageDropzone from "../components/ImageDropzone";
import ImageAttributesForm from "../components/ImageAttributesForm";

import axios from "axios";
import Modal from "react-modal";
import Image from "next/image";

import { jsonServerUrl, nextApiUrl } from "../apiConfig";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";

Modal.setAppElement("#__next");

function ImageGrid({ images }) {
  return (
    < Grid container spacing={2} >
      {
        images.map((image) => (
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
        ))
      }
    </Grid >
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
      console.log("INDEX.fetchImages");
      const { data } = await axios.get(`${jsonServerUrl}/images`);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleImageUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log("INDEX.handleImageUpload");


    // Create a new axios instance
    const axiosInstance = axios.create();

    // Add the interceptor to the new axios instance
    axiosInstance.interceptors.response.use(
      (response) => {
        console.log("axiosInstance-Successful response:", response);
        return response;
      },
      (error) => {
        console.log("axiosInstance-Error response:", error.response);
        return Promise.reject(error);
      }
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("INDEX.TRY Uploading image", file);
      // Use the new axios instance for the POST request

      console.log('formData:', formData);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const { data } = await axiosInstance.post("/api/upload", formData);
      console.log("Image uploaded:", data);

      const { data: newImage } = await axios.post(`${jsonServerUrl}/images`, {
        url: data.filePath,
      });

      setImages([...images, newImage]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdateAttributes = async (updatedAttributes) => {
    try {
      console.log("INDEX.TRY handleUpdateAttributes");
      const updatedImage = { ...selectedImage, attributes: updatedAttributes };
      console.log("INDEX.TRY updatedImage ", updatedImage, updatedAttributes);

      const { data: savedImage } = await axios.put(`${jsonServerUrl}/images/${updatedImage.id}`, updatedImage);
      setImages(images.map((img) => (img.id === savedImage.id ? savedImage : img)));
      setSelectedImage(null);
    } catch (error) {
      console.error("Error updating attributes:", error);
    }
  };


  const applyFilters = () => {
    try {
      console.log("INDEX.TRY applyFilters");
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
    console.log("INDEX handleApplyFilters", newFilters);
    setFilters(newFilters);
  };

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
            style={{ objectFit: "cover" }}
            priority={true}
            className="image-thumbnail"
          />
        ))}
      </div>
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
