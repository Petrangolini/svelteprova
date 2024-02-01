import prisma from '$lib/prisma';
import {  Prisma } from '@prisma/client'


export default async function riempi(){

    let incontri=[
        {
            nome:'Pit Trap',
            image: 'game-icons:spiky-pit',
            hit:0,
            dmg:3,
            gld:0,
            action:[]
        },
        {
            nome:'Sketelon',
            image: 'game-icons:piece-skull',
            hit:2,
            dmg:2,
            gld:1,
            action:[]
        },
        {
            nome:'Goblin',
            image: 'game-icons:goblin-head',
            hit:3,
            dmg:2,
            gld:2,
            action:[]
        },
        {
            nome:'Haunting',
            image: 'game-icons:haunting',
            hit:5,
            dmg:2,
            gld:4,
            action:[]
        },
        {
            nome:'Ogre',
            image: 'game-icons:ogre',
            hit:4,
            dmg:4,
            gld:7,
            action:[]
        },
        {
            nome:'Orc',
            image: 'game-icons:orc-head',
            hit:4,
            dmg:5,
            gld:8,
            action:[]
        },
    
    ]
    /*
    for (let i of incontri){
        const {  nome, image, hit, dmg, gld  } =  i;
        let inc:Prisma.IncontroCreateInput= 
            {
            nome: nome,
            image: image,
            hit: hit,
            dmg: dmg,
            gld:gld,
            
            };
        


        const s=await prisma.incontro.create({ data :  inc })
        
    } */

}


