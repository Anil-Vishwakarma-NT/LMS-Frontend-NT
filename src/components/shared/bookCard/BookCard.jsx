import React from "react";
import './BookCard.css'; // Rename CSS file accordingly
import { useNavigate } from "react-router-dom";

const CourseCard = ({ data }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/courses'); // Updated route
  };

  return (
    <div className="course-data-card" onClick={handleCardClick}>
      <div className="course-data-details">
        <img src={data.image} alt={data.title} className="course-data-photo"></img>
      </div>
      <p className="course-data-name">{data.title}</p>
      <p className="data-level">{data.level}</p>
    </div>
  );
};

export default CourseCard;