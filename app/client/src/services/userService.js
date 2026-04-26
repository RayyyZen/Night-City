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

export async function resendCode(){

    const res = await fetch('http://localhost:3000/users/resend-code',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
    })

    let message = null

    try{
        const data = await res.json()
        message = data.message
    } catch (err) {
        message = "Server error"
        console.log(err)
    }

    return {
        message: message
    }
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

export async function logOut(){

    const res = await fetch('http://localhost:3000/users/log-out', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let success = false

    if(res.ok){
        success = true
    }

    return {
        success: success
    }
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