<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'rock_groups')]
class GruposRock
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups("rock_group:read")]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups("rock_group:read")]
    private string $name;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups("rock_group:read")]
    private ?string $biography = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups("rock_group:read")]
    private ?string $photoFilename = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups("rock_group:read")]
    private ?string $officialWebsite = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups("rock_group:read")]
    private ?array $albums = null; // Lista de álbumes del grupo

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups("rock_group:read")]
    private ?array $members = null; // Lista de miembros del grupo

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups("rock_group:read")]
    private ?\DateTimeInterface $formationDate = null; // Fecha de formación del grupo

    ######### Getters y Setters #########

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getBiography(): ?string
    {
        return $this->biography;
    }

    public function setBiography(?string $biography): self
    {
        $this->biography = $biography;
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

    public function getOfficialWebsite(): ?string
    {
        return $this->officialWebsite;
    }

    public function setOfficialWebsite(?string $officialWebsite): self
    {
        $this->officialWebsite = $officialWebsite;
        return $this;
    }

    public function getAlbums(): ?array
    {
        return $this->albums;
    }

    public function setAlbums(?array $albums): self
    {
        $this->albums = $albums;
        return $this;
    }

    public function getMembers(): ?array
    {
        return $this->members;
    }

    public function setMembers(?array $members): self
    {
        $this->members = $members;
        return $this;
    }

    public function getFormationDate(): ?\DateTimeInterface
    {
        return $this->formationDate;
    }

    public function setFormationDate(?\DateTimeInterface $formationDate): self
    {
        $this->formationDate = $formationDate;
        return $this;
    }
}
