import { handle } from './handleService.js'

export async function submitCode(codee){

    const res = await fetch('http://localhost:3000/users/verify-code', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            code: codee
        })
    })

    return await handle(res)
}

export async function resendCode(){

    const res = await fetch('http://localhost:3000/users/resend-code',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
    })

    return await handle(res)
}

export async function session(){

    const res = await fetch('http://localhost:3000/users/session',{
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
    })

    let isPending = false
    let user = null

    try{
        const data = await res.json()
        user = data.user
        isPending = data.isPending
    } catch(err) {
        console.log(err)
    }

    return {
        user: user,
        isPending: isPending
    }
}

export async function joinBuilding(id, password){

    const res = await fetch(`http://localhost:3000/users/join-building/${id}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            password: password
        })
    })

    return await handle(res)
}

export async function logOut(){

    const res = await fetch('http://localhost:3000/users/log-out', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await handle(res)
}

export async function getMyProfile(){

    const res = await fetch('http://localhost:3000/users/profile', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let user = null

    if(res.ok){
        try{
            user = await res.json()
            
        } catch(err) {
            console.log(err)
        }
    }

    return { user: user }
}

export async function getPublicProfile(id){

    const res = await fetch(`http://localhost:3000/users/profile/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let user = null

    if(res.ok){
        try{
            user = await res.json()
        } catch(err) {
            console.log(err)
        }
    }

    return user
}

export async function updateProfile(data){

    const res = await fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...(data.image && {image: data.image}),
            ...(data.firstName && {firstName: data.firstName}),
            ...(data.lastName && {lastName: data.lastName}),
            ...(data.password && {password: data.password})
        })
    })

    return await handle(res)
}

export async function kick(id){

    const res = await fetch(`http://localhost:3000/users/kick/${id}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await handle(res)
}

export async function leave(){

    const res = await fetch(`http://localhost:3000/users/leave`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await handle(res)
}

export async function updateRole(id, building_role){

    const res = await fetch(`http://localhost:3000/users/update-building-role/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            building_role: building_role
        })
    })

    return await handle(res)
}

export async function getAllUsers(){

    const res = await fetch('http://localhost:3000/users/', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let users = []

    if(res.ok){
        try{
            users = await res.json()
            
        } catch(err) {
            console.log(err)
        }
    }

    return users
}

export async function deleteUser(id){

    const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await handle(res)
}