<?php
// src/Form/ResponseType.php

namespace App\Form;

use App\Entity\ResponseEntity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResponseType extends AbstractType
{
    // Método que construye el formulario de respuesta
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('content', TextareaType::class, [
                'label' => 'Escribe tu respuesta',
                'attr' => ['class' => 'form-control']
            ]);
    }

    // Método para configurar las opciones del formulario
    public function configureOptions(OptionsResolver $resolver)
    {
        // Define que este formulario está asociado a la clase 'ResponseEntity'
        $resolver->setDefaults([
            'data_class' => ResponseEntity::class,
        ]);
    }
}
