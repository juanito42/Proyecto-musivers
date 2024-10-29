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
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): Response {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Generar un token de confirmación
        $verificationToken = Uuid::v4()->toRfc4122();
        $user->setVerificationToken($verificationToken);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $em->persist($user);
        $em->flush();

        // Generar la URL de confirmación y enviar el correo
        $confirmationUrl = $this->generateUrl(
            'email_verification',
            ['token' => $verificationToken],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $email = (new Email())
            ->from('admin@musivers.es')
            ->to($user->getEmail())
            ->subject('Confirma tu cuenta en Musivers')
            ->html("<p>Gracias por registrarte. Confirma tu cuenta haciendo clic en el siguiente enlace:</p><a href='$confirmationUrl'>Confirma tu cuenta</a>");

        $this->mailer->send($email);

        return $this->json(['message' => 'Usuario registrado. Verifica tu correo electrónico.'], Response::HTTP_CREATED);
    }

    #[Route('/verify-email/{token}', name: 'email_verification', methods: ['GET'])]
    public function verifyEmail(string $token, EntityManagerInterface $em): Response
    {
        $user = $em->getRepository(User::class)->findOneBy(['verificationToken' => $token]);

        if (!$user) {
            return $this->json(['message' => 'Token de verificación no válido.'], Response::HTTP_BAD_REQUEST);
        }

        $user->setIsVerified(true);
        $user->setVerificationToken(null); // Eliminar el token después de la verificación
        $em->flush();

        return $this->json(['message' => 'Correo electrónico verificado con éxito.']);
    }
}
