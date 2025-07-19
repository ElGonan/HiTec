// components/GlassCard.tsx
import { CSSProperties, ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  blur?: number;
  transparency?: number;
}

const GlassCard = ({
  children,
  className = '',
  style = {},
  blur = 8,
  transparency = 0.2
}: GlassCardProps) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={{
        display: 'inline-block', // Ajuste al contenido
        backdropFilter: `blur(${blur}px)`,
        backgroundColor: `rgba(255, 255, 255, ${transparency})`,
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        width: 'fit-content', // Clave para ajuste al contenido
        height: 'fit-content',
        ...style // Permite sobrescribir estilos
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;