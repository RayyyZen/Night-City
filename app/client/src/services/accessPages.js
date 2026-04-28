import { session } from './userService.js'

export async function accessPages(page){

    const { user, isPending } = await session()

    let canAccessToPage = true

    if(page == "login" || page == "register"){
        if(user){
            canAccessToPage = false
        }
    }
    else if(page == "code"){
        if(user || !isPending){
            canAccessToPage = false
        }
    }
    else if(page == "myprofile"){
        if(!user){
            canAccessToPage = false
        }
    }
    else if(page == "create-building" || page == "join-building"){
        if(!user || user.building_id){
            canAccessToPage = false
        }
    }
    else if(page == "admin"){
        if(!user || user.role != "admin"){
            canAccessToPage = false
        }
    }
    else if(page == "mybuilding" || page == "create-device" || page == "device" || page == "publish-news"){
        if(!user || !user.building_id){
            canAccessToPage = false
        }
    }

    return {
        canAccessToPage: canAccessToPage,
        user: user
    }
}