import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUsers1716660000000 implements MigrationInterface {
  name = 'InsertUsers1716660000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'usuarios' table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`usuarios\` (
        \`id\` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '\\n',
        \`nome\` VARCHAR(100) NULL,
        \`login\` VARCHAR(100) NOT NULL,
        \`senha\` VARCHAR(100) NOT NULL,
        \`criado_em\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`alterado_em\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`login_UNIQUE\` (\`login\` ASC)
      ) ENGINE = InnoDB;
    `);

    await queryRunner.query(`
          INSERT INTO \`usuarios\` (nome, login, senha, criado_em)
          VALUES ('caio.mizuno', 'caio.dev', '$2b$10$2/pGuGAUZsoggfNlHHW2f.PSZ4T59zX0auQWbCefEHSWgrWdDbXdm', CURRENT_TIMESTAMP)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`usuarios\``);
  }
}
