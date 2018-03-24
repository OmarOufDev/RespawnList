import { IRespawnListLogic } from "./Services/_Services.index";
import { bottle } from "./BaseLayer/BottleManager";

const resplistlog = bottle.container.RespawnListLogic;
const opt = bottle.container.OptionsVerification;
console.log(new opt({enabled: "true"}).validate());

console.log(resplistlog.addEntry("1", "1"));
console.log(resplistlog.addOptionsToEntry("1",{enabled: true}));
