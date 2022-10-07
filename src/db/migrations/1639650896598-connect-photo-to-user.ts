import {MigrationInterface, QueryRunner} from "typeorm";

export class connectPhotoToUser1639650896598 implements MigrationInterface {
    name = 'connectPhotoToUser1639650896598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_photo_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" text, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_photo_entity"("id", "filename", "description") SELECT "id", "filename", "description" FROM "photo_entity"`);
        await queryRunner.query(`DROP TABLE "photo_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo_entity" RENAME TO "photo_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_photo_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" text, "userId" integer, CONSTRAINT "FK_19cd6e42249b6491818b06a550e" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_photo_entity"("id", "filename", "description", "userId") SELECT "id", "filename", "description", "userId" FROM "photo_entity"`);
        await queryRunner.query(`DROP TABLE "photo_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo_entity" RENAME TO "photo_entity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo_entity" RENAME TO "temporary_photo_entity"`);
        await queryRunner.query(`CREATE TABLE "photo_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" text, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "photo_entity"("id", "filename", "description", "userId") SELECT "id", "filename", "description", "userId" FROM "temporary_photo_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_photo_entity"`);
        await queryRunner.query(`ALTER TABLE "photo_entity" RENAME TO "temporary_photo_entity"`);
        await queryRunner.query(`CREATE TABLE "photo_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "description" text)`);
        await queryRunner.query(`INSERT INTO "photo_entity"("id", "filename", "description") SELECT "id", "filename", "description" FROM "temporary_photo_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_photo_entity"`);
    }

}
