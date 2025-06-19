import { useEffect, useState } from "react";

interface ClassProps {
  className: string;
  teacherName: string;
  onSign: () => void;
}

const ClassCard = ({ className, teacherName, onSign }: ClassProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // para asegurar el estado inicial correcto
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "12px",
        padding: "16px",
        margin: "16px auto", // centra horizontalmente
        maxWidth: "600px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // 👈 alinea todo el contenido al centro
        gap: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* Contenido texto */}
      <div
        style={{
          textAlign: "center", // 👈 centrado siempre
          width: "100%",
        }}
      >
        <h2 style={{ margin: 0 }}>{className}</h2>
        <h3 style={{ margin: 0 }}>{teacherName}</h3>
      </div>

      {/* Botón */}
      <div
      >
        <button
          onClick={onSign}
        >
          Inscribirse
        </button>
      </div>
    </div>
  );
};

export default ClassCard;

