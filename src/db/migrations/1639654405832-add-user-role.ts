import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserRole, UserRoleName } from '../../users/entities/user.entity';

export class addUserRole1639654405832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const admin = UserRole.create({ name: UserRoleName.ADMIN });
    await admin.save();
    const manager = UserRole.create({ name: UserRoleName.MANAGER });
    await manager.save();
    const sales = UserRole.create({ name: UserRoleName.SALES });
    await sales.save();
    const user = UserRole.create({ name: UserRoleName.USER });
    await user.save();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await UserRole.clear();
  }
}
