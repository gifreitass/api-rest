import { Request, RequestHandler, Response } from "express"
import * as yup from 'yup'
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { ICidade } from "../../database/models";
import { CidadesProvider } from "../../database/providers/cidades";

interface IBodyProps extends Omit<ICidade, 'id'> { }

//retornando um middleware para validação
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nome: yup.string().required().min(3).max(150)
    }))
}))

//esse método só será executado se passar na validação acima
export const create: RequestHandler = async (req: Request<{}, {}, ICidade>, res: Response) => {
    const result = await CidadesProvider.create(req.body)

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.CREATED).json(result);
}

//assim que o usuário fizer um post para criar uma nova cidade, será chamada a função de validação, caso os dados passem na validação a 
//função de criação será executada, e dentro dela estão os providers para criação no banco de dados