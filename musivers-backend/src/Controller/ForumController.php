<?php

// src/Controller/ForumController.php

namespace App\Controller;

use App\Entity\Forum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\ResponseEntity;
use App\Form\ResponseType;

class ForumController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    // Obtener todos los foros en formato JSON
    #[Route('/api/forums', name: 'get_forums', methods: ['GET'])]
    public function getForums(): JsonResponse
    {
        // Consultar todos los foros
        $forums = $this->entityManager->getRepository(Forum::class)->findAll();

        // Convertir los datos de los foros en un formato JSON
        $data = array_map(fn($forum) => [
            'id' => $forum->getId(),
            'title' => $forum->getTitle(),
            'description' => $forum->getDescription(),
        ], $forums);

        return new JsonResponse($data);
    }

    // Crear un nuevo foro mediante una solicitud JSON
    #[Route('api/forums/new', name: 'create_forum', methods: ['POST'])]
    public function createForum(Request $request): JsonResponse
    {
        // Obtener y decodificar los datos enviados en el cuerpo de la solicitud
        $data = json_decode($request->getContent(), true);

        // Validar que se hayan proporcionado título y descripción
        if (!isset($data['title'], $data['description'])) {
            return new JsonResponse(['message' => 'Datos incompletos'], Response::HTTP_BAD_REQUEST);
        }

        // Crear un nuevo foro con los datos proporcionados
        $forum = new Forum();
        $forum->setTitle($data['title']);
        $forum->setDescription($data['description']);

        $this->entityManager->persist($forum);
        $this->entityManager->flush();

        // Devolver una respuesta de éxito con los detalles del nuevo foro
        return new JsonResponse([
            'id' => $forum->getId(),
            'title' => $forum->getTitle(),
            'description' => $forum->getDescription()
        ], Response::HTTP_CREATED);
    }

    // Listar todos los foros en una vista HTML
    #[Route('/forums', name: 'forums_list', methods: ['GET'])]
    public function index(): Response
    {
        // Consultar todos los foros
        $forums = $this->entityManager->getRepository(Forum::class)->findAll();

        // Renderizar la vista de foros
        return $this->render('forum/index.html.twig', [
            'forums' => $forums,
        ]);
    }

    // Eliminar un foro específico
    #[Route('/forums/{id}', name: 'delete_forum', methods: ['DELETE'])]
    public function deleteForum(int $id, Request $request): Response
    {
        // Consultar el foro por su ID
        $forum = $this->entityManager->getRepository(Forum::class)->find($id);

         // Verificar si el foro existe
        if (!$forum) {
            $this->addFlash('error', 'Foro no encontrado');
            return $this->redirectToRoute('forums_list');
        }

        // Validar el token CSRF antes de eliminar el foro
        if (!$this->isCsrfTokenValid('delete' . $forum->getId(), $request->request->get('_csrf_token'))) {
            $this->addFlash('error', 'Token CSRF inválido');
            return $this->redirectToRoute('forums_list');
        }

        // Eliminar el foro y confirmar la eliminación al usuario
        $this->entityManager->remove($forum);
        $this->entityManager->flush();

        $this->addFlash('success', 'Foro eliminado con éxito');
        return $this->redirectToRoute('forums_list');
    }

    // Añadir una respuesta a un foro
    #[Route('/forums/{id}/add-response', name: 'add_response', methods: ['GET', 'POST'])]
    public function addResponse(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        // Buscar el foro al cual se añadirá la respuesta
        $forum = $this->entityManager->getRepository(Forum::class)->find($id);

        if (!$forum) {
            throw $this->createNotFoundException('Foro no encontrado');
        }

        // Crear un nuevo objeto de respuesta y el formulario
        $response = new ResponseEntity();
        $form = $this->createForm(ResponseType::class, $response);

        // Procesar el formulario
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $response->setForum($forum);
            $entityManager->persist($response);
            $entityManager->flush();

            return $this->redirectToRoute('forums_list');
        }

        // Renderizar el formulario de respuesta
        return $this->render('forum/add_response.html.twig', [
            'form' => $form->createView(),
            'forum' => $forum,
        ]);
    }

    // Obtener las respuestas de un foro en JSON, incluyendo sub-respuestas
    #[Route('/api/forums/{id}/responses', name: 'forum_responses', methods: ['GET'])]
    public function getResponses(int $id): JsonResponse
    {
        // Obtener el foro por su ID
        $forum = $this->entityManager->getRepository(Forum::class)->find($id);

        // Verificar si el foro existe
        if (!$forum) {
            return new JsonResponse(['error' => 'Foro no encontrado'], Response::HTTP_NOT_FOUND);
        }

        // Obtener las respuestas del foro
        $responses = $forum->getResponses();

        // Estructurar los datos de las respuestas y sub-respuestas para devolver en JSON
        $data = array_map(function ($response) {
            return [
                'id' => $response->getId(),
                'content' => $response->getContent(),
                'createdAt' => $response->getCreatedAt()->format('Y-m-d H:i:s'),
                'subResponses' => array_map(function ($subResponse) {
                    return [
                        'id' => $subResponse->getId(),
                        'content' => $subResponse->getContent(),
                        'createdAt' => $subResponse->getCreatedAt()->format('Y-m-d H:i:s')
                    ];
                }, $response->getSubResponses()->toArray()) // Obtener las sub-respuestas desde el $response
            ];
        }, $responses->toArray());

        // Retornar la respuesta como JSON
        return new JsonResponse($data, Response::HTTP_OK);
    }
 
    // Añadir una respuesta a un foro específico mediante JSON
    #[Route('/forums/{id}/response', name: 'add_forum_response', methods: ['POST'])]
    public function addResponseToForum(int $id, Request $request): JsonResponse
    {
        // Consultar el foro
        $forum = $this->entityManager->getRepository(Forum::class)->find($id);

        // Validar el contenido de la respuesta
        if (!$forum) {
            return new JsonResponse(['message' => 'Foro no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['content'])) {
            return new JsonResponse(['message' => 'Contenido de respuesta no proporcionado'], Response::HTTP_BAD_REQUEST);
        }

        // Crear nueva respuesta y asociarla al foro
        $responseEntity = new ResponseEntity();
        $responseEntity->setContent($data['content']);
        $responseEntity->setForum($forum);

        $this->entityManager->persist($responseEntity);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $responseEntity->getId(),
            'content' => $responseEntity->getContent(),
            'createdAt' => $responseEntity->getCreatedAt()->format('Y-m-d H:i:s'),
        ], Response::HTTP_CREATED);
    }

    // Añadir una sub-respuesta a una respuesta existente en un foro
    #[Route('/forums/{forumId}/response/{responseId}/subresponse', name: 'add_sub_response', methods: ['POST'])]
    public function addSubResponse(int $forumId, int $responseId, Request $request): JsonResponse
    {
        // Consultar el foro y la respuesta principal
        $forum = $this->entityManager->getRepository(Forum::class)->find($forumId);
        $parentResponse = $this->entityManager->getRepository(ResponseEntity::class)->find($responseId);

        if (!$forum || !$parentResponse) {
            return new JsonResponse(['error' => 'Foro o respuesta no encontrada'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Validar el contenido de la sub-respuesta
        if (!isset($data['content'])) {
            return new JsonResponse(['error' => 'Contenido de la sub-respuesta no proporcionado'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Crear y persistir la sub-respuesta
        $subResponse = new ResponseEntity();
        $subResponse->setContent($data['content']);
        $subResponse->setForum($forum);
        $subResponse->setParentResponse($parentResponse);

        $this->entityManager->persist($subResponse);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $subResponse->getId(),
            'content' => $subResponse->getContent(),
            'createdAt' => $subResponse->getCreatedAt() ? $subResponse->getCreatedAt()->format('Y-m-d H:i:s') : null,
        ], JsonResponse::HTTP_CREATED);
    }
}
