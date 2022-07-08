module.exports = (client) =>{
    let date = new Date().toLocaleString();
    console.log(`'Bot ist online. ${client.user.tag} -- ${date}`)
}