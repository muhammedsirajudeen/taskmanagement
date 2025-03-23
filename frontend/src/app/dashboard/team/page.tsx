import { userVerifier } from "@/app/serveraction/UserVerifier";
import Team from "./team.page";

export default async function Page(){
    const user=await userVerifier()
    console.log(user)
    return(
        <Team/>
    )
}