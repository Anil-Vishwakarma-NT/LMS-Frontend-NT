// import React from "react";
// import edit from "../../../assets/edit.png";
// import deleteLogo from "../../../assets/delete.png";
// import Tooltip from "../tooltip/Tooltip"; // Import Tooltip component
// import "./Table.css";

// const CourseContentTable = ({ onEditClick, fields, entries, onDeleteClick }) => {
//   return (
//     <div className="table-container">
//       <div className="table-parent">
//         <table className="books-table">
//           <thead>
//             <tr>
//               {fields.map((field) => (
//                 <th key={field.index}>{field.title}</th>
//               ))}
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {entries?.map((item, i) => (
//               <tr key={i}>
//                 <td>{item.courseContentId}</td>
//                 <td>{item.title}</td>
//                 <td>{item.description}</td>
//                 <td>{item.courseName || "N/A"}</td>
//                 <td>{item.isActive ? "Yes" : "No"}</td>
//                 <td>
//                   {item.createdAt
//                     ? new Date(item.createdAt.split(".")[0]).toLocaleString()
//                     : "N/A"}
//                 </td>
//                 <td>
//                   {item.updatedAt
//                     ? new Date(item.updatedAt.split(".")[0]).toLocaleString()
//                     : "N/A"}
//                 </td>
//                 <td>
//                   {item.resourceLink ? (
//                     <a
//                       href={item.resourceLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {item.resourceLink}
//                     </a>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>
//                   <div className="modifications">
//                     <Tooltip tooltipText="Edit">
//                       <img
//                         src={edit}
//                         alt="edit"
//                         className="edit-logo"
//                         onClick={() => onEditClick(item)}
//                       />
//                     </Tooltip>
//                     <Tooltip tooltipText="Delete">
//                       <img
//                         src={deleteLogo}
//                         alt="delete"
//                         className="edit-logo"
//                         onClick={() => onDeleteClick(item.courseContentId)}
//                       />
//                     </Tooltip>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CourseContentTable;



import React, { useState } from "react";
import VideoModal from "../../admin/booksAdmin/VideoModal";
import PDFReaderModal from "../../admin/booksAdmin/PDFReaderModal";
import "../../admin/booksAdmin/VideoModal.css";
import "../../admin/booksAdmin/PDFReaderModal.css";
import edit from "../../../assets/edit.png";
import deleteLogo from "../../../assets/delete.png";
import Tooltip from "../tooltip/Tooltip";
import "./Table.css";



const getResourceType = (resourceLink) => {
  if (!resourceLink) return "unknown";
  const lowerLink = resourceLink.toLowerCase();

  if (lowerLink.includes("youtube.com") || lowerLink.includes("youtu.be")) return "youtube";
  if (lowerLink.endsWith(".mp4") || lowerLink.endsWith(".mov")) return "video";
  if (lowerLink.endsWith(".pdf")) return "pdf";
  if (lowerLink.startsWith("http://") || lowerLink.startsWith("https://")) return "website";

  return "unknown";
};

const CourseContentTable = ({ onEditClick, fields, entries, onDeleteClick }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
const [currentPDFUrl, setCurrentPDFUrl] = useState("");

  const handlePlayVideo = (resourceLink) => {
    setCurrentVideoUrl(resourceLink);
    setIsVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentVideoUrl("");
    setIsVideoModalOpen(false);
  };

const handleViewPDF = (resourceLink) => {
  console.log("Opening PDF in modal:", resourceLink);
  setCurrentPDFUrl(resourceLink);
  setIsPDFModalOpen(true);
};

const handleClosePDFModal = () => {
  setCurrentPDFUrl("");
  setIsPDFModalOpen(false);
};

 const renderActionButton = (resourceLink) => {
  const resourceType = getResourceType(resourceLink);

  switch (resourceType) {
    case "youtube":
    case "video":
      return (
        <button onClick={() => handlePlayVideo(resourceLink)}>
          Play Video
        </button>
      );

    case "pdf":
      return (
        <button onClick={() => handleViewPDF(resourceLink)}>
          View PDF
        </button>
      );

    case "website":
      return (
        <button onClick={() => window.open(resourceLink, "_blank")}>
          Visit Link
        </button>
      );

    default:
      return <span>Unsupported Content</span>;
  }
};

  return (
    <div className="table-container">
      <VideoModal
        isOpen={isVideoModalOpen}
        videoUrl={currentVideoUrl}
        onClose={handleCloseModal}
      />
<PDFReaderModal
  isOpen={isPDFModalOpen}
  pdfUrl={currentPDFUrl}
  onClose={handleClosePDFModal}
  blockTime={10} // Timer duration in seconds
/>
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.index}>{field.title}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((item, i) => (
              <tr key={i}>
                <td>{item.courseContentId}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.courseName || "N/A"}</td>
                <td>{item.isActive ? "Yes" : "No"}</td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt.split(".")[0]).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {item.updatedAt
                    ? new Date(item.updatedAt.split(".")[0]).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {item.resourceLink ? (
                    renderActionButton(item.resourceLink)
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <div className="modifications">
                    <Tooltip tooltipText="Edit">
                      <img
                        src={edit}
                        alt="edit"
                        className="edit-logo"
                        onClick={() => onEditClick(item)}
                      />
                    </Tooltip>
                    <Tooltip tooltipText="Delete">
                      <img
                        src={deleteLogo}
                        alt="delete"
                        className="edit-logo"
                        onClick={() => onDeleteClick(item.courseContentId)}
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseContentTable;