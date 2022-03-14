const CONSTANTS = {
    MODULE_NAME: "rest-recovery",
    FLAG_NAME: "data",
    SETTINGS: {
        IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
        WIZARD_CLASS: "wizard-class-name",
        DRUID_CLASS: "druid-class-name",
        BARD_CLASS: "bard-class-name",
        ARCANE_RECOVERY: "arcane-recovery-feature-name",
        NATURAL_RECOVERY: "natural-recovery-feature-name",
        SONG_OF_REST: "song-of-rest-name",
        CHEF_FEAT: "chef-feat-name",
        CHEF_TOOLS: "chef-tools-name",
        DURABLE_FEAT: "durable-feat-name",
        PERIAPT_ITEM: "periapt-item-name",
        LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
        PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
        HP_MULTIPLIER: "recovery-hitpoints",
        HD_MULTIPLIER: "recovery-hitdice",
        HD_ROUNDING: "recovery-rounding",
        RESOURCES_MULTIPLIER: "recovery-resources",
        SPELLS_MULTIPLIER: "recovery-spells",
        USES_OTHERS_MULTIPLIER: "recovery-uses-others",
        USES_FEATS_MULTIPLIER: "recovery-uses-feats",
        USES_DAILY_MULTIPLIER: "recovery-day"
    },
    FULL: "full",
    HALF: "half",
    QUARTER: "quarter",
    NONE: "none",
    UP: "up",
    DOWN: "down",
    USING_DEFAULT_LONG_REST_SETTINGS(){
        const settings = this.GET_DEFAULT_SETTINGS();
        for(const [key, setting] of Object.entries(settings)){
            if(setting.group !== "longrest") continue;
            if(game.settings.get(this.MODULE_NAME, key) !== setting.default) return false;
        }
        return true;
    },
    GET_DEFAULT_SETTINGS() {
        return {
            [CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS]: {
                name: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Hint",
                scope: "world",
                group: "shortrest",
                config: false,
                default: false,
                type: Boolean
            },
            [CONSTANTS.SETTINGS.WIZARD_CLASS]: {
                name: "REST-RECOVERY.Settings.ShortRest.WizardClassName.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.WizardClassName.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.ClassNames.Wizard",
                type: String
            },
            [CONSTANTS.SETTINGS.DRUID_CLASS]: {
                name: "REST-RECOVERY.Settings.ShortRest.DruidClassName.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.DruidClassName.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.ClassNames.Druid",
                type: String
            },
            [CONSTANTS.SETTINGS.BARD_CLASS]: {
                name: "REST-RECOVERY.Settings.ShortRest.BardClassName.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.BardClassName.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.ClassNames.Bard",
                type: String
            },
            [CONSTANTS.SETTINGS.ARCANE_RECOVERY]: {
                name: "REST-RECOVERY.Settings.ShortRest.ArcaneRecovery.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.ArcaneRecovery.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.ArcaneRecovery",
                type: String
            },
            [CONSTANTS.SETTINGS.NATURAL_RECOVERY]: {
                name: "REST-RECOVERY.Settings.ShortRest.NaturalRecovery.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.NaturalRecovery.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.NaturalRecovery",
                type: String
            },
            [CONSTANTS.SETTINGS.SONG_OF_REST]: {
                name: "REST-RECOVERY.Settings.ShortRest.SongOfRest.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.SongOfRest.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.SongOfRest",
                type: String
            },
            [CONSTANTS.SETTINGS.CHEF_FEAT]: {
                name: "REST-RECOVERY.Settings.ShortRest.ChefFeat.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.ChefFeat.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.ChefFeat",
                type: String
            },
            [CONSTANTS.SETTINGS.CHEF_TOOLS]: {
                name: "REST-RECOVERY.Settings.ShortRest.ChefTools.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.ChefTools.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.ChefTools",
                type: String
            },
            [CONSTANTS.SETTINGS.DURABLE_FEAT]: {
                name: "REST-RECOVERY.Settings.ShortRest.DurableFeat.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.DurableFeat.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.DurableFeat",
                type: String
            },
            [CONSTANTS.SETTINGS.PERIAPT_ITEM]: {
                name: "REST-RECOVERY.Settings.ShortRest.PeriaptItem.Title",
                hint: "REST-RECOVERY.Settings.ShortRest.PeriaptItem.Hint",
                scope: "world",
                group: "itemnames",
                config: false,
                default: "REST-RECOVERY.FeatureNames.PeriaptItem",
                type: String
            },
            [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE]: {
                name: "REST-RECOVERY.Settings.LongRest.RollHitDice.Title",
                hint: "REST-RECOVERY.Settings.LongRest.RollHitDice.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                default: false,
                type: Boolean
            },
            [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE]: {
                name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Title",
                hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Hint",
                scope: "world",
                group: "longrest",
                validate: CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE,
                config: false,
                default: false,
                type: Boolean
            },
            [CONSTANTS.SETTINGS.HP_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.HD_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "half",
            },
            [CONSTANTS.SETTINGS.HD_ROUNDING]: {
                name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Title",
                hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    down: "REST-RECOVERY.Rounding.RoundDown",
                    up: "REST-RECOVERY.Rounding.RoundUp",
                },
                default: "down",
            },
            [CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                customSettingsDialog: true,
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
        };
    }
}
CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;

export default CONSTANTS;