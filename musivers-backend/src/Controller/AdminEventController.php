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
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\HttpFoundation\JsonResponse;

class AdminEventController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

     // Método para listar eventos en formato JSON para la API
     #[Route('/api/events', name: 'api_events', methods: ['GET'])]
     public function listEventsApi(): JsonResponse
     {
         $events = $this->entityManager->getRepository(Event::class)->findAll();
 
         $eventData = [];
         foreach ($events as $event) {
             $eventData[] = [
                 'id' => $event->getId(),
                 'title' => $event->getTitle(),
                 'description' => $event->getDescription(),
                 'date' => $event->getDate()->format('Y-m-d H:i'),
                 'category' => $event->getCategory(),  // Asegúrate de obtener la categoría
                 'url' => $event->getUrl(),
                 'photoFilename' => $event->getPhotoFilename(),
             ];
         }
 
         return new JsonResponse($eventData);
     }

    // Método para crear un nuevo evento
    #[Route('/admin/events/new', name: 'admin_create_event', methods: ['GET', 'POST'])]
    public function createEvent(Request $request): Response
    {
        $event = new Event();

        // Crear formulario con los mismos campos que en la plantilla
        $form = $this->createFormBuilder($event)
            ->add('title', TextType::class, ['label' => 'Título'])
            ->add('description', TextareaType::class, ['label' => 'Descripción'])
            ->add('date', DateTimeType::class, ['label' => 'Fecha del Evento'])
            ->add('category', ChoiceType::class, [
                'label' => 'Categoría',
                'choices' => [
                    'Rock' => 'Rock',
                    'Jazz' => 'Jazz',
                    'Pop' => 'Pop',
                    'Clásica' => 'Classical',
                ],
            ])
            ->add('url', UrlType::class, ['label' => 'Enlace del Evento', 'required' => false])
            ->add('photo', FileType::class, [
                'label' => 'Subir Foto',
                'mapped' => false,  // 'mapped' => false para que Symfony no lo mapee automáticamente
                'required' => false
            ])
            ->add('save', SubmitType::class, ['label' => 'Crear Evento'])
            ->getForm();

        // Procesar el formulario
        $form->handleRequest($request);

        // Si el formulario se ha enviado y es válido
        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $photoFile */
            $photoFile = $form->get('photo')->getData();

            // Si hay una foto, manejar la subida de archivo
            if ($photoFile instanceof UploadedFile) {
                $newFilename = uniqid() . '.' . $photoFile->guessExtension();
                try {
                    $photoFile->move($this->getParameter('photos_directory'), $newFilename);
                    $event->setPhotoFilename($newFilename);
                } catch (FileException $e) {
                    // manejar error
                }
            }

            // Persistir el nuevo evento en la base de datos
            $this->entityManager->persist($event);
            $this->entityManager->flush();

            // Redirigir a la lista de eventos
            return $this->redirectToRoute('event_list');
        }

        // Renderizar el formulario
        return $this->render('event/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    // Método para editar un evento
    #[Route('/admin/events/edit/{id}', name: 'admin_edit_event', methods: ['GET', 'POST'])]
public function editEvent(Request $request, Event $event, EntityManagerInterface $entityManager): Response
{
    // Crear el formulario de edición con los campos
    $form = $this->createFormBuilder($event)
        ->add('title', TextType::class, ['label' => 'Título'])
        ->add('description', TextareaType::class, ['label' => 'Descripción'])
        ->add('date', DateTimeType::class, ['label' => 'Fecha del Evento'])
        ->add('category', ChoiceType::class, [  // Campo de categoría editable
            'label' => 'Categoría',
            'choices' => [
                'Rock' => 'Rock',
                'Jazz' => 'Jazz',
                'Pop' => 'Pop',
                'Classical' => 'Classical',
            ],
        ])
        ->add('url', UrlType::class, ['label' => 'Enlace del Evento', 'required' => false])
        ->add('photo', FileType::class, [  // Asegúrate de tener este campo
            'label' => 'Foto del Evento',
            'mapped' => false,  // Importante para manejar archivos
            'required' => false,
        ])
        ->add('save', SubmitType::class, ['label' => 'Guardar Cambios'])
        ->getForm();

    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        // Si el usuario sube una nueva foto, manejar el archivo subido
        /** @var UploadedFile $photoFile */
        $photoFile = $form->get('photo')->getData();
        if ($photoFile) {
            $newFilename = uniqid() . '.' . $photoFile->guessExtension();

            try {
                $photoFile->move(
                    $this->getParameter('photos_directory'),  // Asegúrate de que este parámetro esté configurado
                    $newFilename
                );
                $event->setPhotoFilename($newFilename);  // Establecer el nombre del archivo de la foto
            } catch (FileException $e) {
                // Manejar el error si es necesario
            }
        }

        // Guardar los cambios en la base de datos
        $entityManager->flush();

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

    // Método que renderiza la vista Twig con los eventos
    #[Route('/events', name: 'event_list', methods: ['GET'])]
    public function listEvents(): Response
    {
        $events = $this->entityManager->getRepository(Event::class)->findAll();

        return $this->render('event/list.html.twig', [
            'events' => $events,
        ]);
    }
}
