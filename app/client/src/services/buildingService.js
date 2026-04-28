import { handle } from './handleService.js'

async function getResult(res){
    let result = null

    if(!res.ok){
        return result
    }

    try{
        result = await res.json()
    } catch(err) {
        console.log(err)
    }

    return result
}

export async function getAllBuildings(){

    const res = await fetch('http://localhost:3000/buildings/', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await getResult(res)
}

export async function getBuilding(id){

    const res = await fetch(`http://localhost:3000/buildings/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await getResult(res)
}

export async function getMyBuilding(){

    const res = await fetch(`http://localhost:3000/buildings/mybuilding`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    const result = await getResult(res)

    if(!result){
        return { building: null, users: [], devices: [] }
    }

    return { building: result.building, users: result.users, devices: result.devices }
}

export async function createBuilding(name, description, address, area, password){

    const res = await fetch('http://localhost:3000/buildings/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            name: name,
            description: description,
            address: address,
            area: area,
            password: password
        })
    })

    return await handle(res)
}

export async function updateBuilding(data){

    const res = await fetch(`http://localhost:3000/buildings`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...(data.description && {description: data.description}),
            ...(data.password && {password: data.password})
        })
    })

    return await handle(res)
}