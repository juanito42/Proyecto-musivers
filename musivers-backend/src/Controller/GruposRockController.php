<?php

// src/Controller/GruposRockController.php
namespace App\Controller;

use App\Entity\GruposRock;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class GruposRockController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('/api/grupos-rock', name: 'list_grupos_rock', methods: ['GET'])]
    public function listGruposRock(): JsonResponse
    {
        // No necesitas validación aquí si la ruta es pública
        $grupos = $this->entityManager->getRepository(GruposRock::class)->findAll();

        $data = array_map(fn(GruposRock $grupo) => [
            'id' => $grupo->getId(),
            'name' => $grupo->getName(),
            'biography' => $grupo->getBiography(),
            'photoFilename' => $grupo->getPhotoFilename(),
            'officialWebsite' => $grupo->getOfficialWebsite(),
            'albums' => $grupo->getAlbums(),
            'members' => $grupo->getMembers(),
            'formationDate' => $grupo->getFormationDate()?->format('Y-m-d'),
        ], $grupos);

        return new JsonResponse($data);
    }


    // Método para obtener un grupo de rock por ID
    #[Route('/api/grupos-rock/{id}', name: 'get_grupo_rock', methods: ['GET'])]
    public function getGrupoRock(int $id): JsonResponse
    {
        $grupo = $this->entityManager->getRepository(GruposRock::class)->find($id);

        if (!$grupo) {
            return new JsonResponse(['error' => 'Grupo no encontrado'], 404);
        }

        return new JsonResponse([
            'id' => $grupo->getId(),
            'name' => $grupo->getName(),
            'biography' => $grupo->getBiography(),
            'photoFilename' => $grupo->getPhotoFilename(),
            'officialWebsite' => $grupo->getOfficialWebsite(),
            'albums' => $grupo->getAlbums(),
            'members' => $grupo->getMembers(),
            'formationDate' => $grupo->getFormationDate()?->format('Y-m-d'),
        ]);
    }

    // Método para crear o actualizar un grupo de rock
    #[Route('/api/grupos-rock', name: 'save_grupo_rock', methods: ['POST', 'PUT'])]
    public function saveGrupoRock(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['name'], $data['biography'])) {
            return new JsonResponse(['error' => 'Datos inválidos'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Si se proporciona un ID, buscar el grupo. De lo contrario, crear uno nuevo.
        $grupo = isset($data['id']) ? $this->entityManager->getRepository(GruposRock::class)->find($data['id']) : new GruposRock();

        if (isset($data['id']) && !$grupo) {
            return new JsonResponse(['error' => 'Grupo no encontrado'], 404);
        }

        $grupo->setName($data['name']);
        $grupo->setBiography($data['biography']);
        $grupo->setPhotoFilename($data['photoFilename'] ?? null);
        $grupo->setOfficialWebsite($data['officialWebsite'] ?? null);
        $grupo->setAlbums($data['albums'] ?? []);
        $grupo->setMembers($data['members'] ?? []);

        if (!empty($data['formationDate'])) {
            try {
                $grupo->setFormationDate(new \DateTime($data['formationDate']));
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Fecha de formación inválida'], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        $this->entityManager->persist($grupo);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Grupo guardado correctamente.']);
    }

    // Método para eliminar un grupo de rock
    #[Route('/api/grupos-rock/{id}', name: 'delete_grupo_rock', methods: ['DELETE'])]
    public function deleteGrupoRock(int $id): JsonResponse
    {
        $grupo = $this->entityManager->getRepository(GruposRock::class)->find($id);

        if (!$grupo) {
            return new JsonResponse(['error' => 'Grupo no encontrado'], 404);
        }

        $this->entityManager->remove($grupo);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Grupo eliminado correctamente.']);
    }

    #[Route('/admin/grupos-rock/new', name: 'create_grupo_rock', methods: ['GET', 'POST'])]
public function createGrupoRock(Request $request): Response
{
    $grupo = new GruposRock();

    // Crear el formulario para la creación
    $form = $this->createFormBuilder($grupo)
        ->add('name', TextType::class, [
            'label' => 'Nombre del Grupo',
            'required' => true,
        ])
        ->add('biography', TextareaType::class, [
            'label' => 'Biografía',
            'required' => true,
        ])
        ->add('formationDate', DateType::class, [
            'label' => 'Fecha de Formación',
            'widget' => 'single_text',
            'required' => false,
        ])
        ->add('photo', FileType::class, [
            'label' => 'Foto del Grupo',
            'mapped' => false,
            'required' => false,
        ])
        ->add('officialWebsite', UrlType::class, [
            'label' => 'Sitio Oficial',
            'required' => false,
        ])
        ->add('albums', TextareaType::class, [
            'label' => 'Álbumes (separados por comas)',
            'required' => false,
        ])
        ->add('members', TextareaType::class, [
            'label' => 'Miembros (separados por comas)',
            'required' => false,
        ])
        ->add('save', SubmitType::class, ['label' => 'Crear Grupo'])
        ->getForm();

    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        // Manejo de la foto si se sube
        $photoFile = $form->get('photo')->getData();
        if ($photoFile) {
            $newFilename = uniqid() . '.' . $photoFile->guessExtension();
            try {
                $photoFile->move(
                    $this->getParameter('photos_directory'),
                    $newFilename
                );
                $grupo->setPhotoFilename($newFilename);
            } catch (FileException $e) {
                $this->addFlash('error', 'Error al subir la foto');
            }
        }

        // Guardar el grupo en la base de datos
        $this->entityManager->persist($grupo);
        $this->entityManager->flush();

        $this->addFlash('success', 'Grupo creado exitosamente');
        return $this->redirectToRoute('list_grupos_rock');
    }

    return $this->render('grupos_rock/create.html.twig', [
        'form' => $form->createView(),
    ]);
}

}
