<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\HttpFoundation\JsonResponse;

class AdminEventController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    // Método para listar eventos filtrados por categoría en formato JSON para la API
    #[Route('/api/events', name: 'api_events', methods: ['GET'])]
    public function listEventsApi(Request $request): JsonResponse
    {
        // Obtener parámetros de consulta para paginación y categoría
        $page = max(1, $request->query->getInt('page', 1)); // Página actual (por defecto, 1)
        $limit = max(1, $request->query->getInt('limit', 20)); // Límite de eventos por página (por defecto, 20)
        $category = $request->query->get('category'); // Categoría (opcional)

        $repository = $this->entityManager->getRepository(Event::class);
        $queryBuilder = $repository->createQueryBuilder('e');

        // Filtrar por categoría si se proporciona
        if ($category) {
            $queryBuilder->where('e.category = :category')
                ->setParameter('category', $category);
        }

        // Contar el total de eventos (sin paginación)
        $totalEvents = $queryBuilder->select('COUNT(e.id)')
            ->getQuery()
            ->getSingleScalarResult();

        // Aplicar límites y desplazamiento para la paginación
        $events = $queryBuilder->select('e')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        // Estructurar los datos de los eventos para devolver en JSON
        $eventData = array_map(fn(Event $event) => [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('Y-m-d H:i'),
            'category' => $event->getCategory(),
            'url' => $event->getUrl(),
            'photoFilename' => $event->getPhotoFilename(),
        ], $events);

        // Devolver los datos paginados
        return new JsonResponse([
            'data' => $eventData,
            'total' => (int)$totalEvents, // Total de eventos disponibles
            'page' => $page, // Página actual
            'limit' => $limit, // Límite por página
            'totalPages' => ceil($totalEvents / $limit), // Total de páginas
        ]);
    }


    // Método para devolver las categorías en formato JSON
    #[Route('/api/categories', name: 'api_categories', methods: ['GET'])]
    private function getCategories(): array
    {
        return [
            'Festivales' => [
                'Festivales de Música Rock' => 'Festivales de Música Rock',
                'Festivales de Jazz' => 'Festivales de Jazz',
                'Festivales de música Electrónica' => 'Festivales de música Electrónica',
                'Festivales de Música Indie' => 'Festivales de Música Indie',
                'Festivales Remember' => 'Festivales Remember',
                'Festivales de Ópera' => 'Festivales de Ópera',
                'Festivales de Música Clásica' => 'Festivales de Música Clásica',
                'Festivales de Blues' => 'Festivales de Blues',
                'Festivales de Reggae' => 'Festivales de Reggae',
                'Festivales Multicultural' => 'Festivales Multicultural',
            ],
            'Rock' => 'Rock',
            'Pop' => 'Pop',
            'Jazz' => 'Jazz',
            'Hip Hop' => 'Hip Hop',
            'Reggae' => 'Reggae',
            'Electrónica' => 'Electrónica',
            'Clásica' => 'Clásica',
            'Folk' => 'Folk',
            'Heavy Metal' => 'Heavy Metal',
            'Punk' => 'Punk',
            'Salsa' => 'Salsa',
            'Flamenco' => 'Flamenco',
            'Funk' => 'Funk',
            'Trap' => 'Trap',
            'K-pop' => 'K-pop',
            'Ópera' => 'Ópera',
        ];
    }

    // Método para crear un nuevo evento
    #[Route('/admin/events/new', name: 'admin_create_event', methods: ['GET', 'POST'])]
    public function createEvent(Request $request): Response
    {
        $event = new Event();

        // Crear el formulario
        $form = $this->createFormBuilder($event)
            ->add('title', TextType::class, ['label' => 'Título del Evento', 'required' => true])
            ->add('description', TextareaType::class, ['label' => 'Descripción', 'required' => true])
            ->add('date', DateTimeType::class, ['label' => 'Fecha del Evento', 'required' => true])
            ->add('category', ChoiceType::class, [
                'label' => 'Categoría',
                'choices' => $this->getCategories(),
                'required' => true
            ])
            ->add('url', UrlType::class, ['label' => 'Enlace', 'required' => false])
            ->add('photo', FileType::class, [
                'label' => 'Foto del Evento',
                'mapped' => false,
                'required' => false,
            ])
            ->getForm();

        $form->handleRequest($request);

        // Validar el formulario y manejar el envío
        if ($form->isSubmitted() && $form->isValid()) {
            $photoFile = $form->get('photo')->getData();
            if ($photoFile) {
                $newFilename = uniqid() . '.' . $photoFile->guessExtension();
                try {
                    $photoFile->move(
                        $this->getParameter('photos_directory'),
                        $newFilename
                    );
                    $event->setPhotoFilename($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error al subir la imagen');
                }
            }

            // Guardar el evento
            $this->entityManager->persist($event);
            $this->entityManager->flush();

            $this->addFlash('success', 'Evento creado exitosamente');
            return $this->redirectToRoute('event_list');
        }

        return $this->render('event/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }


    // Método para editar un evento
    #[Route('/admin/events/edit/{id}', name: 'admin_edit_event', methods: ['GET', 'POST'])]
    public function editEvent(Request $request, Event $event): Response
    {
        $form = $this->createFormBuilder($event)
            ->add('title', TextType::class, ['label' => 'Título'])
            ->add('description', TextareaType::class, ['label' => 'Descripción'])
            ->add('date', DateTimeType::class, ['label' => 'Fecha del Evento'])
            ->add('category', ChoiceType::class, [
                'label' => 'Categoría',
                'choices' => $this->getCategories(),  // Llamada a las categorías
            ])
            ->add('url', UrlType::class, ['label' => 'Enlace del Evento', 'required' => false])
            ->add('photo', FileType::class, [
                'label' => 'Foto del Evento',
                'mapped' => false,
                'required' => false,
            ])
            ->add('save', SubmitType::class, ['label' => 'Guardar Cambios'])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $photoFile */
            $photoFile = $form->get('photo')->getData();

            if ($photoFile instanceof UploadedFile) {
                $newFilename = uniqid() . '.' . $photoFile->guessExtension();

                try {
                    $photoFile->move($this->getParameter('photos_directory'), $newFilename);
                    $event->setPhotoFilename($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error al subir la imagen');
                }
            }

            $this->entityManager->flush();

            $this->addFlash('success', 'Evento actualizado con éxito');
            return $this->redirectToRoute('event_list');
        }

        return $this->render('event/edit.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    // Método para eliminar un evento
    #[Route('/admin/events/delete/{id}', name: 'admin_delete_event', methods: ['POST'])]
    public function deleteEvent(Request $request, Event $event): Response
    {
        $csrfToken = $request->request->get('_csrf_token');

        if (!$this->isCsrfTokenValid('delete' . $event->getId(), $csrfToken)) {
            $this->addFlash('error', 'Token CSRF inválido');
            return $this->redirectToRoute('event_list');
        }

        $this->entityManager->remove($event);
        $this->entityManager->flush();

        $this->addFlash('success', 'Evento eliminado con éxito');
        return $this->redirectToRoute('event_list');
    }

    // Método para listar eventos en una vista HTML
    #[Route('/events', name: 'event_list', methods: ['GET'])]
    public function listEvents(Request $request): Response
    {
        // Parámetros para la paginación
        $page = max(1, $request->query->getInt('page', 1)); // Página actual (por defecto, 1)
        $limit = max(1, min($request->query->getInt('limit', 20), 100)); // Límite por página (20 por defecto, 100 máximo)

        $repository = $this->entityManager->getRepository(Event::class);
        $queryBuilder = $repository->createQueryBuilder('e');

        // Contar el total de eventos
        $totalEvents = $queryBuilder->select('COUNT(e.id)')
            ->getQuery()
            ->getSingleScalarResult();

        // Obtener los eventos de la página actual
        $events = $queryBuilder->select('e')
            ->setFirstResult(($page - 1) * $limit) // Desplazamiento
            ->setMaxResults($limit) // Límite por página
            ->getQuery()
            ->getResult();

        // Calcular el total de páginas
        $totalPages = ceil($totalEvents / $limit);

        // Renderizar la vista con los datos de paginación
        return $this->render('event/list.html.twig', [
            'events' => $events,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'limit' => $limit,
        ]);
    }

    // Método para renderizar el formulario de creación de eventos en una página HTML
    #[Route('/admin/events/new', name: 'admin_create_event_form', methods: ['GET'])]
    public function createEventForm(Request $request): Response
    {
        $event = new Event();

        // Crear el formulario
        $form = $this->createFormBuilder($event)
            ->add('title', TextType::class, ['label' => 'Título del Evento', 'required' => true])
            ->add('description', TextareaType::class, ['label' => 'Descripción del Evento', 'required' => true])
            ->add('date', DateTimeType::class, ['label' => 'Fecha del Evento', 'required' => true])
            ->add('category', ChoiceType::class, [
                'label' => 'Categoría',
                'choices' => $this->getCategories(), // Llamada a las categorías
                'required' => true,
            ])
            ->add('url', UrlType::class, ['label' => 'Enlace del Evento', 'required' => false])
            ->add('photo', FileType::class, [
                'label' => 'Foto del Evento',
                'mapped' => false,
                'required' => false,
            ])
            ->add('save', SubmitType::class, ['label' => 'Crear Evento'])
            ->getForm();

        // Renderizar el formulario
        return $this->render('event/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    // Método para manejar la solicitud JSON de creación de eventos desde el cliente
    #[Route('/api/admin/events/new', name: 'admin_create_event_api', methods: ['POST'])]
    public function createEventApi(Request $request): JsonResponse
    {
        $event = new Event();

        // Obtener los datos del request manualmente si es un envío multipart
        $title = $request->get('title');
        $description = $request->get('description');
        $date = $request->get('date');
        $category = $request->get('category');
        $url = $request->get('url');

        // Configurar los datos en la entidad Event
        if (!$title || !$description || !$date || !$category) {
            return new JsonResponse(['error' => 'Todos los campos son obligatorios.'], 400);
        }

        $event->setTitle($title);
        $event->setDescription($description);
        $event->setDate(new \DateTime($date));
        $event->setCategory($category);
        $event->setUrl($url);

        // Manejo del archivo (si se subió una foto)
        /** @var UploadedFile $photoFile */
        $photoFile = $request->files->get('photo');
        if ($photoFile instanceof UploadedFile) {
            $newFilename = uniqid() . '.' . $photoFile->guessExtension();

            try {
                $photoFile->move(
                    $this->getParameter('photos_directory'),
                    $newFilename
                );
                $event->setPhotoFilename($newFilename);
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Error al subir la imagen.'], 500);
            }
        }

        // Persistir el evento en la base de datos
        try {
            $this->entityManager->persist($event);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al guardar el evento en la base de datos.'], 500);
        }

        return new JsonResponse(['message' => 'Evento creado correctamente'], 200);
    }
}
