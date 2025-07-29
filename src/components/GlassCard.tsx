import { CSSProperties, ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  blur?: number;
  transparency?: number;
  fullWidthOnMobile?: boolean; // Nueva prop
}

const GlassCard = ({
  children,
  className = '',
  style = {},
  blur = 2,
  fullWidthOnMobile = true // Valor por defecto
}: GlassCardProps) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={{
        display: 'inline-block',
        backdropFilter: `blur(${blur}px)`,
        backgroundColor: `rgba(16,18,60,1)`,
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '.5rem',
        width: 'fit-content',
        height: 'fit-content',
        maxWidth: '100%', // Asegura que no se salga de la pantalla
        boxSizing: 'border-box', // Incluye padding en el ancho
        ...(fullWidthOnMobile && {
          '@media (max-width: 768px)': {
            width: 'calc(100% - 4rem)', // Resta el margen
            margin: '2rem 2rem', // Margen consistente
            display: 'block' // Para que ocupe todo el ancho
          }
        }),
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;