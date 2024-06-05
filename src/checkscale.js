const TEST_DOMAIN        = [new Date("2000-01-01"), new Date("2000-01-02")], 
      TEST_DOMAIN_TIME_0 = TEST_DOMAIN[0].getTime();

export default function(scale) {
    let checkScale   = scale(TEST_DOMAIN), 
        checkDomain  = checkScale.domain(), 
        isSequential = !!checkScale.interpolator;  // various version can be sequential
    // scaleOrdinal and odd-balls
    if(!checkDomain.length) {
        if(checkScale.quantiles) return {isQuantile: true, isSequential: isSequential};
        if(checkScale.step) {
            return {
                isBand: true, 
                isPoint: !checkScale.paddingInner
            };
        }
        return {isOrdinal: true};
    }
    if(checkDomain.length === 1) return {isThreshold: true};
    // time scales
    if(checkDomain[0] instanceof Date) {
        return {
            isTime: true, 
            isUtc: checkDomain[0].getTime() === TEST_DOMAIN_TIME_0
        };
    }
    let isDiverging  = checkDomain.length === 3;  // various version can be diverging
    // log and pow scales
    if(checkScale.base) {
        return {
            isPow: true, 
            isSequential: isSequential, 
            isDiverging: isDiverging
        };
    }
    if(checkScale.exponent) {
        return {
            isPow: true,
            isSqrt: checkScale.exponent() == 0.5, 
            isSequential: isSequential, 
            isDiverging: isDiverging
        };
    }
    if(checkScale.constant) {
        return {
            isSymlog: true, 
            isSequential: isSequential, 
            isDiverging: isDiverging
        };
    }
    // scaleQuantize
    if(checkScale.thresholds) return {isQuantize: true};
    // scaleLinear
    return {
        isLinear: true, 
        isSequential: isSequential, 
        isDiverging: isDiverging
    };
};