import { PrismaClient, Prisma } from "@prisma/client";
import * as event from "./events";

const prisma = new PrismaClient();

export const getAll = async (id_event: number) => {
  try {
    return await prisma.eventGroup.findMany({ where: { id_event } });
  } catch (error) {
    return false;
  }
};

type GetOneFilters = { id: number; id_event?: number };

export const getOne = async (filters: GetOneFilters) => {
  try {
    return await prisma.eventGroup.findFirst({ where: filters });
  } catch (error) {
    return false;
  }
};

type GroupCreateData = Prisma.Args<typeof prisma.eventGroup, "create">["data"];

export const add = async (data: GroupCreateData) => {
  try {
    if (!data.id_event) return false;

    const eventItem = event.getOne(data.id_event);

    if (!eventItem) {
      return false;
    }

    return await prisma.eventGroup.create({ data });
  } catch (error) {
    return false;
  }
};


type UpdateFilters = {id: number; id_event?: number;}
type GroupUpdateData = Prisma.Args<typeof prisma.eventGroup, "update">["data"];

export const updateGroup = async (filters: UpdateFilters, data: GroupUpdateData) => {
    try {
        return await prisma.eventGroup.update({where: filters, data })
    } catch (error) {
        return false; 
    }
}

type deleteFilters = {id: number; id_event?: number;}


export const removeGroup = async (filters: deleteFilters) => {
 try {
    return await prisma.eventGroup.delete({where: filters})
 } catch (error) {
    return false; 
 }
}