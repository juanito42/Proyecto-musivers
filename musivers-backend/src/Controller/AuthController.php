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
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Uid\Uuid;

class AuthController extends AbstractController
{
    // Dependencia de MailerInterface para enviar correos
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    // Ruta para registrar un nuevo usuario
    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): Response {
        // Obtiene y decodifica el contenido JSON de la solicitud
        $data = json_decode($request->getContent(), true);

        // Crear una nueva instancia de User y configurar los datos básicos
        $user = new User();
        $user->setEmail($data['email']);

        // Hashea la contraseña proporcionada antes de guardarla
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Genera un token único para verificar la cuenta del usuario
        $verificationToken = Uuid::v4()->toRfc4122();
        $user->setVerificationToken($verificationToken);

        // Validación de los datos del usuario
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            // Si hay errores, devuelve un JSON con el mensaje de error y el código 400
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        // Guardar el nuevo usuario en la base de datos
        $em->persist($user);
        $em->flush();

        // Generar la URL de confirmación y enviar el correo de verificación
        $confirmationUrl = $this->generateUrl(
            'email_verification',
            ['token' => $verificationToken],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        // Crear y configurar el correo electrónico de verificación
        $email = (new Email())
            ->from('admin@musivers.es')
            ->to($user->getEmail())
            ->subject('Confirma tu cuenta en Musivers')
            ->html("<p>Gracias por registrarte en Musivers. Confirma tu cuenta haciendo clic en el siguiente enlace:</p><a href='$confirmationUrl'>Confirma tu cuenta</a>");

            try {
                // Intentar enviar el correo
                $this->mailer->send($email);
            } catch (\Exception $e) {
                // Manejar cualquier error relacionado con el envío de correos
                return $this->json([
                    'message' => 'No se pudo enviar el correo.',
                    'error' => $e->getMessage(),
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

        // Responder en JSON con un mensaje indicando que el usuario debe verificar su correo
        return $this->json(['message' => 'Usuario registrado. Verifica tu correo electrónico.'], Response::HTTP_CREATED);
    }

    // Ruta para verificar el correo electrónico de un usuario a través de un token único
    #[Route('/verify-email/{token}', name: 'email_verification', methods: ['GET'])]
    public function verifyEmail(string $token, EntityManagerInterface $em, MailerInterface $mailer): Response
    {
        // Buscar al usuario por el token de verificación
        $user = $em->getRepository(User::class)->findOneBy(['verificationToken' => $token]);

        // Si no se encuentra el usuario, devuelve un error 400 con mensaje de token inválido
        if (!$user) {
            return $this->json(['message' => 'Token de verificación no válido.'], Response::HTTP_BAD_REQUEST);
        }

        // Marcar al usuario como verificado y eliminar el token de verificación
        $user->setIsVerified(true);
        $user->setVerificationToken(null); // Eliminar el token después de la verificación
        $em->flush();

        // Enviar un correo al administrador notificando la verificación del usuario
        $email = (new Email())
            ->from('no-reply@musivers.es')
            ->to('admin@musivers.es')
            ->subject('Nuevo usuario verificado')
            ->html("<p>El usuario con correo electrónico <strong>{$user->getEmail()}</strong> ha verificado su cuenta con éxito.</p>");

        // Intentar enviar el correo
        try {
            $mailer->send($email);
        } catch (\Exception $e) {
            return $this->json(['message' => 'El usuario fue verificado, pero no se pudo enviar el correo al administrador.', 'error' => $e->getMessage()], Response::HTTP_OK);
        }

        // Responder en JSON confirmando que la verificación fue exitosa
        return $this->json(['message' => 'Correo electrónico verificado con éxito.']);
    }
}
