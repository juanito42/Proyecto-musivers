<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/hello", name="hello")
     */
    public function hello(): JsonResponse
    {
        return $this->json(['message' => 'Hello World!']);
    }
}
