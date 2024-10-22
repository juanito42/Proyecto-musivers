import React, { useState } from 'react';
import { Table, Button, Container, Row, Col, Card, Modal, Form } from 'react-bootstrap';

function Users() {
    // Simulamos una lista de usuarios con estado
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Alice Brown', email: 'alice@example.com', role: 'User' }
    ]);

    // Estado para manejar la visibilidad del modal
    const [showModal, setShowModal] = useState(false);

    // Estado para los valores del nuevo usuario
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });

    // Función para manejar la eliminación de un usuario (solo para ejemplo)
    const handleDelete = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    // Función para abrir el modal
    const handleShow = () => setShowModal(true);

    // Función para cerrar el modal
    const handleClose = () => {
        setShowModal(false);
        setNewUser({ name: '', email: '', role: 'User' }); // Resetea el formulario
    };

    // Función para manejar la creación de un nuevo usuario
    const handleAddUser = () => {
        const newId = users.length ? users[users.length - 1].id + 1 : 1;
        const userToAdd = { ...newUser, id: newId };
        setUsers([...users, userToAdd]);
        handleClose(); // Cierra el modal después de agregar
    };

    // Maneja los cambios en el formulario de nuevo usuario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1 className="mb-4">Users</h1>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShow}>Add New User</Button>
                </Col>
            </Row>

            {/* Lista de usuarios en una tabla */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2">View</Button>
                                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Tarjeta de información adicional de usuario */}
            <Card className="mt-5">
                <Card.Body>
                    <Card.Title>Additional User Information</Card.Title>
                    <Card.Text>
                        Here you can add more detailed information about the users, such as their profile details, activity logs, or other relevant data.
                    </Card.Text>
                </Card.Body>
            </Card>

            {/* Modal para añadir un nuevo usuario */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleChange}
                                placeholder="Enter user name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" value={newUser.role} onChange={handleChange}>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Users;
