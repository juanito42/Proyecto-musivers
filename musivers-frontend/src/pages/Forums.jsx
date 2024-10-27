import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Forums = () => {
  const [forums, setForums] = useState([]);
  const [responseContent, setResponseContent] = useState({}); // Estado para manejar el contenido de respuesta por foro
  const [responses, setResponses] = useState({});
  const [subResponseContent, setSubResponseContent] = useState({}); // Estado para manejar las sub-respuestas
  const [activeForumId, setActiveForumId] = useState(null); // Controla cuál foro está activo (mostrando respuestas)
  const [activeForumReplyForm, setActiveForumReplyForm] = useState(null); // Controla si se está respondiendo a un foro directamente
  const [activeReplyForm, setActiveReplyForm] = useState(null); // Controla cuál respuesta está recibiendo sub-respuestas
  const navigate = useNavigate();

  // Función para obtener los foros
  const fetchForums = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/forums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForums(response.data); // Actualiza la lista de foros
    } catch (error) {
      console.error("Error obteniendo los foros:", error);
    }
  }, [navigate]);

  // Función para obtener las respuestas de un foro
  const fetchResponses = async (forumId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/forums/${forumId}/responses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponses((prev) => ({ ...prev, [forumId]: response.data }));
    } catch (error) {
      console.error("Error obteniendo respuestas:", error);
    }
  };

  // Función para alternar la visibilidad de las respuestas y ocultar los otros foros
  const toggleResponses = (forumId) => {
    if (activeForumId === forumId) {
      // Si el foro ya está activo, ocultamos todo y volvemos a mostrar todos los foros
      setActiveForumId(null);
    } else {
      // Si seleccionamos otro foro, mostramos solo este y ocultamos los demás
      fetchResponses(forumId);
      setActiveForumId(forumId);
    }
  };

  // Función para manejar los cambios en el campo de respuesta de un foro específico
  const handleResponseChange = (forumId, content) => {
    setResponseContent((prev) => ({
      ...prev,
      [forumId]: content,
    }));
  };

  // Función para manejar los cambios en el campo de sub-respuesta de una respuesta específica
  const handleSubResponseChange = (responseId, content) => {
    setSubResponseContent((prev) => ({
      ...prev,
      [responseId]: content,
    }));
  };

  // Función para enviar una nueva respuesta al foro
  const handleForumResponseSubmit = async (e, forumId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:8000/forums/${forumId}/response`,
        { content: responseContent[forumId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseContent((prev) => ({ ...prev, [forumId]: "" })); // Limpiar el campo de respuesta
      setActiveForumReplyForm(null); // Ocultar el formulario después de enviar la respuesta
      fetchResponses(forumId);
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  // Función para enviar una sub-respuesta a una respuesta específica
  const handleSubResponseSubmit = async (e, forumId, responseId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:8000/forums/${forumId}/response/${responseId}/subresponse`,
        { content: subResponseContent[responseId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSubResponseContent((prev) => ({ ...prev, [responseId]: "" }));
      setActiveReplyForm(null); // Ocultar el formulario después de enviar la sub-respuesta
      fetchResponses(forumId); // Refresca las respuestas después de añadir una sub-respuesta
    } catch (error) {
      console.error("Error al enviar la sub-respuesta:", error);
    }
  };

  // Función para redirigir a la página de creación de foros
  const goToCreateForum = () => {
    navigate("/forums/new"); // Cambia '/forums/new' por la ruta correcta en tu aplicación
  };

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  return (
    <div className="container">
      <h1 className="mt-5">Foros</h1>

      {/* Botón para crear un nuevo foro */}
      <div className="mb-4">
        <button className="btn btn-success" onClick={goToCreateForum}>
          Añadir nuevo foro
        </button>
      </div>

      <div className="row">
        {forums.map(
          (forum) =>
            // Solo mostrar el foro seleccionado o todos los foros si no hay foro activo
            (activeForumId === null || activeForumId === forum.id) && (
              <div className="col-md-4" key={forum.id}>
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{forum.title}</h5>
                    <p className="card-text">{forum.description}</p>

                    {/* Botón de responder al foro */}
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-primary mb-3"
                        onClick={() => setActiveForumReplyForm(forum.id)}
                      >
                        Responder al foro
                      </button>
                      <button
                        className="btn btn-secondary mb-3"
                        onClick={() => toggleResponses(forum.id)}
                      >
                        {activeForumId === forum.id
                          ? "Ocultar respuestas"
                          : "Ver respuestas"}
                      </button>
                    </div>

                    {/* Formulario para responder al foro */}
                    {activeForumReplyForm === forum.id && (
                      <form
                        onSubmit={(e) => handleForumResponseSubmit(e, forum.id)}
                        className="mb-4"
                      >
                        <textarea
                          className="form-control"
                          placeholder="Escribe tu respuesta al foro"
                          value={responseContent[forum.id] || ""}
                          onChange={(e) =>
                            handleResponseChange(forum.id, e.target.value)
                          }
                        />
                        <button type="submit" className="btn btn-success mt-2">
                          Enviar respuesta
                        </button>
                      </form>
                    )}

                    {activeForumId === forum.id && (
                      <>
                        <h6>Respuestas:</h6>
                        {responses[forum.id] &&
                          responses[forum.id].length > 0 && (
                            <ul>
                              {responses[forum.id].map((response) => (
                                <li key={`response-${response.id}`}>
                                  {response.content} <br />
                                  <small className="text-muted">
                                    Fecha:{" "}
                                    {dayjs(response.createdAt).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </small>
                                  {/* Sub-respuestas */}
                                  {response.subResponses &&
                                    response.subResponses.length > 0 && (
                                      <ul
                                        style={{
                                          marginLeft: "20px",
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {response.subResponses.map(
                                          (subResponse) => (
                                            <li
                                              key={`subresponse-${subResponse.id}`}
                                            >
                                              {subResponse.content} <br />
                                              <small className="text-muted">
                                                Fecha:{" "}
                                                {dayjs(
                                                  subResponse.createdAt
                                                ).format("DD/MM/YYYY HH:mm")}
                                              </small>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  {/* Formulario para añadir sub-respuesta */}
                                  <button
                                    className="btn btn-link"
                                    onClick={() =>
                                      setActiveReplyForm(response.id)
                                    }
                                  >
                                    Responder
                                  </button>
                                  {activeReplyForm === response.id && (
                                    <form
                                      onSubmit={(e) =>
                                        handleSubResponseSubmit(
                                          e,
                                          forum.id,
                                          response.id
                                        )
                                      }
                                    >
                                      <textarea
                                        className="form-control"
                                        placeholder="Añadir sub-respuesta"
                                        value={
                                          subResponseContent[response.id] || ""
                                        }
                                        onChange={(e) =>
                                          handleSubResponseChange(
                                            response.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button
                                        type="submit"
                                        className="btn btn-primary mt-2"
                                      >
                                        Añadir respuesta
                                      </button>
                                    </form>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Forums;