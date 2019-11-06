import 'reflect-metadata'
import {AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt} from 'sequelize-typescript'
import {Field, ID, Int, ObjectType}                                                      from 'type-graphql'

@ObjectType()
@Table({
  tableName: 'winston_logger'
})

export default class WinstonLoggerModel extends Model<WinstonLoggerModel> {
  @Field(type => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Field(type => String)
  @Column({
    allowNull: true,
    type: DataType.STRING(16)
  })
  level: string

  @Field(type => String)
  @Column({
    allowNull: true,
    type: DataType.STRING(512)
  })
  message: string

  @Field(type => String)
  @Column({
    allowNull: true,
    type: DataType.STRING(4096)
  })
  meta: string

  @Field(type => Int)
  @Column({
    allowNull: true,
    defaultValue: 0,
    type: DataType.SMALLINT
  })
  status: number

  @Field()
  @CreatedAt
  @Column({
    field: 'created_at'
  })
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column({
    field: 'updated_at'
  })
  updatedAt: Date


  public static  async addLog(data:any) {
      await WinstonLoggerModel.create(data)
  }

  public static async getLastRecord() : Promise<WinstonLoggerModel | undefined > {
      const arr = await  WinstonLoggerModel.findAll({
         order: ['id','DESC'],
         limit: 1
      })
      return arr.length === 0 ? void(0): arr[0]
  }
}


