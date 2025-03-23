'use server'
import axiosInstance from "@/lib/axios"
// import axiosInstance from "@/lib/axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function userVerifier() {
    try {
        const cookie = await cookies()
        const accessToken = cookie.get('access_token')
        if (!accessToken) {
            return null
        }
        const response = await axiosInstance.get('/user/verify', {
            headers: {
                "Cookie": `access_token=${accessToken.value}`
            }
        })
        console.log(response.data)
        return true
    } catch (error) {
        console.log(error)
        redirect('/login')
    }
}
export async function loginuserVerifier() {
    try {
        const cookie = await cookies()
        const accessToken = cookie.get('access_token')
        if (!accessToken) {
            return null
        }
        console.log(accessToken)
        const response = await axiosInstance.get('/user/verify', {
            headers: {
                "Cookie": `access_token=${accessToken.value}`
            }
        })
        console.log(response.data)
        return true
    } catch (error) {
        console.log(error)
    }
}