export async function handle(res){

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