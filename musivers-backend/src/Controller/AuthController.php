<?php
// src/Controller/AuthController.php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AuthController extends AbstractController
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Validar la entidad usuario
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $em->persist($user);
        $em->flush();

        // Enviar correo de confirmación
        $this->sendConfirmationEmail($user->getEmail());

        return $this->json(['message' => 'Usuario registrado con éxito']);
    }

    private function sendConfirmationEmail($email)
    {
        // Personalizar el contenido del correo
        $subject = 'Bienvenido a Musivers';
        $message = 'Gracias por registrarte en Musivers. Esperamos que disfrutes de nuestra plataforma.';

        try {
            $response = $this->client->request('POST', 'https://api.resend.com/emails', [
                'json' => [
                    'from' => 'juan.carri.cano@gmail.com', // Cambia esto por tu dirección de envío
                    'to' => [$email],
                    'subject' => $subject,
                    'html' => '<p>' . $message . '</p>',
                ],
                'headers' => [
                    'Authorization' => 'Bearer ' . $_ENV['RESEND_API_KEY'],
                    'Content-Type' => 'application/json',
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                // Correo enviado con éxito
                return true;
            } else {
                // Error al enviar el correo
                $this->addFlash('error', 'Error al enviar el correo de confirmación.');
            }
        } catch (\Exception $e) {
            // Manejo de errores
            $this->addFlash('error', 'No se pudo enviar el correo: ' . $e->getMessage());
        }
    }
}
