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
    public function listGruposRock(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1)); // Página actual (por defecto 1)
        $limit = max(1, $request->query->getInt('limit', 1)); // Límite por página (por defecto 1)

        $repository = $this->entityManager->getRepository(GruposRock::class);
        $queryBuilder = $repository->createQueryBuilder('g');

        // Total de grupos disponibles
        $totalGrupos = $queryBuilder->select('COUNT(g.id)')->getQuery()->getSingleScalarResult();

        // Grupos para la página actual
        $grupos = $queryBuilder->select('g')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

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

        return new JsonResponse([
            'grupos' => $data,
            'total' => (int) $totalGrupos,
            'page' => $page,
            'limit' => $limit,
            'totalPages' => ceil($totalGrupos / $limit),
        ]);
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

    #[Route('/admin/grupos-rock/delete/{id}', name: 'delete_grupos_rock', methods: ['POST'])]
    public function deleteGrupoRock(Request $request, GruposRock $grupo): Response
    {
        $csrfToken = $request->request->get('_csrf_token');

        if (!$this->isCsrfTokenValid('delete' . $grupo->getId(), $csrfToken)) {
            $this->addFlash('error', 'Token CSRF inválido.');
            return $this->redirectToRoute('list_grupos_rock');
        }

        $this->entityManager->remove($grupo);
        $this->entityManager->flush();

        $this->addFlash('success', 'Grupo eliminado con éxito.');
        return $this->redirectToRoute('list_grupos_rock');
    }

    #[Route('/admin/grupos-rock/new', name: 'create_grupo_rock', methods: ['GET', 'POST'])]
public function createGrupoRock(Request $request): Response
{
    $grupo = new GruposRock();

    $form = $this->createFormBuilder($grupo)
        ->add('name', TextType::class, ['label' => 'Nombre del Grupo', 'required' => true])
        ->add('biography', TextareaType::class, ['label' => 'Biografía', 'required' => true])
        ->add('formationDate', DateType::class, ['label' => 'Fecha de Formación', 'widget' => 'single_text', 'required' => false])
        ->add('photo', FileType::class, ['label' => 'Foto del Grupo', 'mapped' => false, 'required' => false])
        ->add('officialWebsite', UrlType::class, ['label' => 'Sitio Oficial', 'required' => false])
        ->add('albums', TextareaType::class, ['label' => 'Álbumes (separados por comas)', 'mapped' => false, 'required' => false])
        ->add('members', TextareaType::class, ['label' => 'Miembros (separados por comas)', 'mapped' => false, 'required' => false])
        #->add('save', SubmitType::class, ['label' => 'Crear Grupo'])
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

        // Procesar los campos "albums" y "members" como arrays
        $albumsInput = $form->get('albums')->getData();
        $albumsArray = $albumsInput ? array_map('trim', explode(',', $albumsInput)) : [];
        $grupo->setAlbums($albumsArray);

        $membersInput = $form->get('members')->getData();
        $membersArray = $membersInput ? array_map('trim', explode(',', $membersInput)) : [];
        $grupo->setMembers($membersArray);

        $this->entityManager->persist($grupo);
        $this->entityManager->flush();

        $this->addFlash('success', 'Grupo creado exitosamente');
        return $this->redirectToRoute('list_grupos_rock');
    }

    return $this->render('grupos_rock/create.html.twig', [
        'form' => $form->createView(),
    ]);
}


    // Método para listar grupos de rock en una vista HTML con paginación
    #[Route('/grupos-rock', name: 'list_grupos_rock', methods: ['GET'])]
    public function listGruposRockView(Request $request): Response
    {
        $page = max(1, $request->query->getInt('page', 1)); // Página actual (por defecto 1)
        $limit = max(1, $request->query->getInt('limit', 6)); // Límite por página (por defecto 6)

        $repository = $this->entityManager->getRepository(GruposRock::class);
        $queryBuilder = $repository->createQueryBuilder('g');

        // Total de grupos disponibles
        $totalGrupos = $queryBuilder->select('COUNT(g.id)')->getQuery()->getSingleScalarResult();

        // Grupos para la página actual
        $grupos = $queryBuilder->select('g')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        // Renderizar la plantilla Twig
        return $this->render('grupos_rock/list.html.twig', [
            'grupos' => $grupos,
            'totalGrupos' => $totalGrupos,
            'currentPage' => $page,
            'limit' => $limit,
            'totalPages' => ceil($totalGrupos / $limit),
        ]);
    }

    #[Route('/admin/grupos-rock/edit/{id}', name: 'edit_grupos_rock', methods: ['GET', 'POST'])]
    public function editGrupoRock(Request $request, GruposRock $grupo): Response
    {
        // Convertir álbumes y miembros en cadenas para precargar en el formulario
        $albumsAsString = $grupo->getAlbums() ? implode(', ', $grupo->getAlbums()) : '';
        $membersAsString = $grupo->getMembers() ? implode(', ', $grupo->getMembers()) : '';

        $form = $this->createFormBuilder($grupo)
            ->add('name', TextType::class, ['label' => 'Nombre del Grupo'])
            ->add('biography', TextareaType::class, ['label' => 'Biografía'])
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
                'mapped' => false,
                'data' => $albumsAsString, // Precargar álbumes
            ])
            ->add('members', TextareaType::class, [
                'label' => 'Miembros (separados por comas)',
                'required' => false,
                'mapped' => false,
                'data' => $membersAsString, // Precargar miembros
            ])
            ->add('save', SubmitType::class, ['label' => 'Guardar Cambios'])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Manejo de la foto (opcional)
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
                    $this->addFlash('error', 'Error al subir la foto.');
                }
            }

            // Procesar el campo "albums"
            $albumsInput = $form->get('albums')->getData();
            $albumsArray = $albumsInput ? array_map('trim', explode(',', $albumsInput)) : [];
            $grupo->setAlbums($albumsArray);

            // Procesar el campo "members"
            $membersInput = $form->get('members')->getData();
            $membersArray = $membersInput ? array_map('trim', explode(',', $membersInput)) : [];
            $grupo->setMembers($membersArray);

            $this->entityManager->flush();
            $this->addFlash('success', 'Grupo actualizado con éxito.');
            return $this->redirectToRoute('list_grupos_rock');
        }

        return $this->render('grupos_rock/edit.html.twig', [
            'form' => $form->createView(),
            'grupo' => $grupo,
        ]);
    }
}
