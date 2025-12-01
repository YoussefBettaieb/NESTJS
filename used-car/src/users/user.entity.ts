import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user) // one user to many  reports
  reports: Report[];

  @AfterInsert() // hooks executed after saving
  logInsert() {
    console.log('inserted user with id:', this.id);
  }

  @AfterUpdate() // hooks executed after updating
  logUpdate() {
    console.log('updated user with id:', this.id);
  }

  @AfterRemove() // hooks executed after removing
  logRemove() {
    console.log('removed user with id:', this.id);
  }
}
