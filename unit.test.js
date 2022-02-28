const add =(a , b)=>{
    return a+b;
}

test('Adding two numbers', async () => {
    expect(add(5, 5)).toBe(10)
    expect(add(100, 200)).toBe(300)
})