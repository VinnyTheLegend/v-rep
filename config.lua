function ExponentialExp(exp)
    local xpcount = 0
    local currentLevel = 0

    while xpcount <= exp do
        currentLevel = currentLevel + 1
        xpcount = currentLevel^2*100
    end
    if currentLevel == 0 then
        currentLevel = 1
    end

    return currentLevel
end

function LevelMaxExp(level)
    return level^2*100
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