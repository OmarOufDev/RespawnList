import Bottle from "bottlejs";
import { OptionsVerification } from "./OptionsVerification";
import { Utilities } from "./Utilities";

const bottle = new Bottle();

bottle.service("Utilities", Utilities);
bottle.service("OptionsVerification", OptionsVerification);

export { bottle };
