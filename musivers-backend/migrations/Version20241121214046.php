<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241121214046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE forums DROP CONSTRAINT fk_fe5e5ab8b03a8386');
        $this->addSql('DROP INDEX idx_fe5e5ab8b03a8386');
        $this->addSql('ALTER TABLE forums DROP created_by_id');
        $this->addSql('ALTER TABLE response_entity DROP CONSTRAINT fk_65536347b03a8386');
        $this->addSql('DROP INDEX idx_65536347b03a8386');
        $this->addSql('ALTER TABLE response_entity DROP created_by_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA musivers');
        $this->addSql('ALTER TABLE response_entity ADD created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE response_entity ADD CONSTRAINT fk_65536347b03a8386 FOREIGN KEY (created_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_65536347b03a8386 ON response_entity (created_by_id)');
        $this->addSql('ALTER TABLE forums ADD created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE forums ADD CONSTRAINT fk_fe5e5ab8b03a8386 FOREIGN KEY (created_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_fe5e5ab8b03a8386 ON forums (created_by_id)');
    }
}
