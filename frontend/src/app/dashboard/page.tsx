import { userVerifier } from "../serveraction/UserVerifier";
import Dashboard from "./dashboard.page.";



export default async  function Page() {
    const user=await userVerifier()
    console.log(user)
    return (
        <Dashboard />
    )
}