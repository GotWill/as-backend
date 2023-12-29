import { PrismaClient, Prisma } from "@prisma/client";
import * as groups from './groups'

const prisma = new PrismaClient()


type getPerson = {id_event: number; id_group?: number}
export const getAll = async (filter: getPerson) => {
    try {
        return await prisma.eventPeople.findMany({where: filter})
    } catch (error) {
        return false
    }
}


type GetOnePerson = {id_event: number; id_group?: number; id?: number; cpf?: string;}
export const getOne = async (filters: GetOnePerson) => {
    try {

        if(!filters.id && !filters.cpf) return false
        return await prisma.eventPeople.findFirst({where: filters})
    } catch (error) {
        return false
    }
}


type PeopleCreatedata = Prisma.Args<typeof prisma.eventPeople, 'create'>['data']
export const add = async (data: PeopleCreatedata) => {
    try {
        if(!data.id_group) return false

        const group = await groups.getOne({
           id: data.id_group,
           id_event: data.id_event
        })

        if(!group) return false
        
        return await prisma.eventPeople.create({data})
    } catch (error) {
        
    }
}

type Peopleupdatedata = Prisma.Args<typeof prisma.eventPeople, 'update'>['data']
type UpdateFilters = {id?: number; id_event: number; id_group?: number;}
export const updatePerson = async (filters: UpdateFilters, data: Peopleupdatedata) => {
    try {
        return await prisma.eventPeople.updateMany({data, where: filters})
    } catch (error) {
        return false
    }
}

type deleteFilters = {id: number; id_event?: number; id_group?: number;}
export const remove = async (filters: deleteFilters) => {
    try {
        return await prisma.eventPeople.delete({where: filters})
    } catch (error) {
        return false  
    }
}