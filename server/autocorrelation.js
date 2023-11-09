const autoCorrilation = (array, width, height) => {

    const sum = array.reduce((a, b) => a + b, 0);
    const mean = Math.round((sum / array.length) || 0); // среднее
    console.log(mean)

    const step = width * height;
    
    let correlation = []

    for (let i = 0; i < step; i++) {//not a number например если делить на 0
        
        let sumCor = 0;
        for (let j = 0; j < step - i; j++) {

            let n1 = Math.abs(array[j] - mean)
            let n2 = Math.abs(array[(i+j)] - mean)

            let x
            if (n1 >= n2) {
                x = (array[(j+i)] - mean) / (array[j] - mean)
            } else {//
                x = (array[j] - mean) / (array[(j+i)] - mean)
            }
            sumCor += x
        }
        console.log(i);
        correlation.push(sumCor / step)
    }
    console.log(correlation); 
}

module.exports = autoCorrilation