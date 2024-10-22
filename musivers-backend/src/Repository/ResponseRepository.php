<?php

namespace App\Repository;

use App\Entity\ResponseEntity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ResponseEntity>
 *
 * @method ResponseEntity|null find($id, $lockMode = null, $lockVersion = null)
 * @method ResponseEntity|null findOneBy(array $criteria, array $orderBy = null)
 * @method ResponseEntity[]    findAll()
 * @method ResponseEntity[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ResponseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ResponseEntity::class);
    }

    // Métodos personalizados si los necesitas
}
