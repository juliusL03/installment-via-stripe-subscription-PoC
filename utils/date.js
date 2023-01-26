const monthsFromNow = (n) => {
    var d = new Date();
    return Math.floor(d.setMonth(d.getMonth() + n) / 1000);
}

module.exports ={
    monthsFromNow
}