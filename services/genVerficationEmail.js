const generateVerificationCode = () => {
    // 生成一个 6 位随机数字或字母验证码
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(code)
    return code;
};

console.log('Generated Code:', generateVerificationCode());

module.exports = generateVerificationCode;