<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241121202029 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE forums ADD created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE forums ADD CONSTRAINT FK_FE5E5AB8B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_FE5E5AB8B03A8386 ON forums (created_by_id)');
        $this->addSql('ALTER TABLE response_entity ADD created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE response_entity ADD CONSTRAINT FK_65536347B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_65536347B03A8386 ON response_entity (created_by_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SCHEMA musivers');
        $this->addSql('ALTER TABLE response_entity DROP CONSTRAINT FK_65536347B03A8386');
        $this->addSql('DROP INDEX IDX_65536347B03A8386');
        $this->addSql('ALTER TABLE response_entity DROP created_by_id');
        $this->addSql('ALTER TABLE forums DROP CONSTRAINT FK_FE5E5AB8B03A8386');
        $this->addSql('DROP INDEX IDX_FE5E5AB8B03A8386');
        $this->addSql('ALTER TABLE forums DROP created_by_id');
    }
}
