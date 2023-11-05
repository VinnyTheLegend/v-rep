local QBCore = exports['qb-core']:GetCoreObject()

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
function InitPlayer(src)
  local xPlayer = QBCore.Functions.GetPlayer(src)
  local player = {
    cid = xPlayer.cid,
    name = xPlayer.PlayerData.charinfo.firstname .. "  " .. xPlayer.PlayerData.charinfo.lastname,
    src = src
  }
  Player = player
  return player
end

local Party
function ClientUpdateParty(party)
  Party = party
  -- send party to NUI
end

RegisterNetEvent('v-rep:client:updateParty', function(party)
  ClientUpdateParty(party)
end)


function ClientCheckParty(player)
  local partyresult
  QBCore.Functions.TriggerCallback('v-rep:checkParty', function(result)
    partyresult = result
  end, player)
  return partyresult
end

function ClientLeaveParty(player, code)
  TriggerServerEvent('v-rep:server:leaveParty', player, code)
end

function ClientLeaveParty(player, code)
  TriggerServerEvent('v-rep:server:leaveParty', player, code)
end

function ClientJoinPartyRequest(code)
  local joinresult
  QBCore.Functions.TriggerCallback('v-rep:joinParty', function(result)
    joinresult = result
  end, Player, code)
  
  if joinresult == "full" or joinresult == "member" or joinresult == "none" then
    print("Failed to join party: " .. joinresult)
    return
  end
  print("Joined Party")
end

function PartyMain(src)
  InitPlayer(src)
  ClientUpdateParty(ClientCheckParty(Player))
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  local src = source
  PartyMain(src)
  print("Init NUI Rep Data")
  SendReactMessage('initRepData', FakeData())
end)

local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('v-party', function(source, args)
  if args[1] == "list" then
    for i, member in ipairs(Party.members) do
      if member.cid == Party.leader then
        TriggerEvent('chat:addMessage', {
          color = { 255, 0, 0},
          multiline = true,
          args = {"PARTY", "NAME: \"" .. member.name .. "\", LEADER: \"true\""}
        })
      else
        TriggerEvent('chat:addMessage', {
          color = { 255, 0, 0},
          multiline = true,
          args = {"PARTY", "NAME: \"" .. member.name .. "\", LEADER: \"false\""}
        })
      end
    end
  end

end, false)

RegisterCommand('v-rep', function(source, args)
  if args[1] == "show" then
    toggleNuiFrame(true)
    debugPrint('Show NUI frame')
  end

  if args[1] == "update" then
    SendReactMessage("updateRepItem", {
      id = args[2],
      lvl = math.random(1, 10),
      xp = math.random(1, 100) .. "%"
    })
  end
end, false)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getRepData', function(data, cb)
  debugPrint('Data sent by React', json.encode(data))

  local curCoords = GetEntityCoords(PlayerPedId())
  local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
  cb(FakeData())
end)