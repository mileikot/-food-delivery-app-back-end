import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionsAndRoles1733773531088
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO role (id, "roleName", "createdDate", "updatedDate") VALUES
    (1, 'Admin', NOW(), NOW()),
    (2, 'User', NOW(), NOW()),
    (3, 'Moderator', NOW(), NOW());

    INSERT INTO permission (id, "permissionName", "createdDate", "updatedDate") VALUES
    (1, 'CREATE_USER', NOW(), NOW()),
    (2, 'DELETE_USER', NOW(), NOW()),
    (3, 'UPDATE_USER', NOW(), NOW()),
    (4, 'VIEW_USER', NOW(), NOW()),

    (5, 'CREATE_PRODUCT', NOW(), NOW()),
    (6, 'DELETE_PRODUCT', NOW(), NOW()),
    (7, 'UPDATE_PRODUCT', NOW(), NOW()),
    (8, 'VIEW_PRODUCT', NOW(), NOW()),
    
    (9, 'CREATE_ORDER', NOW(), NOW()),
    (10, 'DELETE_ORDER', NOW(), NOW()),
    (11, 'UPDATE_ORDER', NOW(), NOW()),
    (12, 'VIEW_ORDER', NOW(), NOW()),
    
    (13, 'CREATE_REVIEW', NOW(), NOW()),
    (14, 'DELETE_REVIEW', NOW(), NOW()),
    (15, 'UPDATE_REVIEW', NOW(), NOW()),
    (16, 'VIEW_REVIEW', NOW(), NOW());

    INSERT INTO role_permissions ("roleId", "permissionId", "grantedAt") VALUES
    (1, 1, NOW()),
    (1, 2, NOW()),
    (1, 3, NOW()),
    (1, 4, NOW()),

    (1, 5, NOW()),
    (1, 6, NOW()),
    (1, 7, NOW()),
    (1, 8, NOW()),

    (1, 9, NOW()),
    (1, 10, NOW()),
    (1, 11, NOW()),
    (1, 12, NOW()),

    (1, 13, NOW()),
    (1, 14, NOW()),
    (1, 15, NOW()),
    (1, 16, NOW()),
    
    
    (2, 8, NOW()),

    (2, 12, NOW()),

    (2, 13, NOW()),
    (2, 16, NOW()),

    
    (3, 4, NOW()),

    (3, 5, NOW()),
    (3, 6, NOW()),
    (3, 7, NOW()),
    (3, 8, NOW()),

    (3, 9, NOW()),
    (3, 10, NOW()),
    (3, 11, NOW()),
    (3, 12, NOW()),

    (3, 13, NOW()),
    (3, 14, NOW()),
    (3, 15, NOW()),
    (3, 16, NOW());
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM role_permissions WHERE "roleId" IN (1, 2, 3);
        DELETE FROM permissions WHERE id BETWEEN 1 AND 16;
        DELETE FROM role WHERE id IN (1, 2, 3);
      `);
  }
}
