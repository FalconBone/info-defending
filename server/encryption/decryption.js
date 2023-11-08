const spBlockBitSize = 32 //величина блока в битах

const subkeyGeneration = (key) => {
    let lastValue = key.get(key.size - 1)
    for (let i = 0; i < key.size - 1; i++) {
        key.set(i, key.get(i + 1))
    }
    key.set(0, lastValue)
}

const addZeroesToBegin = (binaryNumber, dignitAmount) => {
    while(binaryNumber.length != dignitAmount) {
        binaryNumber = '0' + binaryNumber 
    }
    return binaryNumber
}

//Подстановка
const sBlock = (binaryArray, roundKey) => {
    //каждый пиксель заменяется по порядку другим значением
    for (let i = 0; i < binaryArray.length; i++) {
        //Двоичное значение из массива переводится в десятичное, ищется в таблице и переводится обратно в двоичное
        binaryArray[i] = roundKey.get(parseInt(binaryArray[i], 2)).toString(2)
    }

    subkeyGeneration(roundKey)


    return binaryArray
}

//Перестановка
//делаем сдвиг массива
const pBlock = (binaryArray, roundKey, startIndex) => {
    
    //преобразуем все числа в одну битовую строку
    let binaryText = '' 

    for (let i = 0; i< binaryArray.length; i++) {
        binaryText += addZeroesToBegin(binaryArray[i].toString(2), 8)
    }
    //сдвиг
    binaryArray = [...binaryText]
    //сдвиг на количество раз, которое равно значению ключа, равному значению индекса первого пикселя % 256
    for (let i = 0; i < roundKey.get(startIndex % 256) % spBlockBitSize; i++) {
        binaryArray.unshift(binaryArray.pop());
    }
    
    return binaryArray
}

//на вход мы получаем массив пикселей
const spBlock = (arrayBlock, roundKey, startIndex) => {
    
    //создаём массив входов в S-блоки (блоки подставновки)
    let entryes = []
    
    //каждый элемент entryes равен 8 битам
    for (let i = 0; i < arrayBlock.length; i++) {
        //заносим в entry каждые 8 битов и добавляем нули в начало
        entryes.push(arrayBlock[i].toString(2))
    } 

    //подставляем в s-блоках значения с помощью таблицы ключей
    entryes = sBlock(entryes, roundKey)
    //меняем в p-блоках значения с помощью таблицы ключей
    const exites = pBlock(entryes, roundKey, startIndex)
    

    //далее надо соеденить entryes 
    const newBlockArray = []
    for (let i = 0; i < exites.length; i = i + 8) {
        let number = '';
        for (let j = 0; j < 8; j++) {
            number += exites[i + j]
        }
        newBlockArray.push(parseInt(number, 2))
    } 

    return newBlockArray
}

const roundStart = (roundText, roundKey, spBlockBitSize) => {

        //1)сдвигаем таблицу влево
        subkeyGeneration(roundKey)

        //Проводим SP-операции
        return spBlock(roundText, roundKey, i)
}


function encryption(image, key) {
    
    let roundText = image

    for (let i = 0; i < 5; i++) {
        roundText = roundStart(roundText, key, spBlockBitSize)
        console.log('end round');
    }
    
        // console.log(roundKey)
        //наоборот - имеем таблицу у которой был сдвиг
        //берем значения из таблицы и ставим их в порядке возрастания
        //подставляем числа к которым были привязаны индексы
        //разъединяем их на Lx и Rx
        //Каждую часть превращаем в старую с помощью ключа MAP
        //Объединяем получившиеся L и R
        //сдвигаем таблицу вправо
    console.log('Конец шифрования');
    return roundText
}

module.exports = encryption