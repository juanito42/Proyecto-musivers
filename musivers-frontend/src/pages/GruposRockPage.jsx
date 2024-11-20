import { useEffect, useState } from "react";
import { getGruposRock } from "../services/api";
import { useNavigate } from "react-router-dom";

const GruposRockPage = () => {
  const [grupo, setGrupo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGrupoRock = async (page) => {
    try {
      setLoading(true);
      const response = await getGruposRock(page, 1);
      if (response.grupos && response.grupos.length > 0) {
        setGrupo(response.grupos[0]);
      } else {
        setGrupo(null);
      }
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error al cargar el grupo de rock:", error);
      if (error.response && error.response.status === 401) {
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupoRock(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <p>Cargando grupo de rock...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Grupos de Rock</h1>
      {grupo ? (
        <div className="card shadow-lg border-0">
          <div className="card-img-top-container">
            {grupo.photoFilename && (
              <img
                src={`http://localhost:8000/uploads/photos/${grupo.photoFilename}`}
                alt={grupo.name}
                className="card-img-top img-fluid"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
          </div>
          <div className="card-body">
            <h2 className="card-title text-primary">{grupo.name}</h2>
            <p className="card-text">{grupo.biography}</p>
            {grupo.formationDate && (
              <p className="card-text">
                <strong>Fecha de Formación:</strong> {grupo.formationDate}
              </p>
            )}
            {grupo.officialWebsite && (
              <a
                href={grupo.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-3"
              >
                Visitar Sitio Oficial
              </a>
            )}
            <div className="mt-4">
              <h5>Álbumes:</h5>
              <ul>
                {(grupo.albums || []).map((album, index) => (
                  <li key={index}>{album}</li> 
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h5>Miembros:</h5>
              <ul>
                {(grupo.members || []).map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>No hay grupo disponible.</p>
      )}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Anterior
        </button>
        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Siguiente
        </button>
      </div>
      <br />
    </div>
  );
};

export default GruposRockPage;
