class Incident {

    constructor() {
        this.id = 0;
        this.name = '';
        this.initiator = null;
        this.driversInvolved = [];
        this.channel = null;      
        this.description = '';
        this.baseName = '';
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

    setBaseName(pBaseName){
        this.baseName = pBaseName;
    }

    getBaseName(){
        return this.baseName;
    }
}

module.exports = Incident
 