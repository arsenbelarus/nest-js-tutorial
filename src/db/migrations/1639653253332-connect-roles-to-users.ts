import {MigrationInterface, QueryRunner} from "typeorm";

export class connectRolesToUsers1639653253332 implements MigrationInterface {
    name = 'connectRolesToUsers1639653253332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_roles_user_role" ("userId" integer NOT NULL, "userRoleId" integer NOT NULL, PRIMARY KEY ("userId", "userRoleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc94447a3cabad70eb2c96f5e1" ON "user_roles_user_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4698620c2fcf96fdbabb09f384" ON "user_roles_user_role" ("userRoleId") `);
        await queryRunner.query(`DROP INDEX "IDX_dc94447a3cabad70eb2c96f5e1"`);
        await queryRunner.query(`DROP INDEX "IDX_4698620c2fcf96fdbabb09f384"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_roles_user_role" ("userId" integer NOT NULL, "userRoleId" integer NOT NULL, CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4698620c2fcf96fdbabb09f3844" FOREIGN KEY ("userRoleId") REFERENCES "user_role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "userRoleId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_roles_user_role"("userId", "userRoleId") SELECT "userId", "userRoleId" FROM "user_roles_user_role"`);
        await queryRunner.query(`DROP TABLE "user_roles_user_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_roles_user_role" RENAME TO "user_roles_user_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_dc94447a3cabad70eb2c96f5e1" ON "user_roles_user_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4698620c2fcf96fdbabb09f384" ON "user_roles_user_role" ("userRoleId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4698620c2fcf96fdbabb09f384"`);
        await queryRunner.query(`DROP INDEX "IDX_dc94447a3cabad70eb2c96f5e1"`);
        await queryRunner.query(`ALTER TABLE "user_roles_user_role" RENAME TO "temporary_user_roles_user_role"`);
        await queryRunner.query(`CREATE TABLE "user_roles_user_role" ("userId" integer NOT NULL, "userRoleId" integer NOT NULL, PRIMARY KEY ("userId", "userRoleId"))`);
        await queryRunner.query(`INSERT INTO "user_roles_user_role"("userId", "userRoleId") SELECT "userId", "userRoleId" FROM "temporary_user_roles_user_role"`);
        await queryRunner.query(`DROP TABLE "temporary_user_roles_user_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_4698620c2fcf96fdbabb09f384" ON "user_roles_user_role" ("userRoleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dc94447a3cabad70eb2c96f5e1" ON "user_roles_user_role" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4698620c2fcf96fdbabb09f384"`);
        await queryRunner.query(`DROP INDEX "IDX_dc94447a3cabad70eb2c96f5e1"`);
        await queryRunner.query(`DROP TABLE "user_roles_user_role"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
    }

}
