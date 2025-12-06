import React from 'react';

// Definimos las propiedades que recibirá nuestro componente de plantilla
interface OgImageProps {
  title: string;
  description?: string;
  siteName?: string;
  date?: string; // Por si quieres añadir la fecha
  author?: string; // Por si quieres añadir el autor
}

// Este es el componente que Satori renderizará a un SVG
const OgImageTemplate: React.FC<OgImageProps> = ({
  title,
  description,
  siteName = "Presuposicionalismo.com",
  date,
  author,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a202c', // Fondo oscuro (color de texto será claro)
        color: '#edf2f7', // Texto claro
        fontFamily: 'sans-serif', // Fuente genérica
        padding: '60px',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        border: '10px solid #2d3748', // Borde sutil
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
        <h1
          style={{
            fontSize: '70px',
            fontWeight: 'bold',
            lineHeight: '1.2',
            margin: '0',
            marginBottom: '30px',
            color: '#90cdf4', // Un color de acento
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: '38px',
              lineHeight: '1.4',
              margin: '0',
              color: '#cbd5e0',
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '40px',
          borderTop: '2px solid #2d3748',
          paddingTop: '20px',
        }}
      >
        <span style={{ fontSize: '30px', fontWeight: 'bold', color: '#63b3ed' }}>
          {siteName}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {author && (
            <span style={{ fontSize: '24px', color: '#a0aec0', marginBottom: '5px' }}>
              Por: {author}
            </span>
          )}
          {date && (
            <span style={{ fontSize: '24px', color: '#a0aec0' }}>
              {date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OgImageTemplate;
