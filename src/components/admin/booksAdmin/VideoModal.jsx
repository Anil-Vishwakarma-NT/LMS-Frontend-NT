import { useEffect, useState } from 'react';
import { app } from "../../../service/serviceLMS"
import ReactPlayer from 'react-player';

export default function VideoModal({ isOpen, fileName, resourceType, onClose }) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (isOpen && fileName) {

      if(resourceType === "youtube-link" || fileName.includes("youtube.com")) {
        console.log("YouTube link detected:", fileName);
        setVideoUrl(fileName); // Directly use YouTube link
      } else if (resourceType === "video" || fileName.endsWith(".mp4") || fileName.endsWith(".mov")) {
        // const url = app.get(`/course/api/client-api/streaming/video/${fileName}`)
        // console.log("Video URL:", url);
        // Set video URL directly – browser handles range requests
        const url = `http://localhost:8080/api/service-api/streaming/video/${fileName}`;
        console.log("Video URL set to:", url);
        setVideoUrl(url);
      }else{
        setVideoUrl(fileName)
      }


    }
   

    return () => {
      setVideoUrl(null); // Clear URL on close or re-render
    };
  }, [isOpen, fileName]);

  if (!isOpen) return null;

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        controls
        width="95%"
        height="550px"
      />
      <button onClick={onClose}>Close</button>
    </div>
  );
}

