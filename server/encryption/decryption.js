const spBlockBitSize = 16

const subkeyGeneration = (key) => {
    let firstValue = key.get(0)
    for (let i = 1; i < key.size; i++) {
        key.set(i - 1, key.get(i))
    }
    key.set(key.size - 1, firstValue)
}

const addZeroesToBegin = (binaryNumber, dignitAmount) => {
    while(binaryNumber.length != dignitAmount) {
        binaryNumber = '0' + binaryNumber 
    }
    return binaryNumber
}

//Подстановка
const sBlock = (binaryArray, roundKey, startIndex) => {
    //каждый пиксель заменяется по порядку другим значением
    for (let i = 0; i < binaryArray.length; i++) {
        //Двоичное значение из массива переводится в десятичное, ищется в таблице и переводится обратно в двоичное
        binaryArray[i] = roundKey.get(parseInt(binaryArray[i], 2)).toString(2)
    }

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

    binaryArray = [...binaryText]
    //сдвиг на количество раз, которое равно значению ключа, равному номеру индекса первого пикселя % 256
        for (let i = 0; i < (roundKey.get(startIndex % 256) + (startIndex / 256) % 256) % 16; i++) {
            binaryArray.unshift(binaryArray.pop());
        }
    
    return binaryArray
}

//на вход мы получаем 4 байт информации, находящихся  в arrayBlock
 //каждый элемент массива arrayBlock[] = 1 байт
const spBlock = (arrayBlock, roundKey, startIndex) => {
    
    //создаём массив входов в S-блоки (блоки подставновки)
    let entryes = []
    
    //каждый элемент entryes равен 8 битам
    for (let i = 0; i < arrayBlock.length; i++) {
        //заносим в entry каждые 8 битов и добавляем нули в начало
        entryes.push(arrayBlock[i].toString(2))
    } 

    //подставляем в s-блоках значения с помощью таблицы ключей
    entryes = sBlock(entryes, roundKey, startIndex)
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

        let newRoundText = []
        //2)Берем по 16 бит блок изображения (2 пикселя) и проводим SP-операции
        for (let i = 0; i < roundText.length; i = i + spBlockBitSize/8) {        
            let spText = spBlock(roundText.slice(i, i + spBlockBitSize/8), roundKey, i)
            newRoundText.push(...spText )
        }
        console.log('end round');

        return newRoundText
}


function decryption(image, key) {
    
    let roundText = image

    for (let i = 0; i < 3; i++) {
        roundText = roundStart(roundText, key, spBlockBitSize)
    }
    
    console.log('Конец дешифрования');
    return roundText
}

module.exports = decryption