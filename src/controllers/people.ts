import { RequestHandler } from "express";
import * as people from "../services/person";
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params;

  const items = await people.getAll({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
  });

  if (items) return res.json({ people: items });

  return res.json({ error: "Dados inválidos" });
};

export const getPerson: RequestHandler = async (req, res) => {
  const { id_event, id_group, id } = req.params;

  const items = await people.getOne({
    id_event: parseInt(id_event),
    id: parseInt(id),
    id_group: parseInt(id_group),
  });

  if (items) return res.json({ people: items });
  return res.json({ error: "Dados inválidos" });
};

export const addPerson: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params;

  const schema = z.object({
    name: z.string(),
    cpf: z.string().transform((val) => val.replace(/\.|-/gm, "")),
  });

  const body = schema.safeParse(req.body);

  if (!body.success) return res.json({ error: "Dados inválidos" });

  const item = await people.add({
    name: body.data.name,
    cpf: body.data.cpf,
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
  });

  if (item) return res.json({ people: item });

  return res.json({ error: "Dados inválidos" });
};

export const updatePerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params;

  const schema = z.object({
    name: z.string().optional(),
    cpf: z
      .string()
      .transform((val) => val.replace(/\.|-/gm, ""))
      .optional(),
    matched: z.string().optional(),
  });

  const body = schema.safeParse(req.body);

  if (!body.success) return res.json({ error: "Dados Invalidos" });

  const updatePerson = await people.updatePerson(
    {
      id: parseInt(id),
      id_event: parseInt(id_event),
      id_group: parseInt(id_group),
    },
    body.data
  );

  if (updatePerson) {
    const personItem = await people.getOne({
      id: parseInt(id),
      id_event: parseInt(id_event),
    });

    return res.json({ person: personItem });
  }

  return res.json({ error: "Dados inválidos" });
};

export const deletePerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params;

  const item = people.remove({
    id: parseInt(id),
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
  });

  if (item) return res.json({ person: item });

  res.json({ error: "Dados inválidos" });
};

export const searchPerson: RequestHandler = async (req, res) => {
  const { id_event } = req.params;

  const searchPersonSchema = z.object({
    cpf: z.string().transform((val) => val.replace(/\.|-/gm, "")),
  });

  const query = searchPersonSchema.safeParse(req.query);

  if (!query.success) return res.json({ error: "Dados inválidos" });

  const personItem = await people.getOne({
    id_event: parseInt(id_event),
    cpf: query.data.cpf,
  });


  if(personItem && personItem.matched){
     const matchId = decryptMatch(personItem.matched)

     const personMatched = await people.getOne({
        id_event: parseInt(id_event),
        id: matchId
     })

     if(personMatched){
        return res.json({
            person: {
                id: personItem.id,
                name: personItem.name
            },

            personMatched: {
                id: personMatched.id,
                name: personMatched.name
            }
        })
     }
  }

  res.json({ error: "Dados inválidos" });

};
