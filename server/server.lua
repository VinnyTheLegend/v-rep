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
    print("init party for cid: " .. player.cid)
    local party = {
        code = NewPartyCode(),
        leader = player.citizenid,
        members = { player }
    }
    print("adding party to table: " .. party.code)
    print("leader: " .. party.leader)
    print("cid: " .. party.members[1].cid)
    table.insert(Parties, party)
    TriggerClientEvent('v-rep:client:updateParty', player.cid, party)
    print("party list: ")
    for i, party in ipairs(Parties) do 
        print("party: " .. party.code)
    end
    return party
end

function ServerCheckParty(player)
    if next(Parties) == nil then
        return InitParty(player)
    end 
    for i, party in ipairs(Parties) do 
        for i, member in ipairs(party.members) do
            if member.citizenid == player.citizenid then
                member.cid = player.cid
                for i, member in ipairs(party.members) do
                    TriggerClientEvent('v-rep:client:updateParty', member.cid, party)
                end
                return party
            end
        end
    end
    return InitParty(player)
end

QBCore.Functions.CreateCallback('v-rep:checkParty', function(source, cb, player)
    local src = source
    print("received player info: cid: " .. player.cid)
    local party = ServerCheckParty(player)
    print("sending server party callback: " .. party.code)
    for i, member in ipairs(party.members) do
        print(" member: " .. member.name)
    end
    cb(party)
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
                TriggerClientEvent('v-rep:client:updateParty', member.cid, party)
            end
            break
        end
    end
    InitParty(player)
end)

QBCore.Functions.CreateCallback('v-rep:joinParty', function(_, cb, player, code)
    local matched = false
    for i, party in ipairs(Parties) do
        print(party.code .. " entered: " .. tostring(code))
        if party.code == tostring(code) then
            matched = true
            print("code match")
            local count = 0
            for i, member in ipairs(party.members) do
                count = count + 1
            end
            if count >= 4 then
                cb("full")
                return
            end
            print("adding member")
            table.insert(party.members, player)
            for i, member in ipairs(party.members) do
                TriggerClientEvent('v-rep:client:updateParty', member.cid, party)
            end
            cb(party)
            return
        end
    end
    if matched == false then
        cb("noparty")
    end
end)

RegisterNetEvent('v-rep:server:newCode')
AddEventHandler('v-rep:server:newCode', function(code)
    for i, party in ipairs(Parties) do
        if party.code == code then
            local new_code = NewPartyCode()
            party.code = new_code
            for i, member in ipairs(party.members) do
                TriggerClientEvent('v-rep:client:updateParty', member.cid, party)
            end
            break
        end
    end
end)

RegisterNetEvent('v-rep:server:kickParty')
AddEventHandler('v-rep:server:kickParty', function(targetcid, code)
    print("server party (" .. code .. ") KICK: " .. targetcid)
    for i, party in ipairs(Parties) do
        if party.code == code then
            for i, member in ipairs(party.members) do
                if member.cid == targetcid then
                    table.remove(party.members, i)
                    InitParty(member)
                    break
                end
            end
            for i, member in ipairs(party.members) do
                TriggerClientEvent('v-rep:client:updateParty', member.cid, party)
            end
            break
        end
    end
end)