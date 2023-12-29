import { RequestHandler } from "express";
import * as events from "../services/events";
import * as people from "../services/person"
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
  const items = await events.getAll();

  if (items) return res.json({ events: items });

  res.json({ error: "Ocorreu um erro" });
};

export const getEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const eventItem = await events.getOne(parseInt(id));

  if (eventItem) return res.json({ event: eventItem });

  res.json({ error: "Ocorreu um erro" });
};

export const addEvent: RequestHandler = async (req, res) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    grouped: z.boolean(),
  });

  const body = schema.safeParse(req.body);

  if (!body.success) return res.json({ error: "Dados inválidos" });

  const newEvent = await events.addEvent(body.data);

  if (newEvent) return res.status(201).json({ event: newEvent });

  res.json({ error: "Ocorreu um erro" });
};

export const updateEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const schemaUpdate = z.object({
    status: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    grouped: z.boolean().optional(),
  });

  const body = schemaUpdate.safeParse(req.body);

  if (!body.success) return res.json({ error: "Dados inválidos" });

  const updateEvent = await events.update(parseInt(id), body.data);

  if (updateEvent) {
    if (updateEvent.status) {
      const result = await events.doMatches(parseInt(id))
      console.log(result)

      if(!result){
        return res.json({error: 'Grupos impossiveis de sortear'})
      }
    } else {
      await people.updatePerson({
        id_event: parseInt(id),
      }, {matched: ''})
    }

    return res.json({ event: updateEvent });
  }

  res.json({ error: "Ocorreu um erro" });
};


export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

   const deleteEvent = await events.deleteEvent(parseInt(id))

   if(deleteEvent) return res.json({message: 'Item deletado'})

   res.json({ error: "Ocorreu um erro" });
}