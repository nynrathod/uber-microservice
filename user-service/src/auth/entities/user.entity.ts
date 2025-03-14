import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Ride } from './ride.entity'; // Assuming you will create a Ride entity

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['user', 'driver'],
    default: 'user',
  })
  role: 'user' | 'driver';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // // Assuming that a User can have many rides
  // @OneToMany(() => Ride, (ride) => ride.user)
  // rides: Ride[];
}
