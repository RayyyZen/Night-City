export async function createDevice(name, description, energy){

    const res = await fetch('http://localhost:3000/devices/', {
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

    let message = null
    let success = true

    if(!res.ok){
        success = false
    }

    try{
        const data = await res.json()
        message = data.message
    } catch(err) {
        message = "Server error"
        success = false
        console.log(err)
    }

    return {
        message: message,
        success: success
    }
}

export async function getDevice(id){

    const res = await fetch(`http://localhost:3000/devices/${id}`, {
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

    const res = await fetch(`http://localhost:3000/devices/${id}`, {
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

    let message = null
    let success = true

    if(!res.ok){
        success = false
    }

    try{
        const data = await res.json()
        message = data.message
    } catch(err) {
        message = "Server error"
        success = false
        console.log(err)
    }

    return {
        success: success,
        message: message
    }
}

async function deviceAction(action, id){

    const res = await fetch(`http://localhost:3000/devices/${action}/${id}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let message = null
    let success = true

    if(!res.ok){
        success = false
    }

    try{
        const data = await res.json()
        message = data.message
    } catch(err) {
        message = "Server error"
        success = false
        console.log(err)
    }

    return {
        success: success,
        message: message
    }
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