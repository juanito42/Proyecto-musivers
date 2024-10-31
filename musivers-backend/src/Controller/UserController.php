<?php
// src/Controller/UserController.php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    // Variable privada para manejar la gestión de entidades
    private $entityManager;

    // Constructor de la clase para inicializar el EntityManager
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    // Método para mostrar la lista de usuarios en la aplicación
    #[Route('/users', name: 'users_list', methods: ['GET'])]
    public function index(): Response
    {
        // Obtener todos los usuarios de la base de datos
        $users = $this->entityManager->getRepository(User::class)->findAll();

        // Renderizar la plantilla pasando los usuarios obtenidos
        return $this->render('user/index.html.twig', [
            'users' => $users, // Pasamos los usuarios a la plantilla
        ]);
    }

}
