local QBCore = exports['qb-core']:GetCoreObject()

local Parties = {}

function GetRandomString(length)
    local randomString = ""
    for i = 1, length do
        local randomAscii = math.random(65, 90)  -- ASCII values for uppercase letters (A-Z)
        if math.random(2) == 2 then
            randomAscii = math.random(97, 122)  -- ASCII values for lowercase letters (a-z)
        end
        randomString = randomString .. string.char(randomAscii)
    end
    return randomString
end

function IsInArray(array, value)
    for _, item in ipairs(array) do
        if item == value then
            return true
        end
    end
    return false
end

function NewPartyCode()
    local code_length = 6
    if next(Parties) == nil then
        return GetRandomString(code_length)
    end
    local used_codes = {}
    for i, party in ipairs(Parties) do
        table.insert(used_codes, party.code)
    end 
    local new_code = GetRandomString(code_length)
    while IsInArray(used_codes, new_code) do
        new_code = GetRandomString(code_length)
    end
    return new_code
end

function InitParty(player)
    local party = {
        code = NewPartyCode(),
        leader = player.cid,
        members = {}
    }
    table.insert(Parties, party)
    return party
end

function ServerCheckParty(player)
    if next(Parties) == nil then
        return InitParty(player)
    end 
    for i, party in ipairs(Parties) do 
        for i, member in ipairs(party.members) do
            if member.cid == player.cid then
                member.src = player.src
                TriggerClientEvent('v-rep:client:updateParty', player.src, party)
                return party
            end
        end
    end
    return InitParty(player)
end

QBCore.Functions.CreateCallback('v-rep:checkParty', function(source, cb, player)
    local src = source
    cb(ServerCheckParty(player))
end)

RegisterNetEvent('v-rep:server:leaveParty')
AddEventHandler('v-rep:server:leaveParty', function(player, code)
    for i, party in ipairs(Parties) do
        if party.code == code then
            for i, member in ipairs(party.members) do
                if member.cid == player.cid then
                    table.remove(party.members, i)
                    if party.leader == player.cid then
                        party.leader = party.members[1].cid
                    end
                    break
                end
            end
            for i, member in ipairs(party.members) do
                TriggerClientEvent('v-rep:client:updateParty', member.src, party)
            end
            break
        end
    end
end)

QBCore.Functions.CreateCallback('v-rep:joinParty', function(source, cb, player, code)
    local src = source
    local response
    for i, party in ipairs(Parties) do
        if party.code == code then
            local count = 0
            for i, member in ipairs(party.members) do
                count = count + 1
                if member.cid == player.cid then
                   return cb("member")
                end
            end
            if count >= 4 then
                return cb("full")
            end
            table.insert(party.members, player)
            for i, member in ipairs(party.members) do
                TriggerClientEvent('v-rep:client:updateParty', member.src, party)
            end
            cb(party)
            break
        end
        cb("none")
    end
end)

RegisterNetEvent('v-rep:server:newCode')
AddEventHandler('v-rep:server:newCode', function(code)
    for i, party in ipairs(Parties) do
        if party.code == code then
            local new_code = NewPartyCode()
            party.code = new_code
            for i, member in ipairs(party.members) do
                TriggerClientEvent('v-rep:client:updateParty', member.src, party)
            end
            break
        end
    end
end)