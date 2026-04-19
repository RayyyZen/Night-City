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
    else if(page == "profile"){
        if(!user){
            canAccessToPage = false
        }
    }
    else if(page == "mybuilding"){
        if(!user || !user.building_id){
            canAccessToPage = false
        }
    }
    else if(page == "create-building"){
        if(!user || user.building_id){
            canAccessToPage = false
        }
    }


    return {
        canAccessToPage: canAccessToPage,
        user: user
    }
}