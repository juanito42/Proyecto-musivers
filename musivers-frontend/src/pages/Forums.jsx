// src/pages/Forums.jsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import '../styles/pages/Forums.css'; 

const Forums = () => {
  const [forums, setForums] = useState([]); // Estado para almacenar los foros
  const [responseContent, setResponseContent] = useState({}); // Estado para manejar el contenido de la respuesta
  const [responses, setResponses] = useState({}); // Estado para almacenar respuestas de los foros
  const [subResponseContent, setSubResponseContent] = useState({}); // Estado para manejar contenido de sub-respuestas
  const [activeForumId, setActiveForumId] = useState(null); // Identificador del foro activo
  const [activeForumReplyForm, setActiveForumReplyForm] = useState(null); // Formulario de respuesta activa en un foro
  const [activeReplyForm, setActiveReplyForm] = useState(null); // Formulario de sub-respuesta activa
  const navigate = useNavigate();

  // Función para obtener los foros desde el backend
  const fetchForums = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/forums", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForums(response.data); // Actualiza el estado de foros
    } catch (error) {
      console.error("Error obteniendo los foros:", error);
    }
  }, [navigate]);

  // Función para obtener las respuestas de un foro
  const fetchResponses = async (forumId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8000/api/forums/${forumId}/responses`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      setResponses((prev) => ({ ...prev, [forumId]: response.data })); // Actualiza respuestas del foro en el estado
    } catch (error) {
      console.error("Error obteniendo respuestas:", error);
    }
  };

  // Alterna la visibilidad de respuestas en un foro
  const toggleResponses = (forumId) => {
    if (activeForumId === forumId) {
      setActiveForumId(null); // Oculta respuestas si ya están visibles
    } else {
      fetchResponses(forumId);
      setActiveForumId(forumId); // Muestra respuestas del foro seleccionado
    }
  };

  // Actualiza el estado cuando se cambia el contenido de respuesta
  const handleResponseChange = (forumId, content) => {
    setResponseContent((prev) => ({ ...prev, [forumId]: content }));
  };

  // Actualiza el estado cuando se cambia el contenido de sub-respuesta
  const handleSubResponseChange = (responseId, content) => {
    setSubResponseContent((prev) => ({ ...prev, [responseId]: content }));
  };

  // Enviar respuesta a un foro
  const handleForumResponseSubmit = async (e, forumId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:8000/forums/${forumId}/response`, { content: responseContent[forumId] }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      setResponseContent((prev) => ({ ...prev, [forumId]: "" })); // Limpia el campo de respuesta
      setActiveForumReplyForm(null); // Oculta el formulario de respuesta
      fetchResponses(forumId); // Refresca respuestas del foro
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  // Enviar sub-respuesta a una respuesta en un foro
  const handleSubResponseSubmit = async (e, forumId, responseId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:8000/forums/${forumId}/response/${responseId}/subresponse`, {
        content: subResponseContent[responseId]
      }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      setSubResponseContent((prev) => ({ ...prev, [responseId]: "" })); // Limpia el campo de sub-respuesta
      setActiveReplyForm(null); // Oculta el formulario de sub-respuesta
      fetchResponses(forumId); // Refresca respuestas
    } catch (error) {
      console.error("Error al enviar la sub-respuesta:", error);
    }
  };

  // Redirige a la página para crear un nuevo foro
  const goToCreateForum = () => navigate("/forums/new");

  // Ejecuta la función para cargar los foros al montar el componente
  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  return (
    <div className="container forums-container">
      <h1 className="forums-header">Foros</h1>

      {/* Botón para añadir un nuevo foro */}
      <div className="mb-4 d-flex justify-content-center">
        <button className="btn add-forum-button" onClick={goToCreateForum}>Añadir nuevo foro</button>
      </div>

      {/* Lista de foros */}
      <div className="row">
        {forums.map((forum) => (
          (activeForumId === null || activeForumId === forum.id) && (
            <div className="col-md-4" key={forum.id}>
              <div className="card mb-4 forum-card">
                <div className="card-body">
                  <h5 className="forum-title">{forum.title}</h5>
                  <p className="forum-description">{forum.description}</p>

                  {/* Botones para responder y ver/ocultar respuestas */}
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-primary forum-button"
                      onClick={() => setActiveForumReplyForm(forum.id)}
                    >
                      Responder
                    </button>
                    <button
                      className="btn btn-outline-secondary forum-button"
                      onClick={() => toggleResponses(forum.id)}
                    >
                      {activeForumId === forum.id ? "Ocultar respuestas" : "Ver respuestas"}
                    </button>
                  </div>

                  {/* Formulario de respuesta */}
                  {activeForumReplyForm === forum.id && (
                    <form onSubmit={(e) => handleForumResponseSubmit(e, forum.id)} className="mb-4">
                      <textarea
                        className="form-control forum-response-textarea"
                        placeholder="Escribe tu respuesta al foro"
                        value={responseContent[forum.id] || ""}
                        onChange={(e) => handleResponseChange(forum.id, e.target.value)}
                      />
                      <button type="submit" className="btn submit-button mt-2">Enviar respuesta</button>
                    </form>
                  )}

                  {/* Respuestas y sub-respuestas del foro */}
                  {activeForumId === forum.id && responses[forum.id] && (
                    <>
                      <h6 className="mt-3" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Respuestas:</h6>
                      <ul className="list-unstyled">
                        {responses[forum.id].map((response) => (
                          <li key={response.id} className="mb-3">
                            <div className="response-container">
                              <p style={{ color: '#333333' }}>{response.content}</p>
                              <small className="text-muted">
                                Fecha: {dayjs(response.createdAt).format("DD/MM/YYYY HH:mm")}
                              </small>
                            </div>

                            {/* Sub-respuestas */}
                            {Array.isArray(response.subResponses) && response.subResponses.length > 0 && (
                              <ul className="list-unstyled">
                                {response.subResponses.map((subResponse) => (
                                  <li key={subResponse.id} className="sub-response-container mt-2">
                                    <p style={{ color: '#555555' }}>{subResponse.content}</p>
                                    <small className="text-muted">
                                      Fecha: {dayjs(subResponse.createdAt).format("DD/MM/YYYY HH:mm")}
                                    </small>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Botón y formulario para añadir sub-respuestas */}
                            <button className="btn btn-link text-primary" onClick={() => setActiveReplyForm(response.id)}>
                              Responder
                            </button>
                            {activeReplyForm === response.id && (
                              <form onSubmit={(e) => handleSubResponseSubmit(e, forum.id, response.id)}>
                                <textarea
                                  className="form-control sub-response-textarea"
                                  placeholder="Añadir sub-respuesta"
                                  value={subResponseContent[response.id] || ""}
                                  onChange={(e) => handleSubResponseChange(response.id, e.target.value)}
                                />
                                <button type="submit" className="btn submit-button mt-2">Añadir respuesta</button>
                              </form>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Forums;
