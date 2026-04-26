export async function createNews(title, content){

    const res = await fetch('http://localhost:3000/news/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            title: title,
            content: content
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

export async function getNews(id){

    const res = await fetch(`http://localhost:3000/news/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let news = null

    if(res.ok){
        try{
            news = await res.json()
        } catch(err) {
            console.log(err)
        }
    }

    return {
        news: news
    }
}

export async function getAllNews(){

    const res = await fetch('http://localhost:3000/news/', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    let news = []

    if(res.ok){
        try{
            news = await res.json()
        } catch(err) {
            console.log(err)
        }
    }

    return news
}