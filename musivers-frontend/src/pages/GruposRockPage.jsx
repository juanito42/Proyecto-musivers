import { useEffect, useState } from 'react';
import { getGruposRock } from '../services/api';

const GruposRockPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGruposRock = async () => {
      try {
        const grupos = await getGruposRock();
        setGrupos(grupos);
      } catch (error) {
        console.error('Error al cargar los grupos de rock:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGruposRock();
  }, []);

  if (loading) {
    return <p>Cargando grupos de rock...</p>;
  }

  return (
    <div>
      <h1>Grupos de Rock</h1>
      {grupos.length === 0 ? (
        <p>No hay grupos disponibles.</p>
      ) : (
        <ul>
          {grupos.map((grupo) => (
            <li key={grupo.id}>
              <h3>{grupo.name}</h3>
              <p>{grupo.biography}</p>
              {grupo.photoFilename && (
                <img
                  src={`http://localhost:8000/uploads/photos/${grupo.photoFilename}`}
                  alt={grupo.name}
                  style={{ width: '200px' }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GruposRockPage;
