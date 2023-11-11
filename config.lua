function ExponentialExp(exp)
    local baseXP = 100
    local currentLevel = 1

    while exp >= baseXP do
        exp = exp - baseXP
        baseXP = baseXP * 2
        currentLevel = currentLevel + 1
    end

    return currentLevel
end

function LevelMaxExp(level)
    local baseXP = 100
    local maxXP = baseXP * (2^level - 1)
    return maxXP
end

Config = {
    party_max = 4
}

Config.Skills = {
	['hacking'] = {
		DisplayName = 'Hacking',
		MaxLevel = 20,
		LevelFormula = function(exp) return ExponentialExp(exp) end,
        LevelUpFormula = function(level) return LevelMaxExp(level) end
	},
	['shooting'] = {
		DisplayName = 'Shooting',
		MaxLevel = 100,
		LevelFormula = function(exp) return ExponentialExp(exp) end,
        LevelUpFormula = function(level) return LevelMaxExp(level) end
	}
}