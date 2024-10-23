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
    ) {
    }

    // Método para listar eventos filtrados por categoría en formato JSON para la API
    #[Route('/api/events', name: 'api_events', methods: ['GET'])]
    public function listEventsApi(Request $request): JsonResponse
    {
        // Obtener la categoría de los parámetros de la URL
        $category = $request->query->get('category');

        // Si se proporciona una categoría, filtrar por esa categoría
        if ($category) {
            $events = $this->entityManager->getRepository(Event::class)->findBy([
                'category' => $category
            ]);
        } else {
            // Si no hay categoría, devolver todos los eventos
            $events = $this->entityManager->getRepository(Event::class)->findAll();
        }

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

        return new JsonResponse($eventData);
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
    #[Route('/admin/events/new', name: 'admin_create_event', methods: ['POST'])]
    #[Route('/admin/events/new', name: 'admin_create_event', methods: ['POST'])]
    public function createEvent(Request $request): JsonResponse
    {
        $event = new Event();
    
        // Obtener los datos del request manualmente si es un envío multipart
        $title = $request->get('title');
        $description = $request->get('description');
        $date = $request->get('date');
        $category = $request->get('category');
        $url = $request->get('url');
    
        // Configurar los datos en la entidad Event
        $event->setTitle($title);
        $event->setDescription($description);
        $event->setDate(new \DateTime($date)); // Convertir la fecha a un objeto DateTime
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

    // Método para listar eventos en la vista
    #[Route('/events', name: 'event_list', methods: ['GET'])]
    public function listEvents(): Response
    {
        $events = $this->entityManager->getRepository(Event::class)->findAll();

        return $this->render('event/list.html.twig', [
            'events' => $events,
        ]);
    }
}
