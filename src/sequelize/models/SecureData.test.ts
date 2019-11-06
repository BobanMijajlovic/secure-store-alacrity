import 'reflect-metadata'
import 'jest-extended'
import {createTestApolloServer} from "../../apolloServer"
import {MUTATION, QUERY}        from '../graphql/graphSchems'
import {GraphQLResponse}        from 'apollo-server-types';

describe("Secure data", () => {

  const privateKey = [
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICWwIBAAKBgHZ5U0I4lENxdeocaPnNXamjWAZkiq5k2T4u7uD7NDSzfbTUhDks\n' +
    'Uk6b0Q6V8uXMcwehk+BxZ3XK5HpyhWdF5BaO/Lm7D3Z6r/jAx2Q59eF/Lz0PzJb4\n' +
    'kIPEk0ISy73KuT1tx20p/fGz4JOqgxGZr9PvA3LvA/LhOGcF4DrDAcE3AgMBAAEC\n' +
    'gYBXAiWOdcUVfwdtRy4lf5ixFEB6eW6MQ450p71SR8sAhW3l10nAP3e3OaIghymb\n' +
    'cTptuVHEPSURkk+YSfEFdoPauXfFj7j5hugxqDVjOKUVis2uiTtsqvM0OIGIVER3\n' +
    'Le0faSjXdIZ9aaUPWixMmBI7xSILi0GklGGUOh1JWmFUwQJBALQddPEox0cxUjnD\n' +
    'jefqDyav2jSHUYwTfBVj4N1PFusDf95qhEU3WBn6V6AOGdf4UZk1K8oxhmKMjbNs\n' +
    'oT8WNmECQQCoY3vUmuPQxg14kZ+6XM4TRaH0QNdVOX2izd7nf4mfpKY5kFFy8rQ3\n' +
    'P60AKraJD8wJPLAI3YJUE81NnTC5ym6XAkEAj2wtZKNOG9igWzLm2tc8fVfmb5GZ\n' +
    'U+toEThZJKEH5NgCiD9VWDB7zSPVhrPzzFAF2fPHDNhm5C5733YO6EdtwQJAZqyq\n' +
    'f/ul99Ibuq3I4GDgQv4Nf5rd8hhpFBFF3pB0wUQrGyR1lYqJ+ro36cchoDdiqSs5\n' +
    'B17RriSY5b94S4E0pwJAdJtVlDkjDFC+J4RzPvO6Cwinvwon0IVIbe1usJ6W7Zwy\n' +
    'c2nnKym8TQ/acQ1ABjJgs+hWoxfyHz9Qljwyz6YxyA==\n' +
    '-----END RSA PRIVATE KEY-----',

    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEowIBAAKCAQEAgB9CDJpiqJfZxarzr3b5MDrm551RGQ2S6n7HhJIn9fX3soNI\n' +
    'SdFOhRxyG/n49SKpTIebbx7tKljhXUZM8EKdwLNoiT8gvi+jjSj5Z+zeRsxscGTx\n' +
    'fd00J4f97loFvia97w0ywCc5EUCbFKI/vxrohp+U6ob5NaN1xw2CX5tou8z5vJY/\n' +
    '/G26sZ6D1LCc+Tt/67XxErgIKgXOPo7SqnABNjZN9izS3SduRBFIyoEo1qfvsT4C\n' +
    'hr3uBdjmpMPF5AdiSeG1TrhbSVbVG/raqcGAqooGp1rGd2MTJB4MbTX+niatsiJG\n' +
    'Jvbh9aR091b4PF9TznopFt3QflBC0H9xr9YnaQIDAQABAoIBAEFesXZ4tunKQISI\n' +
    'Srk1/MJM6081hxE/Sbx3XxkW8WifTPg534I6VtO3xcjca9e3DaZMclPp9ZvrqWDL\n' +
    '46mac57EawvLt8sRx2LYixgpVOfOmW1nM4fCez/INRmNuOxiG/qCQ2ijGozg579J\n' +
    'YTkCY618cqCOqUxi0E71Z5WcV32pwwNkRk2uxsUpehdICDEWUhE6okvBkUTEFrCo\n' +
    '/2c+RC+WXqfu3ljEEhnmqc5qOrksCNLPDwDc5MGnQmh6GpJlM1JWUa/GAF1Gxm88\n' +
    'qvW6IE6wXXxDIZ5XoeNOuM2DfQwuHdpQbvvfZ2THS+Hfr5aiD8zeDxvB09qDQyBt\n' +
    'Ms+22wECgYEA6LrKSh678gsQjrIfCZpV6+hybfTFlecIouAMdT1InxDXxd1uDrLv\n' +
    'KGfz/pKfPADQKO7te4/0OKWVq/EzRbWA/W55pTdb9ul8HeFeRByURMrFu8Agp5oi\n' +
    'Sh53X6rpAX95w/uW8N16t3BextCHWFdZQE1RrzuslX5h8n0HLxwCPzECgYEAjO7Q\n' +
    'vXULZqef3OfgixQQQkvl6f6qdQfUH1AeUP3DHCgDk7NmMzHH3IeCnHNK4TACTDIr\n' +
    'RlU/ebOHWgBCCM5iF3GK6aCDHWjB1glUWE40rNrBLtToxO0Tdc9VxAvu/AzvcWds\n' +
    '5f9nKewKX0Vcky7r907j4PfVcECCD653TR7RDbkCgYBR1BN6WjIVGaTZt3FITBa3\n' +
    '2sQZOz4ZxeD4e7SFqGWXYDGt5Xxj+LA0UdCtitooG9UU/2VK08O4AyiMC0PO19Gh\n' +
    'yi1FVSClwVSdoPcnFbFgOrepmxUgOQajbvDkF1DT8QFcUmKxD/6s7vq0Bu//tL6x\n' +
    '6D23UlENQyGnRCS5gKydkQKBgFeXZi0aPcfDjtwhUbGe+qv5uB/Co/awsunzRaRY\n' +
    '05cAV5jI+0/+NJWfs1HBZlynFgZ9d9/yw8zEA++wEVqfyt9/NjMWC+ePYEnC6qUn\n' +
    'lh2IqGCO+0zJfDrQbiG2uQX2lCsLeOdJ4bhwd9HWrj7b/tRqN79uyT1HGo7chFFu\n' +
    'QcghAoGBAOP9ke5RmTQhI29VHz6sOQ6qDWHjJdlEPWC5QAGG7Oc34Uh1RsUIyrLG\n' +
    'mEpmXYA7YYMKQG7pcqjnAUSrkL2T7VK8gePSWtPR2EAbjhIr/ahOtDEeeCphqXlt\n' +
    'x4owKpQ2nhVJXpf8iEIYteFCm+CepRLsERa6KLuhVYF94MTDFkD1\n' +
    '-----END RSA PRIVATE KEY-----',

    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIBOwIBAAJBAIePggltPkKgszzayRWw1XDECnwuju4clhXO04qFk+K4xLK5q7hA\n' +
    'CaIWnsEykULfqHFfSSidH2HUI72KmRIQFJcCAwEAAQJAatCxbiweOvHVScY7XFQS\n' +
    'WuCeQmuNRCJSQKzQEv5eIO645AKB2UF5U6kadEQzU73UDSnDL0jcAgNjTE6mKwOK\n' +
    'wQIhAOqacokmYoMc9XZ/LIkxHE0nmQPba80dB6bZDy0SV/MLAiEAk+yYpTA/ZDqj\n' +
    'NYRhShADK1NNtIAsoBDZJwgqbPFGXCUCIQDH2fxaM5XWJZRBdsLkuC5o16O1MnWa\n' +
    'DPHYw6328lpz0wIgVo9mq5NWJQKjKtfyTnKcSCgRGoS+mFQDnnGK0gFGGPkCIQCF\n' +
    'KbJPfmXfKts0t2EXy9hDARxSmIyxNeRj8Tu/VcAsGw==\n' +
    '-----END RSA PRIVATE KEY-----'
  ]

  const publicKey = [
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHZ5U0I4lENxdeocaPnNXamjWAZk\n' +
    'iq5k2T4u7uD7NDSzfbTUhDksUk6b0Q6V8uXMcwehk+BxZ3XK5HpyhWdF5BaO/Lm7\n' +
    'D3Z6r/jAx2Q59eF/Lz0PzJb4kIPEk0ISy73KuT1tx20p/fGz4JOqgxGZr9PvA3Lv\n' +
    'A/LhOGcF4DrDAcE3AgMBAAE=\n' +
    '-----END PUBLIC KEY-----',

    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgB9CDJpiqJfZxarzr3b5\n' +
    'MDrm551RGQ2S6n7HhJIn9fX3soNISdFOhRxyG/n49SKpTIebbx7tKljhXUZM8EKd\n' +
    'wLNoiT8gvi+jjSj5Z+zeRsxscGTxfd00J4f97loFvia97w0ywCc5EUCbFKI/vxro\n' +
    'hp+U6ob5NaN1xw2CX5tou8z5vJY//G26sZ6D1LCc+Tt/67XxErgIKgXOPo7SqnAB\n' +
    'NjZN9izS3SduRBFIyoEo1qfvsT4Chr3uBdjmpMPF5AdiSeG1TrhbSVbVG/raqcGA\n' +
    'qooGp1rGd2MTJB4MbTX+niatsiJGJvbh9aR091b4PF9TznopFt3QflBC0H9xr9Yn\n' +
    'aQIDAQAB\n' +
    '-----END PUBLIC KEY-----',

    '-----BEGIN PUBLIC KEY-----\n' +
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIePggltPkKgszzayRWw1XDECnwuju4c\n' +
    'lhXO04qFk+K4xLK5q7hACaIWnsEykULfqHFfSSidH2HUI72KmRIQFJcCAwEAAQ==\n' +
    '-----END PUBLIC KEY-----'
  ]

  const objectTestJson = [
    {
      number: 1,
      firstName: "Boban",
      lastName: "Mijajlovic",
      address: {
        city: "Beograd"
      }
    },
    {
      number: 2,
      firstName: "Ivana",
      lastName: "Mijajlovic",
      hobbies: ['bikes', 'cookie', 'fitness'],
      male: false,
      address: {
        city: "Beograd",
        zip: 37000,

      }
    },
    {
      number: 3,
      firstName: "Peter",
      lastName: "Jon",
      age:34,
      male: true,
      address: {
        city: "Paris",
        zip: 86336,

      }
    }
  ]

  const checkObjectCorrect = (index: number, id: string, response: GraphQLResponse) => {
    expect(response).toHaveProperty('data.secureRead')
    expect(response.data.secureRead).toBeArrayOfSize(1)
    let objRes = response.data.secureRead[0]
    expect(objRes).toBeObject()
    expect(objRes).toHaveProperty('id', id)
    expect(objRes).toHaveProperty('value')
    expect(objRes.value).toBeObject()
    expect(objRes.value).toEqual(objectTestJson[index])
  }

  it('Insert Valid data - read', async (done) => {

    const {mutate, query} = createTestApolloServer()

    let response = await mutate({
      mutation: MUTATION.secureStoring,
      variables: {
        id: "test_first_1",
        key: privateKey[0],
        value: objectTestJson[0]
      }
    })

    expect(response).toHaveProperty('data.secureStoring.response', 'OK')

    response = await mutate({
      mutation: MUTATION.secureStoring,
      variables: {
        id: "test_first_2",
        key: privateKey[0],
        value: objectTestJson[1]
      }
    })

    expect(response).toHaveProperty('data.secureStoring.response', 'OK')

    response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test_first_1",
        key: publicKey[0]
      }
    })

    checkObjectCorrect(0, "test_first_1", response)

    response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test_first_2",
        key: publicKey[0]
      }
    })
    checkObjectCorrect(1, "test_first_2", response)
    done()
  })

  it("Read data - wildcard", async () => {
    const {mutate, query} = createTestApolloServer()
    let response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test*first*",
        key: publicKey[0]
      }
    })

    expect(response).toHaveProperty('data.secureRead')
    expect(response.data.secureRead).toBeArrayOfSize(2)
    expect(response.data.secureRead[0].value).toEqual(objectTestJson[0])
    expect(response.data.secureRead[1].value).toEqual(objectTestJson[1])
  })

  it("Add data second key", async () => {
    const {mutate, query} = createTestApolloServer()

    let response = await mutate({
      mutation: MUTATION.secureStoring,
      variables: {
        id: "test_first_3",
        key: privateKey[1],
        value: objectTestJson[1]
      }
    })

    expect(response).toHaveProperty('data.secureStoring.response', 'OK')
    response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test_first_3",
        key: publicKey[1]
      }
    })
    checkObjectCorrect(1, "test_first_3", response)

  })


  it("Update element with same key", async ()=> {
    const {mutate, query} = createTestApolloServer()

    let response = await mutate({
      mutation: MUTATION.secureStoring,
      variables: {
        id: "test_first_4",
        key: privateKey[1],
        value: objectTestJson[1]
      }
    })

    expect(response).toHaveProperty('data.secureStoring.response', 'OK')
    response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test_first_4",
        key: publicKey[1]
      }
    })
    checkObjectCorrect(1, "test_first_4", response)

    /** change just object keep key */
    response = await mutate({
      mutation: MUTATION.secureStoring,
      variables: {
        id: "test_first_4",
        key: privateKey[1],
        value: objectTestJson[0]
      }
    })
    expect(response).toHaveProperty('data.secureStoring.response', 'OK')
    response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test_first_4",
        key: publicKey[1]
      }
    })
    checkObjectCorrect(0, "test_first_4", response)



    /** change just object  and  key */
    response = await mutate({
      mutation: MUTATION.secureStoring,
      variables: {
        id: "test_first_4",
        key: privateKey[2],
        value: objectTestJson[2]
      }
    })
    expect(response).toHaveProperty('data.secureStoring.response', 'OK')
    response = await query({
      query: QUERY.secureRead,
      variables: {
        id: "test_first_4",
        key: publicKey[2]
      }
    })
    checkObjectCorrect(2, "test_first_4", response)


  })

})
