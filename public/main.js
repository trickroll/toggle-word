const toggleText = document.querySelectorAll('#toggle')
const deleteLine = document.querySelector("#delete-button")

Array.from(toggleText).forEach(e => {
    e.addEventListener('click', toggleCase)
})

deleteLine.addEventListener('click', deleteData)

async function toggleCase() {
    const text = this.innerHTML
    const convText = (text === text.toUpperCase()) ? text.toLowerCase() : text.toUpperCase()
    const arr = convText.split(' ')

    const origArray = text.split(' ')

    try{
        const response = await fetch('/toggleIt' , {
            method: 'put',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                matchOne: origArray[0],
                matchSecond: origArray[1],
                one: arr[0],
                second: arr[1]
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }


}

async function deleteData() {
    const firstOne = Array.from(toggleText)[0].innerHTML.split(' ')[0]
    const firstSecond = Array.from(toggleText)[0].innerHTML.split(' ')[1]

    try {
        const response = await fetch('/del', {
            method: 'delete',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                'one': firstOne,
                'second': firstSecond
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err){console.log(err)}
}