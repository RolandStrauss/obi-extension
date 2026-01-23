"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSteps = getSteps;
const path = __importStar(require("path"));
const minimatch_1 = require("minimatch");
const properties_1 = require("./properties");
function getSteps(source, appConfig, extended_sources_config) {
    let initSteps = [];
    if (appConfig.global?.steps?.['*ALL']) {
        initSteps = appConfig.global.steps['*ALL'];
    }
    const extendedSteps = getExtendedSteps(source, appConfig, extended_sources_config);
    if (extendedSteps) {
        return [...initSteps, ...extendedSteps];
    }
    return [...initSteps, ...getGlobalSteps(source, appConfig)];
}
function getGlobalSteps(source, appConfig) {
    if (appConfig.global?.steps) {
        for (const extensionStep in appConfig.global.steps) {
            if (source.endsWith(extensionStep)) {
                return appConfig.global.steps[extensionStep];
            }
        }
    }
    const fileExtensions = path.extname(source).slice(1);
    return appConfig.global?.steps?.[fileExtensions] || [];
}
function getExtendedSteps(source, appConfig, extended_sources_config) {
    if (!extended_sources_config?.extended_source_processing) {
        return null;
    }
    const sourceProperties = (0, properties_1.getSourceProperties)(appConfig, source);
    let resultSteps = [];
    let allowMultipleMatches = true;
    for (const sourceConfigEntry of extended_sources_config.extended_source_processing) {
        if (matchSourceConditions(sourceConfigEntry, source, sourceProperties)) {
            if (!allowMultipleMatches && resultSteps.length > 0) {
                throw new Error(`Multiple extended source processing entries found for ${source}`);
            }
            allowMultipleMatches = sourceConfigEntry.allow_multiple_matches ?? true;
            const steps = getStepsFromCurrentEsp(sourceConfigEntry, source, appConfig, sourceProperties);
            resultSteps.push(...steps);
        }
    }
    return resultSteps.length > 0 ? resultSteps : null;
}
function getStepsFromCurrentEsp(sourceConfigEntry, source, appConfig, sourceProperties) {
    const steps = sourceConfigEntry.steps || [];
    const newSteps = [];
    for (const step of steps) {
        if (typeof step === 'string') {
            newSteps.push(step);
            continue;
        }
        if (typeof step !== 'object' || step === null) {
            throw new Error(`Step is not a dictionary or a string`);
        }
        let stepsToAppend = [];
        if (step.step) {
            stepsToAppend.push({ step: step.step });
        }
        if (step.use_standard_step) {
            const globalSteps = getGlobalSteps(source, appConfig);
            stepsToAppend = stepsToAppend.concat(globalSteps.map(gs => ({ step: gs })));
        }
        for (const stepToAppend of stepsToAppend) {
            // Scripting part is omitted for brevity
            newSteps.push({ ...step, ...stepToAppend });
        }
    }
    return newSteps;
}
function matchSourceConditions(sourceConfigEntry, source, sourceProperties) {
    const conditions = sourceConfigEntry.conditions || {};
    if (Object.keys(conditions).length === 0) {
        return true;
    }
    for (const conditionName in conditions) {
        const conditionValue = conditions[conditionName];
        switch (conditionName) {
            case 'SOURCE_FILE_NAMES':
                if (!matchConditionSourceFileNames(source, conditionValue, sourceConfigEntry)) {
                    return false;
                }
                break;
            case 'TARGET_LIB':
                if (!matchConditionTargetLib(sourceProperties.TARGET_LIB, conditionValue, sourceConfigEntry)) {
                    return false;
                }
                break;
            default:
                return false;
        }
    }
    return true;
}
function matchConditionSourceFileNames(source, conditionValues, sourceConfigEntry) {
    for (const conditionValue of conditionValues) {
        if (sourceConfigEntry.use_regex) {
            if (new RegExp(conditionValue).test(source)) {
                return true;
            }
        }
        else if (fnmatch(source, conditionValue)) {
            return true;
        }
    }
    return false;
}
function matchConditionTargetLib(targetLib, conditionValue, sourceConfigEntry) {
    if (sourceConfigEntry.use_regex) {
        return new RegExp(conditionValue).test(targetLib);
    }
    return fnmatch(targetLib, conditionValue);
}
function fnmatch(source, conditionValue) {
    // Use minimatch for glob pattern matching
    return (0, minimatch_1.minimatch)(source, conditionValue, { matchBase: true });
}
