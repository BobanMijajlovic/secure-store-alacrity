import 'reflect-metadata'
import gql from 'graphql-tag'

const QUERY = {
    secureRead:gql`
    query secureRead($id:String!,$key:String!) {
         secureRead(id:$id,key:$key){
              id,
              value
         }
    }
  `
}

const MUTATION = {
    secureStoring: gql`
        mutation secureStoring($id:String!,$key:String!, $value:JSON!) {
            secureStoring(id:$id, key:$key,value:$value) {
                response
            }
        }
    `
}

export {
    QUERY,
    MUTATION
}
