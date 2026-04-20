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

    return await getResult(res)
}

export async function createBuilding(name, address, area){

    const res = await fetch('http://localhost:3000/buildings/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            name: name,
            address: address,
            area: area
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