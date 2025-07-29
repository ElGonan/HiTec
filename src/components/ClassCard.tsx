import { useEffect, useState } from "react";

interface ClassProps {
  className: string;
  teacherName: string;
  onSign: () => unknown;
  classPlace: string;
}

const ClassCard = ({ className, teacherName, onSign, classPlace }: ClassProps) => {

  return (
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: "600px",
    padding: "1rem",
    borderRadius: "12px",
    gap:"12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    backgroundColor: "white",
    boxSizing:"border-box",
  }}
>
  <div>
    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#1f2937" }}>
      Clase: {className}
    </h2>
    <h3 style={{ margin: 0, fontSize: "16px", color: "#374151" }}>Instructorx: {teacherName}</h3>
    <h4 style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Ubicación: {classPlace}</h4>
  </div>
  <button
    onClick={onSign}
    style={{
      fontSize: "14px",
      color: "white",
      backgroundColor: "#3239ff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    Inscribirse
  </button>
</div>
  )
};

export default ClassCard;

