import { UDID_LENGTH } from './../helpers/udid'
import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('Group')
export default class Group extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: UDID_LENGTH
  })
  id: string

  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string
}
