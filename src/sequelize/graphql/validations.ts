import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator'
import * as _                                                      from 'lodash'
import nodersa                                                     from 'node-rsa'

export function IsValidID (validationOptions?: ValidationOptions) {
    return function(object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                async validate (input: string) {
                    return  (/\s/.exec(input)) ? false :  true
                }
            }
        })
    }
}

export function IsValidEncryptionKey (validationOptions?: ValidationOptions) {
    return function(object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                async validate (input: string) {
                    const keyRsa = new nodersa()
                    try {
                        keyRsa.importKey(input)
                        return true
                    } catch (e) {
                        return false
                    }
                }
            }
        })
    }
}

export function IsJSONObject (validationOptions?: ValidationOptions) {
    return function(object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                async validate (input: any) {
                    if (!_.isPlainObject(input) || _.isEmpty(input)) {
                        return false 
                    }
                    try {
                        const str = JSON.stringify(input)
                        JSON.parse(str)
                        return true
                    } catch (e) {
                        return false
                    }
                }
            }
        })
    }
}

