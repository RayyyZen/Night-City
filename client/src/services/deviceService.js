import { handle } from './handleService.js'

export async function createDevice(name, description, energy){

    const res = await fetch('/api/devices/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            name: name,
            description: description,
            energy: energy
        })
    })

    return await handle(res)
}

export async function getDevice(id){

    const res = await fetch(`/api/devices/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let device = null

    if(res.ok){
        try{
            device = await res.json()
        } catch(err) {
            console.log(err)
        }
    }

    return {
        device: device
    }
}

export async function updateDevice(id, data){

    const res = await fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...(data.name && {name: data.name}),
            ...(data.description && {description: data.description}),
            ...(data.energy && {energy: data.energy})
        })
    })

    return await handle(res)
}

async function deviceAction(action, id){

    const res = await fetch(`/api/devices/${action}/${id}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    return await handle(res)
}

export async function deviceUse(id){
    return await deviceAction("in_use", id)
}

export async function deviceIdle(id){
    return await deviceAction("idle", id)
}

export async function deviceError(id){
    return await deviceAction("error", id)
}