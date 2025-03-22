import GoogleProvider from "@/providers/google.provider";
import Login from "./login.page";

export default function Page(){
    //in here we provide it 
    return(
        <GoogleProvider>
            <Login/>
        </GoogleProvider>
    )
}