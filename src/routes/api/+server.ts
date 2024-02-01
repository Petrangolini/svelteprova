import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import {  Prisma } from '@prisma/client'

export const GET: RequestHandler = async () => {
	
	const response = await prisma.incontro.findMany()
	
	
	return json(response);
};



export const POST: RequestHandler = async ({ request }) => {
	const {  nome, img, x, dmg, gld  } = await request.json();
	let inc: Prisma.IncontroCreateInput= 
		{
		  nome: nome,
		  image: img,
		  hit: x,
  		  dmg: dmg,
  		  gld:gld,
		 
		};
	


	const createUser = await prisma.incontro.create({ data :  inc })
	

	const response = await prisma.incontro.findMany()
	
	
	return json(response);
};


/*
export const UPDATE: RequestHandler = async ({ request }) => {
	const {  id,nome, img, hit, dmg, gld  } = await request.json();
	


	const createUser = await prisma.incontro.update({
		where: {
		  id: id,
		},
		data: {
		  nome: nome,
		  image:img,
		  hit:hit,
		  dmg:dmg,
		  gld:gld
		},
	  });	

	const response = await prisma.incontro.findMany()
	
	
	return json(response);
};*/