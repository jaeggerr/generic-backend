import { UDID_LENGTH } from './../helpers/udid'
import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm'

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
}
