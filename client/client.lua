local QBCore = exports['qb-core']:GetCoreObject()

local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

function FakeData()
  local fakeData = {}
  for i, item in pairs({"Bank Robbery", "House Robbery", "Hacking", "Chop Shop", "Boosting", "Crafting"}) do
      local max_xp = math.random(1,1000)
      table.insert(fakeData, {
        id = item,
        lvl = math.random(1, 10),
        xp = {math.random(1, max_xp), max_xp}
      })
  end
  return fakeData
end

local Player
function InitPlayer()
  local PlayerData = QBCore.Functions.GetPlayerData()
  local player = {
    cid = PlayerData.source,
    name = PlayerData.charinfo.firstname .. " " .. PlayerData.charinfo.lastname,
    citizenid = PlayerData.citizenid
  }
  print("client init data cid: " .. player.cid)
  --SendReactMessage('partyInitPlayer', player.cid)
  Player = player
  return player
end

local Party
function ClientUpdateParty(party)
  print("updating party: " .. party.code)
  for i, member in ipairs(party.members) do
    print(" member: " .. member.name)
  end
  Party = party
  local update = {self = Player, party = Party}
  SendReactMessage('updateParty', update)
end

RegisterNetEvent('v-rep:client:updateParty', function(party)
  ClientUpdateParty(party)
end)


function ClientCheckParty(player)
  print("sending player data: cid:" .. player.cid)
  local p = promise.new()
  QBCore.Functions.TriggerCallback('v-rep:checkParty', function(result)
    p:resolve(result)
  end, player)

  local partyresult = Citizen.Await(p)
  print("party recieved from server: " .. partyresult.code)
  return partyresult
end

function ClientLeaveParty(player, code)
  TriggerServerEvent('v-rep:server:leaveParty', player, code)
end

RegisterNUICallback('nuiLeaveRequest', function(_, cb)
  ClientLeaveParty(Player, Party.code)
  cb({})
end)

function ClientNewCode(code)
  TriggerServerEvent('v-rep:server:newCode', code)
end

RegisterNUICallback('nuiNewCodeRequest', function(_, cb)
  ClientNewCode(Party.code)
  cb({})
end)

function ClientKickParty(targetcid, code)
  TriggerServerEvent('v-rep:server:kickParty', targetcid, code)
end

RegisterNUICallback('nuiKickRequest', function(data, cb)
  ClientKickParty(data, Party.code)
  cb({})
end)


function ClientJoinPartyRequest(code)
  if code == Party.code then
    print("Failed to join party: already a member")
    return
  end
  local p = promise.new()
  QBCore.Functions.TriggerCallback('v-rep:joinParty', function(result)
    p:resolve(result)
  end, Player, code)

  local joinresult = Citizen.Await(p)
  if joinresult == "full" or joinresult == "member" or joinresult == "noparty" then
    print("Failed to join party: " .. joinresult)
    return
  end
  print("Joined Party")
end

RegisterNUICallback('nuiJoinRequest', function(data, cb)
  ClientJoinPartyRequest(data)
  cb({})
end)


function PartyMain()
  InitPlayer()
  ClientCheckParty(Player)
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  Wait(5000)
  local src = source
  PartyMain()
  print("Init NUI Rep Data")
  SendReactMessage('initRepData', FakeData())
end)

if QBCore.Functions.GetPlayerData().charinfo then
  PartyMain()
end

RegisterCommand('v-party', function(source, args)
  local src = source
  if args[1] == "list" then
    TriggerEvent('chat:addMessage', {
      color = { 255, 0, 0},
      multiline = true,
      args = {"PARTY", "CODE: \"" .. Party.code .. "\""}
    })
    for i, member in ipairs(Party.members) do
      if member.citizenid == Party.leader then
        TriggerEvent('chat:addMessage', {
          color = { 255, 0, 0},
          multiline = true,
          args = {"PARTY", "MEMBER: \"" .. member.name .. "\", LEADER: \"true\""}
        })
      else
        TriggerEvent('chat:addMessage', {
          color = { 255, 0, 0},
          multiline = true,
          args = {"PARTY", "MEMBER: \"" .. member.name .. "\", LEADER: \"false\""}
        })
      end
    end
  end

  if args[1] == "reload" then
    PartyMain()
  end

  if args[1] == "join" then
    ClientJoinPartyRequest(args[2])
  end

  if args[1] == "leave" then
    ClientLeaveParty(Player, Party.code)
  end

  if args[1] == "kick" then
    ClientKickParty(tonumber(args[2]), Party.code)
  end

  if args[1] == "newcode" then
    local old_code = Party.code
    ClientNewCode(Party.code)
  end

end, false)

RegisterCommand('v-rep', function(source, args)
  if args[1] == "show" then
    toggleNuiFrame(true)
    debugPrint('Show NUI frame')
  end

  if args[1] == "update" then
    local max_xp = math.random(1,1000)
    SendReactMessage("updateRepItem", {
      id = args[2],
      lvl = math.random(1, 10),
      xp = {math.random(1, max_xp), max_xp}
    })
  end
end, false)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)