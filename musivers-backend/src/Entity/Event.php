<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'event')]  // Asegura que Doctrine use la tabla 'event'
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups("event:read")]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups("event:read")]
    private string $title;

    #[ORM\Column(type: 'text')]
    #[Groups("event:read")]
    private string $description;

    #[ORM\Column(type: 'datetime')]
    #[Groups("event:read")]
    private \DateTimeInterface $date;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups("event:read")]
    private ?string $photoFilename = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups("event:read")]
    private ?string $url = null;  // Campo opcional para la URL

    #[ORM\Column(type: 'string', length: 255, nullable: true)]  // Hacer la categoría opcional
    #[Groups("event:read")]
    private ?string $category = null;  // Inicializamos con null

    // Getters y Setters para cada propiedad

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getDate(): \DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;
        return $this;
    }

    public function getPhotoFilename(): ?string
    {
        return $this->photoFilename;
    }

    public function setPhotoFilename(?string $photoFilename): self
    {
        $this->photoFilename = $photoFilename;
        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(?string $url): self
    {
        $this->url = $url;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(?string $category): self
    {
        $this->category = $category;
        return $this;
    }
}
