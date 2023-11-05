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

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  print("Init Rep Data")
  SendReactMessage('initRepData', FakeData())
end)

local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

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