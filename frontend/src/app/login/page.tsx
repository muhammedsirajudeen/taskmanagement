import GoogleProvider from "@/providers/google.provider";
import Login from "./login.page";
import { userVerifier } from "../serveraction/UserVerifier";
import { redirect } from "next/navigation";

export default async function Page(){
    //in here we provide it 
    const user=await userVerifier()
    console.log(user)
    if(user){
        redirect('/dashboard')
    }
    return(
        <GoogleProvider>
            <Login/>
        </GoogleProvider>
    )
}