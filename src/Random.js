export function randint(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum)) + minimum;
}
export function randchoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
