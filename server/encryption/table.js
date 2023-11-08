const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))

        let t = array[i];
        array[i] = array[j];
        array[j] = t
    }
}

function tableCreate() {
    const amount = 256

    const map = new Map()
    let numberarray = [];

    for (let i = 0; i < amount; i++) {
        numberarray.push(i)
    }

    const newArray = Object.assign([], numberarray)

    shuffle(newArray)
    
    for (let i = 0; i < amount; i++) {
        map.set(numberarray[i], newArray[i])
    }

    return map
}

module.exports = tableCreate