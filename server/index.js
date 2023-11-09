const express = require('express')
const encryption = require('./encryption/encryption')
const tableCreate = require('./encryption/table')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs');
const cors = require('cors')
const AutoCor = require('online-autocorrelation')

const PORT = 5000

const app = express()

let encryptionPixelArray
let resEncryption
let resBrightArray


app.use(cors())
app.use(express.static(path.resolve(__dirname, 'static/images')));
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        encryptionPixelArray: encryptionPixelArray,
        autoCorEncr: resEncryption,
        autoCorBri: resBrightArray
    })
})

const start = async () => {
    await sharp("images/image.jpg").grayscale().jpeg().toFile("images/grayimage.jpg")
    
    let width, height
    const img = sharp('images/grayimage.jpg');
    img
    .metadata()
    .then(function(metadata) {
        width = metadata.width
        height = metadata.height
    })

    const arrayBuffer = await sharp('images/grayimage.jpg')
        .extractChannel(0)
        .raw()
        .toBuffer();
    
    const brightArray = [...arrayBuffer]

    fs.unlinkSync("data.txt")
    let masterKey = tableCreate()

    for (let i = 0; i < masterKey.size; i++) {
        if (i % 4 !== 0) {
            await fs.appendFile('data.txt', `${i}: ${masterKey.get(i)}\t`, (error) => {
                if (error) {
                    console.error(error);
                } 
            });
        } else {
            await fs.appendFile('data.txt', `${i}: ${masterKey.get(i)}\n`, (error) => {
                if (error) {
                    console.error(error);
                } 
            });
        }
        
    }

    encryptionPixelArray = Uint8Array.from(encryption(brightArray, masterKey));

    //autocorrelation([...encryptionPixelArray], width, height)

    const newImage = sharp(encryptionPixelArray, {
        raw: {
            width: width,
            height: height,
            channels: 1
        }
    });
    newImage.toFile('images/newGrayImage5.jpg')


    app.listen(PORT, () => {
        console.log('Сервер запущен');
    })
}

start()