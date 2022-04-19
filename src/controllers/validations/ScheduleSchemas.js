import Joi from "joi";
import dateAsUTC from "../../utils/DateFormat.js";

export const createSchema = Joi.object({
    scheduledTo: Joi.date().required().min(dateAsUTC(new Date())),
    name: Joi.string().required().min(3).max(150),
    bornDate: Joi.date().required().max(dateAsUTC(new Date())),
    email: Joi.string().email().optional().allow("").max(200),
});

export const updateSchema = Joi.object({
    status: Joi.string()
        .required()
        .valid(...Object.values(["Atendido", "Não Atendido"])),
    observation: Joi.string().optional().allow("").max(200),
});
