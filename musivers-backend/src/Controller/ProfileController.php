<?php
// src/Controller/ProfileController.php
namespace App\Controller;

use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AbstractController
{
    /**
     * @Route("/api/profile", name="save_profile", methods={"POST"})
     */
    public function saveProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();  // Obtener el usuario autenticado

        $profile = new Profile();
        $profile->setFirstName($data['firstName']);
        $profile->setLastName($data['lastName']);
        $profile->setBirthDate(new \DateTime($data['birthDate']));
        $profile->setUser($user);

        $entityManager->persist($profile);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Profile saved!'], JsonResponse::HTTP_CREATED);
    }
}
