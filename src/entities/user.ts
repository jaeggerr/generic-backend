import Group from './group'
import { UDID_LENGTH } from './../helpers/udid'
import { BaseEntity, Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

@Entity('User')
export default class User extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: UDID_LENGTH
  })
  id: string

  @Column({
    type: 'varchar',
    nullable: false
  })
  username: string

  @Column({
    type: 'varchar',
    nullable: true
  })
  email: string

  @Column({
    type: 'varchar',
    nullable: false
  })
  password: string

  @ManyToOne(type => Group, {
    eager: false
  })
  @JoinColumn()
  group: Group

  @Column({
    type: 'varchar'
  })
  groupId: string
}
