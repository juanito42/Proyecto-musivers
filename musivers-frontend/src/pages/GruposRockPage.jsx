import { useEffect, useState, useCallback } from "react";
import { getGruposRock } from "../services/api";
import { useNavigate } from "react-router-dom";

const GruposRockPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGruposRock = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await getGruposRock(page, 2); // Mostrar 2 grupos por página
      if (response.grupos && response.grupos.length > 0) {
        setGrupos(response.grupos);
      } else {
        setGrupos([]);
      }
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error al cargar los grupos de rock:", error);
      if (error.response && error.response.status === 401) {
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Include dependencies like `navigate` here

  useEffect(() => {
    fetchGruposRock(currentPage);
  }, [fetchGruposRock, currentPage]); // Include `fetchGruposRock` as a dependency

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
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Cargando grupos de rock...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Grupos de Rock</h1>
      <div className="row justify-content-center">
        {grupos.length > 0 ? (
          grupos.map((grupo, index) => (
            <div
              className="col-md-6 mb-4 d-flex justify-content-center"
              key={grupo.id || index}
            >
              <div className="card shadow-lg border-0" style={{ width: "90%" }}>
                <div className="card-img-top-container">
                  {grupo.photoFilename && (
                    <img
                      src={`http://localhost:8000/uploads/photos/${grupo.photoFilename}`}
                      alt={grupo.name}
                      className="card-img-top img-fluid"
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </div>
                <div className="card-body">
                  <h2 className="card-title text-primary text-center">
                    {grupo.name}
                  </h2>
                  <p className="card-text text-center">{grupo.biography}</p>
                  {grupo.formationDate && (
                    <p className="card-text text-center">
                      <strong>Fecha de Formación:</strong>{" "}
                      {grupo.formationDate}
                    </p>
                  )}
                  {grupo.officialWebsite && (
                    <div className="text-center">
                      <a
                        href={grupo.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mt-3"
                      >
                        Visitar Sitio Oficial
                      </a>
                    </div>
                  )}
                  <div className="mt-4">
                    <h5>Álbumes:</h5>
                    <p>
                      {(grupo.albums || [])
                        .filter((album) => album) // Filtra valores nulos o vacíos
                        .join(", ") || "No hay álbumes disponibles."}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h5>Miembros:</h5>
                    <p>
                      {(grupo.members || [])
                        .filter((member) => member) // Filtra valores nulos o vacíos
                        .join(", ") || "No hay miembros disponibles."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay grupos disponibles.</p>
        )}
      </div>
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
