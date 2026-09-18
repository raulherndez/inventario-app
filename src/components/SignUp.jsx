import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, SignUp, SignIn } from '@clerk/clerk-react';

export default function App() {
   return(
   <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
     <header className="mb-6 flex justify-between w-full max-w-4xl px-4">
       <h1 className="text-2xl font-bold text-gray-800">Inventario App</h1>
       <div>
         <SignedOut>
           <SignInButton className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition" />
         </SignedOut>  
         <SignedIn>
           <UserButton />
         </SignedIn>
       </div>
     </header>
     
     <main className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
       <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Registro de Usuarios</h2>
       
       {/* Esto permite que cualquiera se registre de inmediato */}
       <SignedOut>
          <SignIn routing="hash" />
       </SignedOut>

       <SignedIn>
          <div className="text-center text-green-600 font-medium">
             ¡Ya has iniciado sesión correctamente y puedes acceder al inventario!
          </div>
       </SignedIn>
     </main>
   </div>
   ); 
}