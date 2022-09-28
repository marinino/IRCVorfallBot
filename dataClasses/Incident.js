class Incident {

    constructor() {
        this.id = 0;
        this.name = '';
        this.initiator = null;
        this.driversInvolved = [];
        this.channel = null;      
        this.description = 'k.A.';
        this.zeitpunkt = 'k.A.';
        this.link = 'k.A.';
        this.baseName = '';
        this.msgVorlage = null;
        this.msgZeitpunkt = null;
        this.msgBeschreibung = null;
        this.msgLink = null;
        this.zeitpunktSubmitted = false;
        this.beschreibungSubmitted = false;
        this.linkSubmitted = false;
        this.embedInputMsg = null;
        this.idForModalNameTime = -1;
        this.idForModalNameDesc = -1;
        this.idForModalNameLink = -1;
    }

    setID(pID){
        this.id = pID;
    }

    getID(){
        return this.id;
    }

    setName(pName){
        this.name = pName;
    }

    getName(){
        return this.name;
    }

    setInitiator(pInitiator){
        this.initiator = pInitiator;
    }

    getInitiator(){
        return this.initiator
    }

    setDriversInvoled(pDriversInvolved){
        this.driversInvolved = pDriversInvolved;
    }

    getDriversInvolved(){
        return this.driversInvolved;
    }

    setChannel(pChannel){
        this.channel = pChannel;
    }

    getChannel(){
        return this.channel;
    }

    setDescription(pDesc){
        this.description = pDesc;
    }

    getDescription(){
        return this.description;
    }

    setZeitpunkt(pTime){
        this.zeitpunkt = pTime;
    }

    getZeitpunkt(){
        return this.zeitpunkt;
    }

    setLink(pLink){
        this.link = pLink;
    }

    getLink(){
        return this.link;
    }

    setBaseName(pBaseName){
        this.baseName = pBaseName;
    }

    getBaseName(){
        return this.baseName;
    }

    setMsgVorlage(pMsg){
        this.msgVorlage = pMsg
    }

    getMsgVorlage(){
        return this.msgVorlage;
    }

    setMsgZeitpunkt(pMsg){
        this.msgZeitpunkt = pMsg
    }

    getMsgZeitpunkt(){
        return this.msgZeitpunkt;
    }

    setMsgBeschreibung(pMsg){
        this.msgBeschreibung = pMsg
    }

    getMsgBeschreibung(){
        return this.msgBeschreibung;
    }

    setMsgLink(pMsg){
        this.msgLink = pMsg
    }

    getMsgLink(){
        return this.msgLink;
    }

    setZeitpunktSubmitted(pBool){
        this.zeitpunktSubmitted = pBool;
    }

    getZeitpunktSubmitted(){
        return this.zeitpunktSubmitted;
    }

    setBeschreibungSubmitted(pBool){
        this.beschreibungSubmitted = pBool;
    }

    getBeschreibungSubmitted(){
        return this.beschreibungSubmitted;
    }

    setLinkSubmitted(pBool){
        this.linkSubmitted = pBool;
    }

    getLinkSubmitted(){
        return this.linkSubmitted;
    }

    setEmbedInputMessage(pEmbed){
        this.embedInputMsg = pEmbed;
    }

    getEmbedInputMessage(){
        return this.embedInputMsg;
    }

    setIdForModalNameTime(pID){
        this.idForModalNameTime = pID;
    }

    getIdForModalNameTime(){
        return this.idForModalNameTime;
    }

    setIdForModalNameDesc(pID){
        this.idForModalNameDesc = pID;
    }

    getIdForModalNameDesc(){
        return this.idForModalNameDesc;
    }

    setIdForModalNameLink(pID){
        this.idForModalNameLink = pID;
    }

    getIdForModalNameLink(){
        return this.idForModalNameLink;
    }
}

module.exports = Incident
 