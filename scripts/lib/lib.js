import CONSTANTS from "../constants.js";

export function custom_warning(message, console = true){
  ui.notifications.warn("Rest Recovery | " + game.i18n.localize(message), { console })
}


export function ordinalSuffixOf(i) {
  let j = i % 10;
  let k = i % 100;
  if (j === 1 && k !== 11) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'st'}`);
  } else if (j === 2 && k !== 12) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'nd'}`);
  } else if (j === 3 && k !== 13) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'rd'}`);
  }
  return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'th'}`);
}

/**
 * @param {string} settingKey
 * @returns {number}
 */
export function determineMultiplier(settingKey) {
  const multiplierSetting = getSetting(settingKey);
  switch (multiplierSetting) {
    case CONSTANTS.FRACTIONS.NONE:
      return 0;
    case CONSTANTS.FRACTIONS.QUARTER:
      return 0.25;
    case CONSTANTS.FRACTIONS.HALF:
      return 0.5;
    case CONSTANTS.FRACTIONS.FULL:
      return 1.0;
    case CONSTANTS.FRACTIONS.CUSTOM:
      return getSetting(CONSTANTS.DEFAULT_SETTINGS[settingKey].customFormula);
    default:
      throw new Error(`Unable to parse recovery multiplier setting for "${settingKey}".`);
  }
}

export function determineRoundingMethod(settingKey) {
  const rounding = getSetting(settingKey);
  switch (rounding) {
    case "down":
      return Math.floor;
    case "up":
      return Math.ceil;
    case "round":
      return Math.round;
    default:
      throw new Error(`Unable to parse rounding setting for "${settingKey}".`);
  }
}

export function getSetting(key, localize = false) {
  if(!localize) {
    const setting = CONSTANTS.DEFAULT_SETTINGS[key];
    if (setting?.moduleIntegration && !game.modules.get(setting.moduleIntegration.key)?.active) {
      return setting.default;
    }
  }

  const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
  if (localize) return game.i18n.localize(value);
  return value;
}

export function setSetting(key, value) {
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}

/**
 * @param {String/Number} formula
 * @param {Object} data
 * @param {boolean} warn
 * @returns {Roll}
 */
export function evaluateFormula(formula, data, warn = true) {
  const rollFormula = Roll.replaceFormulaData(formula, data, { warn });
  return new Roll(rollFormula).evaluate({ async: false });
}

export function getConsumableItemsFromActor(actor) {

  return actor.items.map(item => {
    const consumableUses = getConsumableItemDayUses(item);
    if (!consumableUses > 0) return false;
    const consumableData = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
    return {
      id: item.id,
      name: item.name + " (" + game.i18n.localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(consumableData.type)) + ")",
    };
  }).filter(Boolean);

}

export function getConsumableItemDayUses(item) {
  const consumableData = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
  if (!consumableData?.enabled) return 0;
  return (foundry.utils.getProperty(item, "system.uses.value") ?? 1);
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber)
    && typeof inNumber === "number"
    && isFinite(inNumber);
}

/**
 *
 * @param actor
 * @param grittyLongRest
 * @returns {{
 *    actorRequiredWater: Number,
 *    actorWaterSatedValue: Number,
 *    actorRequiredFood: Number,
 *    actorFoodSatedValue: Number
 * }}
 */
export function getActorConsumableValues(actor, grittyLongRest) {

  const actorFoodSatedValue = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.SATED_FOOD) ?? 0;
  const actorWaterSatedValue = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.SATED_WATER) ?? 0;

  const actorNeedsNoFoodWater = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DND.NEEDS_NO_FOOD_AND_WATER);
  const actorNeedsNoFood = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.NEEDS_NO_FOOD);
  const actorNeedsNoWater = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.NEEDS_NO_WATER);

  const foodUnitsSetting = getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY);
  const actorRequiredFoodUnits = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.REQUIRED_FOOD)
    ?? foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DND.REQUIRED_FOOD);
  let actorRequiredFood = isRealNumber(actorRequiredFoodUnits) && foodUnitsSetting !== 0
    ? actorRequiredFoodUnits
    : foodUnitsSetting;

  const waterUnitsSetting = getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY);
  const actorRequiredWaterUnits = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.REQUIRED_WATER)
    ?? foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DND.REQUIRED_WATER);
  let actorRequiredWater = isRealNumber(actorRequiredWaterUnits) && waterUnitsSetting !== 0
    ? actorRequiredWaterUnits
    : waterUnitsSetting;

  actorRequiredFood *= grittyLongRest ? 7 : 1;
  actorRequiredWater *= grittyLongRest ? 7 : 1;

  actorRequiredFood = actorNeedsNoFoodWater || actorNeedsNoFood ? 0 : actorRequiredFood;
  actorRequiredWater = actorNeedsNoFoodWater || actorNeedsNoWater ? 0 : actorRequiredWater;

  return {
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue
  }

}

export function capitalizeFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function roundHalf(num) {
  return Math.round(num * 2) / 2;
}

export function getTimeChanges(isLongRest) {

  const simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const timeConfig = simpleCalendarActive
    ? SimpleCalendar.api.getTimeConfiguration()
    : { hoursInDay: 24, minutesInHour: 60, secondsInMinute: 60 };

  timeConfig.secondsInDay = timeConfig.hoursInDay * timeConfig.minutesInHour * timeConfig.secondsInMinute;

  const hourInSeconds = timeConfig.minutesInHour * timeConfig.secondsInMinute;

  const { hour, minute, seconds } = simpleCalendarActive ? SimpleCalendar.api.currentDateTime() : {
    hour: 0,
    minute: 0,
    seconds: 0
  };
  const currentTime = (hour * hourInSeconds) + (minute * timeConfig.secondsInMinute) + seconds;

  let restTime;
  const restVariant = game.settings.get("dnd5e", "restVariant");
  switch (restVariant) {
    case "epic":
      restTime = isLongRest ? hourInSeconds : timeConfig.secondsInMinute;
      break;
    case "gritty":
      restTime = isLongRest ? timeConfig.hoursInDay * hourInSeconds * 7 : hourInSeconds * 8;
      break;
    default:
      restTime = isLongRest ? hourInSeconds * 8 : hourInSeconds;
      break;
  }

  return {
    restTime,
    isNewDay: simpleCalendarActive
      ? (currentTime + restTime) >= timeConfig.secondsInDay
      : restVariant === "gritty" || (restVariant !== "epic" && isLongRest)
  };

}


export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function addToUpdates(updates, toAdd){
  const existingUpdateIndex = updates.findIndex(update => update._id === toAdd._id);
  if(existingUpdateIndex > -1){
    updates[existingUpdateIndex] = foundry.utils.mergeObject(
      updates[existingUpdateIndex],
      toAdd
    )
  }else{
    updates.push(toAdd);
  }
}

/**
 * Utility method to check the caster type of the actor is FULL
 * @param {Actor} actor The actor to check
 * @returns {boolean} The caster type of the actor is FULL
 */
export function isFullCaster(className) {
  // TODO add tidy5e integration and a module setting for custom stuff ?
  if (CONSTANTS.FULL_CASTERS.some((c) => className.includes(c))) {
    return true;
  } else {
    return false;
  }
}

/**
 * Utility method to check the caster type of the actor is HALF
 * @param {Actor} actor The actor to check
 * @returns {boolean} The caster type of the actor is HALF
 */
export function isHalfCaster(className) {
  // TODO add tidy5e integration and a module setting for custom stuff ?
  if (CONSTANTS.HALF_CASTERS.some((c) => className.includes(c))) {
    return true;
  } else {
    return false;
  }
}

/**
 * Utility method to check the caster type of the actor is QUARTER
 * @param {Actor} actor The actor to check
 * @returns {boolean} The caster type of the actor is QUARTER
 */
export function isQuarterCaster(className) {
  // TODO add tidy5e integration and a module setting for custom stuff ?
  if (CONSTANTS.QUARTER_CASTERS.some((c) => className.includes(c))) {
    return true;
  } else {
    return false;
  }
}

/**
 * Utility method to check the caster type of the actor is NONE
 * @param {Actor} actor The actor to check
 * @returns {boolean} The caster type of the actor is NONE
 */
function isNoneCaster(actor) {
  // TODO add tidy5e integration and a module setting for custom stuff ?
  const classes = Object.keys(actor.classes);
  if (CONSTANTS.NONE_CASTERS.some((c) => classes.includes(c))) {
    return true;
  } else {
    return false;
  }
}

/**
 * Utility method to check the casting ability of the actor
 * @param {string} className The class name identifier
 * @returns {string} The casting ability of the actor
 */
function getCastingAbility(className) {
  return actor.classes[className]?.system.spellcasting.ability;
}

/**
 * Utility method to check if the class level of the actor
 * @param {string} className The class name identifier
 * @returns {number} The class level of the actor
 */
function getClassLvl(className) {
  return actor.classes[className].system.levels;
}

/**
 * Utility method to check if the mod of the caster 
 * @param {string} className The class name identifier
 * @returns {number} The spells slot multiplier
 */
function getCasterMod(className) {
  // TODO add tidy5e integration and a module setting for custom stuff ?
  if (isFullCaster(className)) {
    return 1;
  } else if (isHalfCaster(className)) {
    return 0.5;
  } else if (isQuarterCaster(className)) {
    return 0.25;
  } else {
    return 0;
  }
}

/**
 * Utility method to retrieve the prepared spells
 * @param {Actor} actor The actor to check
 * @returns {Item[]} All the prepared spells on the actor
 */
function getPreparedSpells(actor) {
  return actor.items.filter(
    (i) =>
      i.type === 'spell' &&
      i.system.preparation?.prepared &&
      i.system.preparation?.mode === 'prepared'
  );
}

/**
 * Utility method to retrieve the max number of prepared spells from a actor
 * @param {Actor} actor The actor to check
 * @returns {number} The max number of prepared spells from a actor
 */
function getMaxPrepared(actor) {
  // TODO add tidy5e integration and a module setting for custom stuff ?
  console.log(actor);
  const classes = Object.keys(actor.classes).filter((c) =>
    prepCasters.includes(c)
  );
  console.log(classes);
  let maxPrepNum = 0;

  for (const instance of classes) {
    const castingAbility = getCastingAbility(instance);
    const modifier = actor.system.abilities[castingAbility]?.mod || 0;
    const classLvl = getClassLvl(instance);
    const casterMod = getCasterMod(instance);

    maxPrepNum += modifier + Math.floor(casterMod * classLvl);
    console.log('maxPrepNum = ' + maxPrepNum);
  }
  return maxPrepNum;
}

/**
 * Automatically fires after a long rest is completed and only for player characters who prepare spells. 
 * This will fire for any owner who initiates the long rest, including the GM.
 * Credit for the code go to @DroopyMcCool on discord for this https://discord.com/channels/915186263609454632/1216220642744205423
 * @param {Actor} actor The actor to check
 * @param {object} results 
 * @returns {void} It will open a dialog for checkout the spells
 */
export async function promptLongRestSpellReminder(actor, results) {
  if(!getSetting(CONSTANTS.SETTINGS.ENABLE_PROMPT_LONG_REST_SPELL_REMINDER)) {
    return;
  }

  if (results.longRest && isNoneCaster(actor) && actor.hasPlayerOwner) {
    const numPrepared = getPreparedSpells(actor).length;
    const numMaxPrepared = getMaxPrepared(actor);

    // TODO in some way integrate this code ???
    /*
    let numPrepared = 0;
    let numMaxPrepared = 0;

    const spellMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER);
    const pactMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER);
    const preparedSpells = this.actor.system.spells.filter(
      (i) =>
        i.type === 'spell' &&
        i.system.preparation?.prepared &&
        i.system.preparation?.mode === 'prepared'
    );

    for (let [level, slot] of Object.entries(preparedSpells)) {
      if (!slot.override && !slot.max) continue;
      let multiplier = level === "pact" ? pactMultiplier : spellMultiplier;
      if (level !== "pact" && customSpellRecovery) {
        results.updateData[`system.spells.${level}.value`] = 0;
        continue;
      }
      let spellMax = slot.override || slot.max;
      let recoverSpells = typeof multiplier === "string"
        ? Math.max(lib.evaluateFormula(multiplier, { slot: foundry.utils.deepClone(slot) })?.total, 1)
        : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);
      
    }
    */
    const data = getPreparedSpells(actor);

    // The Dialog instance reminding the player to prepare spells
    const content = `
    <form class="${CONSTANTS.MODULE_NAME}">
      <div class=".prep-spells-dialog">${game.i18n.localize(`REST-RECOVERY.Dialogs.PromptLongRestSpellReminder.Title`)}</div>
      <br>
      <div class=".prep-spells-dialog-hint">${game.i18n.localize(`REST-RECOVERY.Dialogs.PromptLongRestSpellReminder.PrefixPreparedSpells`)} ${numPrepared}/${numMaxPrepared}</div>
    </form>
    `;
    /*
    const style = `
    <style>
      .prep-spells-dialog {
        margin-top: 5px;
      }

      .prep-spells-dialog-hint {
        text-align: center; 
        font-weight: bold; 
        opacity: 0.5;
      }
    
      table.prep-spells-table {
        margin-left: auto;
        margin-right: auto;

        th {
          font-size: 20px;
        }

        .td-level-label {
          padding-left: 5px;
          font-size: 17px;
          font-weight: 500;
          opacity: 0.4;
          position: sticky;
          left: 85%;
          font-variant: all-small-caps;
        }
      
        img.prep-spells-img {
          height: 32px;
          display: block;
          float: left;
          margin-right: 6px;
        }
      
        .td-spell-row.container {
          display: flex;
          align-items: center;
          height: auto;
          padding-left: 5px;
        }
      }
    </style>
    `;
    */

    // Generate table

    // This function sorts the spells by level before inserting them into the table
    let sortedData = data.sort((a, b) => a.system.level - b.system.level);;
    //console.log(sortedData);
    let table = `<table class="prep-spells-table">`;

    table += `
      <tr>
        <th>${game.i18n.localize(`REST-RECOVERY.Dialogs.PromptLongRestSpellReminder.SubTitle`)}</th>
      </tr>
    `;
    sortedData.forEach((item) => {
      table += `
        <tr>
          <td class="td-spell" valign:"middle">
            <div class="td-spell-row container">
              <img src="${item.img}" class="prep-spells-img">${item.name} 
              <div class="td-level-label">${game.i18n.localize(`REST-RECOVERY.Dialogs.PromptLongRestSpellReminder.LevelPrefix`)} ${item.system.level}</div>
            </div>
          </td>
        </tr>
      `;
    });

    table += "</table>";

    
    new Dialog({
      title: actor.name,
      content: content + table,
      buttons: {
        ok: {
          label: game.i18n.localize(`REST-RECOVERY.Dialogs.PromptLongRestSpellReminder.Ok`),
          icon: '<i class="fas fa-address-book"></i>',
          callback: () => {
            actor.sheet.render(true);
          },
        },
        close: {
          label: game.i18n.localize(`REST-RECOVERY.Dialogs.PromptLongRestSpellReminder.Close`),
          icon: `<i class="fas fa-times"></i>`,
          callback: () => {},
        },
      },
    }).render(true, { width: 'auto', height: 'auto' });
  }
}