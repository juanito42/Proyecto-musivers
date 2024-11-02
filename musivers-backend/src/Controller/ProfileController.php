<?php

// src/Controller/ProfileController.php
namespace App\Controller;

use App\Entity\Profile;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ProfileController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    // Método para obtener el perfil del usuario autenticado
    #[Route('/api/profile', name: 'get_profile', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $profile = $user->getProfile();

        // Verificar si el perfil existe
        if (!$profile) {
            return new JsonResponse(['error' => 'Perfil no encontrado'], 404);
        }

        // Retornar los datos del perfil en formato JSON
        return new JsonResponse([
            'firstName' => $profile->getFirstName(),
            'lastName' => $profile->getLastName(),
            'bio' => $profile->getBio(),
            'birthDate' => $profile->getBirthDate()?->format('d-m-Y'),
        ]);
    }

    // Método para actualizar o crear el perfil del usuario autenticado
    #[Route('/api/profile', name: 'save_profile', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function saveProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException('Usuario no autenticado.');
        }

        // Obtener los datos enviados en el cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Validar que se hayan proporcionado los datos requeridos
        if (!$data || !isset($data['firstName'], $data['lastName'])) {
            return new JsonResponse(['error' => 'Datos inválidos'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Validar y asignar la fecha de nacimiento si está proporcionada
        $birthDate = null;
        if (!empty($data['birthDate'])) {
            try {
                $birthDate = new \DateTime($data['birthDate']);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Fecha de nacimiento inválida'], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        // Obtener el perfil del usuario o crear uno nuevo si no existe
        $profile = $user->getProfile() ?: new Profile();
        $profile->setFirstName($data['firstName']);
        $profile->setLastName($data['lastName']);
        $profile->setBio($data['bio'] ?? null);
        $profile->setBirthDate($birthDate);

        // Asignar el perfil al usuario si es nuevo
        if (!$user->getProfile()) {
            $user->setProfile($profile);
        }

        // Guardar el perfil en la base de datos
        $this->entityManager->persist($profile);
        $this->entityManager->flush();

        // Retornar una respuesta de éxito
        return new JsonResponse(['message' => 'Perfil actualizado correctamente.'], JsonResponse::HTTP_OK);
    }
}
