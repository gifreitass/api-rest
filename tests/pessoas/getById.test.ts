import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - Get by Id', () => {
    let accessToken = ''
    beforeAll(async () => {
        const email = 'getbyid-pessoas@gmail.com'
        await testServer.post('/cadastrar').send({
            nome: 'Teste',
            email,
            senha: '123456'
        })
        const signInRes = await testServer.post('/entrar').send({
            email,
            senha: '123456'
        })
        accessToken = signInRes.body.accessToken
    })

    let cidadeId: number | undefined = undefined
    beforeAll(async () => {
        const resCidade = await testServer
            .post('/cidades')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Teste' })

        cidadeId = resCidade.body
    })

    it('Buscar a pessoa pelo id', async () => {
        const res = await testServer
            .post('/pessoas')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                nomeCompleto: 'Giovanna de Freitas',
                email: 'giovannagetbyid@hotmail.com',
                cidadeId
            })

        expect(res.statusCode).toEqual(StatusCodes.CREATED)

        const searchedRes = await testServer
            .get(`/pessoas/${res.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send()
            
        expect(searchedRes.statusCode).toEqual(StatusCodes.OK)
        expect(searchedRes.body).toHaveProperty('nomeCompleto')
    })
})