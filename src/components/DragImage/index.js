import React, { useCallback, useState } from "react";
import Dropzone from "./DropZone";
// cuid is a simple library to generate unique IDs
// import cuid from "cuid";
import ImageList from "./ImageList";

function DragImage() {
  // Create a state called images using useState hooks and pass the initial value as empty array
  const [images, setImages] = useState([
    {
      id: 'abcd123',
      src: 'data:image/png;dkjds...',
    },
    {
      id: 'zxy123456',
      src: 'data:image/png;sldklskd...',
    }
  ]);

  const onDrop = useCallback(acceptedFiles => {
    // Loop through accepted files
    acceptedFiles.map(file => {
      // Initialize FileReader browser API
      const reader = new FileReader();
      // onload callback gets called after the reader reads the file data
      reader.onload = function (e) {
        // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it. 
        setImages(prevState => [
          ...prevState,
          { id: 1, src: e.target.result }
        ]);
      };
      // Read the file as Data URL (since we accept only images)
      reader.readAsDataURL(file);
      return file;
    });
  }, []);



  return (
    <main className="App">
      <h1 className="text-center">Drag and Drop Example</h1>
      <Dropzone onDrop={onDrop} accept={"image/*"} />
      <ImageList images={images} />
    </main>
  );
}

export default DragImage;