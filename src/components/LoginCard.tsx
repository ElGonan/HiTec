import { CSSProperties, ReactNode } from 'react';
import './css/LoginCard.css'; 

interface LoginCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  blur?: number;
  transparency?: number;
  fullWidthOnMobile?: boolean;
}

const LoginCard = ({
  children,
  className = '',
  style = {},
  blur = 2,
  fullWidthOnMobile = true
}: LoginCardProps) => {
  const fullWidthClass = fullWidthOnMobile ? 'login-card-mobile' : '';

  return (
    <div 
      className={`login-card ${fullWidthClass} ${className}`}
      style={{
        backdropFilter: `blur(${blur}px)`,
        backgroundColor: `rgba(16,18,60,1)`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default LoginCard;
