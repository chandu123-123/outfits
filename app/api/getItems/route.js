// /pages/api/credits.js
//import { dbconnection } from '@/app/lib/database';
import { dbconnection } from '@/lib/database';
import { items } from '@/lib/model';
import { NextResponse } from 'next/server';
export async function GET(req) {

  console.log("hello")

    await dbconnection();
   
    const fetchedItems = await items.find();
    console.log(fetchedItems)

    return NextResponse.json({ fetchedItems });
  
}
