import React from 'react';
import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 gap-9">
          <div className="flex justify-between items-center ">
            <div className="text-xl  text-gray-800 font-poppins"><Link href={"/"}>Ready Outfits</Link></div>
           
          <Link href={"/savedOutfits"}>Saved</Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8 center">
        <h1 className="text-4xl font-semibold text-center mb-8 font-poppins">Transform Your Festival Style</h1>
        <div className='flex justify-center p-5 pb-10'>

        <Image src={"/genz.webp"} height={200} width={300} className='rounded-md '></Image>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/outfits" className="inline-block">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 font-poppins">
             Show outfits
            </button>
          </Link>
       
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center">&copy; 2024 Ready Outfits. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;