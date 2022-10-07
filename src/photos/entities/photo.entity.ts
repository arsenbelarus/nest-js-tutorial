import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne((type) => User, { eager: true })
  user: User;
}
