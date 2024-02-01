import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import {  Prisma } from '@prisma/client'

export const GET: RequestHandler = async () => {
	
    let incontri=[
        {
            nome:'Pit Trap',
            image: 'game-icons:spiky-pit',
            hit:0,
            dmg:3,
            gld:0
        },
        {
            nome:'Sketelon',
            image: 'game-icons:piece-skull',
            hit:2,
            dmg:2,
            gld:1
        },
        {
            nome:'Goblin',
            image: 'game-icons:goblin-head',
            hit:3,
            dmg:2,
            gld:2
        },
        {
            nome:'Haunting',
            image: 'game-icons:haunting',
            hit:5,
            dmg:2,
            gld:4
        },
        {
            nome:'Ogre',
            image: 'game-icons:ogre',
            hit:4,
            dmg:4,
            gld:7
        },
        {
            nome:'Orc',
            image: 'game-icons:orc-head',
            hit:4,
            dmg:5,
            gld:8
        }
    
    ]
    

    for (let d  of incontri) {
        const {  nome, image, hit, dmg, gld  } = d;
	    let inc: Prisma.IncontroCreateInput= 
		{
		  nome: nome,
		  image: image,
		  hit: hit,
  		  dmg: dmg,
  		  gld:gld,
		 
		};
	


	const createUser = await prisma.incontro.create({ data :  inc })
	


    }
    
	const response = await prisma.incontro.findMany()

    return json(response); 
};






