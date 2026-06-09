const randomNumbers = (arr, num) => {
    let numbers = [], random, index = 0;

    if (arr < num)
        num = arr

    do {
        random = Math.floor(Math.random() * arr);

        if (!numbers.includes(random)) {
            numbers.push(random);
            index++;
        }

    } while (index < num);

    return numbers
}

export { randomNumbers }