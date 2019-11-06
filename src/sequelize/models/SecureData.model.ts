import 'reflect-metadata'
import {Column, CreatedAt, DataType, Model,  Table, UpdatedAt}            from 'sequelize-typescript'
import {Arg, Field, Mutation, ObjectType, Query, Resolver,ArgsType, Args} from 'type-graphql'
import GraphQLJSON                                                        from 'graphql-type-json'
import nodersa                                                            from 'node-rsa'
import Sequelize                                                          from 'sequelize'
import {winstonLoggerInstance}                                            from '../../logger/WinstonLoggerClass'
import {IsEmpty, Length, MinLength}                                       from 'class-validator'
import {IsJSONObject, IsValidEncryptionKey, IsValidID}                    from '../graphql/validations'

@ObjectType()
@Table({
    tableName: 'secure_data'
})

export default class SecureDataModel extends Model<SecureDataModel> {
  @Field()
  @Column({
      primaryKey: true,
      type: DataType.STRING(256)
  })
    id: string

  @Field(type => String)
  @Column({
      allowNull: false,
      type: DataType.STRING(4352),
  })
  key: string

  @Field(type => GraphQLJSON)
  @Column({
      allowNull: false,
      type: DataType.BLOB,
  })
  value: any

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

  public static async getAll (id: string, publicKey: string): Promise<SecureDataModel[]> {

      const keyRsa = new nodersa()
      try {
          keyRsa.importKey(publicKey)
      } catch (e) {
          return []
      }
      const isLike = id.indexOf('*') !== -1
      const array = await SecureDataModel.findAll({
          where: {
              id: !isLike ? id : {
                  [Sequelize.Op.like]: id.replace(/\*/g, '%')
              }
          }
      })

      const arr = array.reduce((acc,x) => {
          let data = void(0)
          try {
              keyRsa.importKey(x.key)
              data = keyRsa.decrypt(x.value)
              data && (data = JSON.parse(data.toString()))
          } catch (e) {
              data = void(0)
          }
          if (data) {
              acc.resp.push({
                  id: x.id,
                  value: data
              } as SecureDataModel)
          } else {
              acc.error.push(x.id)
          }
          return acc
      }, {
          error: [],
          resp: []
      })
      arr.error.forEach(x => {
          winstonLoggerInstance.error(`encryption key not valid  id: ${x}`)
      })

      return arr.resp

  }

  /**
   *
   * @param id - key string
   * @param privateKey - key for rsa
   * @param data - valid json object
   */
  public static async insertUpdateOne (id: string, privateKey: string, data: object): Promise<SecureDataResponse> {
      const obj: SecureDataModel = await SecureDataModel.findOne({
          where: {
              id: id
          }
      })

      const keyRsa = new nodersa()
      let encData = void(0)
      try {
          keyRsa.importKey(privateKey)
          encData = keyRsa.encrypt(JSON.stringify(data))
      } catch (e) {
          throw ('Key is no valid')
      }

      if (obj) {
          await obj.update({
              value: encData,
              key: privateKey,
              updatedAt: new Date()
          })
      } else {
          await SecureDataModel.create({
              id: id,
              key: privateKey,
              value: encData
          })
      }
      return {
          response: 'OK'
      }

  }
}

@ObjectType('SecureDataSaveResponse')
class SecureDataResponse {
  @Field()
    response: string
}

@ObjectType('SecureRead')
class SecureRead {

  @Field()
    id: string
  @Field(type => GraphQLJSON)
  value: any
}

@ArgsType()
class SecureArgsSave {

  @MinLength(2,{
      message: 'Id must be min len 2'
  })
  @IsValidID({
      message: 'Id is not valid, can not have empty space'
  })
  @Field(type => String)
    id: string

  @IsValidEncryptionKey({
      message: 'Encryption key  is not valid'
  })
  @Field(type => String)
  key: string

  @IsJSONObject({
      message: 'value must be valid JSON object'
  })
  @Field(type => GraphQLJSON)
  value: JSON
}

@Resolver()
export class SecureDataResolver {

  @Mutation(returns => SecureDataResponse, {name: 'secureStoring'})
    save (  @Args() { id,key,value }: SecureArgsSave) {
        return  SecureDataModel.insertUpdateOne(id, key, value)
    }

  @Query(returns => [SecureDataModel]!, {name: 'secureRead'})
  read (@Arg('id', type => String) id: string,
        @Arg('key', type => String) key: string) {
      return SecureDataModel.getAll(id, key)
  }

}

