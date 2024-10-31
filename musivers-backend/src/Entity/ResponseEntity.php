<?php

// src/Entity/ResponseEntity.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ResponseRepository;
use Doctrine\Common\Collections\ArrayCollection; 
use Doctrine\Common\Collections\Collection;     

#[ORM\Entity]
class ResponseEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    private string $content;

    #[ORM\ManyToOne(targetEntity: Forum::class, inversedBy: 'responses')]
    #[ORM\JoinColumn(nullable: false)]
    private Forum $forum;

    #[ORM\ManyToOne(targetEntity: ResponseEntity::class, inversedBy: 'subResponses')]
    #[ORM\JoinColumn(nullable: true)]
    private ?ResponseEntity $parentResponse = null;

    #[ORM\OneToMany(mappedBy: 'parentResponse', targetEntity: ResponseEntity::class)]
    private Collection $subResponses;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->subResponses = new ArrayCollection();
    }
    
    #########Getters y Setters#########

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getForum(): Forum
    {
        return $this->forum;
    }

    public function setForum(Forum $forum): self
    {
        $this->forum = $forum;
        return $this;
    }

    public function getParentResponse(): ?ResponseEntity
    {
        return $this->parentResponse;
    }

    public function setParentResponse(?ResponseEntity $parentResponse): self
    {
        $this->parentResponse = $parentResponse;
        return $this;
    }

    public function getSubResponses(): Collection
    {
        return $this->subResponses;
    }

    public function addSubResponse(ResponseEntity $subResponse): self
    {
        if (!$this->subResponses->contains($subResponse)) {
            $this->subResponses->add($subResponse);
            $subResponse->setParentResponse($this);
        }

        return $this;
    }

    public function removeSubResponse(ResponseEntity $subResponse): self
    {
        if ($this->subResponses->removeElement($subResponse)) {
            if ($subResponse->getParentResponse() === $this) {
                $subResponse->setParentResponse(null);
            }
        }

        return $this;
    }

    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }
}