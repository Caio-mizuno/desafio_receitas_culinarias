import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRecipes1716660000001 implements MigrationInterface {
  name = 'InsertRecipes1716660000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'categorias' table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`categorias\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(100) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`nome_UNIQUE\` (\`nome\` ASC)
      ) ENGINE = InnoDB;
    `);

    // Create 'receitas' table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`receitas\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`id_usuarios\` INT(10) UNSIGNED NOT NULL,
        \`id_categorias\` INT(10) UNSIGNED NULL,
        \`nome\` VARCHAR(45) NULL,
        \`tempo_preparo_minutos\` INT UNSIGNED NULL,
        \`porcoes\` INT UNSIGNED NULL,
        \`modo_preparo\` TEXT NOT NULL,
        \`ingredientes\` TEXT NULL,
        \`criado_em\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`alterado_em\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`fk_receitas_1_idx\` (\`id_usuarios\` ASC),
        INDEX \`fk_receitas_2_idx\` (\`id_categorias\` ASC),
        CONSTRAINT \`fk_receitas_1\`
          FOREIGN KEY (\`id_usuarios\`)
          REFERENCES \`usuarios\` (\`id\`)
          ON DELETE RESTRICT
          ON UPDATE CASCADE,
        CONSTRAINT \`fk_receitas_2\`
          FOREIGN KEY (\`id_categorias\`)
          REFERENCES \`categorias\` (\`id\`)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE = InnoDB;
    `);

    // Seed 'categorias'
    await queryRunner.query(`
      INSERT IGNORE INTO \`categorias\` (\`id\`, \`nome\`) VALUES
      (1, 'Bolos e tortas doces'),
      (2, 'Carnes'),
      (3, 'Aves'),
      (4, 'Peixes e frutos do mar'),
      (5, 'Saladas, molhos e acompanhamentos'),
      (6, 'Sopas'),
      (7, 'Massas'),
      (8, 'Bebidas'),
      (9, 'Doces e sobremesas'),
      (10, 'Lanches'),
      (11, 'Prato Único'),
      (12, 'Light'),
      (13, 'Alimentação Saudável');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`receitas\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`categorias\``);
  }
}
