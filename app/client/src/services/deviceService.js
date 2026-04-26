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