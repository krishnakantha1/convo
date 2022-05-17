
//function to create unique string
const createToken = ()=>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const token = [];
    let m = 10;
    for(let i=0;i<m;i++){
        token.push(chars[Math.round(Math.random()*chars.length)]);
    }
    return token.join("");
}

module.exports = {createToken};