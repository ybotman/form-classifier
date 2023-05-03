import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageDropzone = ({ onDrop }) => {
    const handleDrop = useCallback((acceptedFiles) => {
        onDrop(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

    return (
        <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", textAlign: "center" }}>
            <input {...getInputProps()} />
            {isDragActive ? "Drop the files here" : "Drag and drop files here, or click to select files"}
        </div>
    );
};

export default ImageDropzone;
