class IncidentManager {

    constructor() {
        this.rennleiterRolleID = '947229969711521867';
        this.acceptEmoji = '✅';
        this.denyEmoji = '❌';
        this.incidentsLiga1 = new Array();
        this.incidentsLiga2 = new Array();
        this.incidentsLiga3 = new Array();
        this.vorfallChannelLiga1 = '947229976997007386';
        this.vorfallChannelLiga2 = '947229977248690213';
        this.vorfallChannelLiga3 = '947229977567428634';
        this.currentIDLiga1 = 0;
        this.currentIDLiga2 = 0;
        this.currentIDLiga3 = 0;
        this.strafenChannelLiga1 = '947229976997007387';
        this.strafenChannelLiga2 = '947229977248690214';
        this.strafenChannelLiga3 = '947229977567428635';
        this.revisionsManagerID = '289036587159912448';
        this.vorfallKategorieID = '990013809206886430';
        this.archivLiga1 = '990013613467123742';
        this.archivLiga2 = '990013729624178738';
        this.archivLiga3 = '990013776478736424';
        this.stewardRolleID = '947229969698930740';
        this.tikTokMenschID = '269499201702854667'
    }

    getRennleiterRolleID(){
        return this.rennleiterRolleID;
    }

    getAcceptEmoji(){
        return this.acceptEmoji;
    }

    getDenyEmoji(){
        return this.denyEmoji;
    }

    getStewardRolle(){
        return this.stewardRolleID;
    }

    getVorfallKategorieID(){
        return this.vorfallKategorieID
    }

    setIncidentsLiga1(pIncidentsLiga1){
        this.incidentsLiga1 = pIncidentsLiga1;
    }

    getIncidentsLiga1(){
        return this.incidentsLiga1;
    }

    getVorfallChannelLiga1(){
        return this.vorfallChannelLiga1;
    }
    
    setCurrentIDLiga1(pID){
        this.currentIDLiga1 = pID
    }

    getCurrentIDLiga1(){
        return this.currentIDLiga1;
    }

    getStrafenChannelLiga1(){
        return this.strafenChannelLiga1;
    }

    getArchivLiga1(){
        return this.archivLiga1;
    }

    setIncidentsLiga2(pIncidentsLiga2){
        this.incidentsLiga2 = pIncidentsLiga2;
    }

    getIncidentsLiga2(){
        return this.incidentsLiga2;
    }

    getVorfallChannelLiga2(){
        return this.vorfallChannelLiga2;
    }

    setCurrentIDLiga2(pID){
        this.currentIDLiga2 = pID
    }

    getCurrentIDLiga2(){
        return this.currentIDLiga2;
    }

    getStrafenChannelLiga2(){
        return this.strafenChannelLiga2;
    }

    getArchivLiga2(){
        return this.archivLiga2;
    }

    setIncidentsLiga3(pIncidentsLiga3){
        this.incidentsLiga3 = pIncidentsLiga3;
    }

    getIncidentsLiga3(){
        return this.incidentsLiga3;
    }

    getVorfallChannelLiga3(){
        return this.vorfallChannelLiga3;
    }

    setCurrentIDLiga3(pID){
        this.currentIDLiga3 = pID
    }

    getCurrentIDLiga3(){
        return this.currentIDLiga3;
    }

    getStrafenChannelLiga3(){
        return this.strafenChannelLiga3;
    }

    getRevisionsManagerID(){
        return this.revisionsManagerID;
    }

    getArchivLiga3(){
        return this.archivLiga3;
    }

    getTikTokMenschID(){
        return this.tikTokMenschID
    }
}

module.exports = IncidentManager