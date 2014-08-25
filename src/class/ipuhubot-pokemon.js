// Description:
//   Pokemon

var async = require('async');
var request = require('request');
var printf = require('printf');
var _ = require('underscore');
var client = require('redis').createClient()

var Pokemon = function() {
  this.api = 'http://pokeapi.co';
  // これは別の何処かで管理したい
  this.exp_table = {
    1: 0,
    2: 4,
    3: 13,
    4: 32,
    5: 65,
    6: 112,
    7: 178,
    8: 276,
    9: 393,
    10: 540,
    11: 745,
    12: 967,
    13: 1230,
    14: 1591,
    15: 1957,
    16: 2457,
    17: 3046,
    18: 3732,
    19: 4526,
    20: 5440,
    21: 6482,
    22: 7666,
    23: 9003,
    24: 10506,
    25: 12187,
    26: 14060,
    27: 16140,
    28: 18439,
    29: 20974,
    30: 23760,
    31: 26811,
    32: 30146,
    33: 33780,
    34: 37731,
    35: 42017,
    36: 46656,
    37: 50653,
    38: 55969,
    39: 60505,
    40: 66560,
    41: 71677,
    42: 78533,
    43: 84277,
    44: 91998,
    45: 98415,
    46: 107069,
    47: 114205,
    48: 123863,
    49: 131766,
    50: 142500,
    51: 151222,
    52: 163105,
    53: 172697,
    54: 185807,
    55: 196322,
    56: 210739,
    57: 222231,
    58: 238036,
    59: 250562,
    60: 267840,
    61: 281456,
    62: 300293,
    63: 315059,
    64: 335544,
    65: 351520,
    66: 373744,
    67: 390991,
    68: 415050,
    69: 433631,
    70: 459620,
    71: 479600,
    72: 507617,
    73: 529063,
    74: 559209,
    75: 582187,
    76: 614566,
    77: 639146,
    78: 673863,
    79: 700115,
    80: 737280,
    81: 765275,
    82: 804997,
    83: 834809,
    84: 877201,
    85: 908905,
    86: 954084,
    87: 987754,
    88: 1035837,
    89: 1071552,
    90: 1122660,
    91: 1160499,
    92: 1214753,
    93: 1254796,
    94: 1312322,
    95: 1354652,
    96: 1415577,
    97: 1460276,
    98: 1524731,
    99: 1571884,
    100: 1640000
  };
}

// でかいぷがいるか
Pokemon.prototype.appearedDekaIPU =  function(callback) {
  client.get('hubot:dekaipu:appeared', function(err, val) {
      callback(val);
  });
}

// ボーナスポイント
Pokemon.prototype.addBonusPoint = function(user_name, point) {
  damage_key = printf("hubot:dekaipu:damage:%s", user_name);
  client.get(damage_key, function(err, val2) {
    client.set(damage_key, Number(val2) + point)
  });
}

// でかいぷだす
Pokemon.prototype.buildDekaIPU = function(callback) {
  dekaipu_hp = 500;
  client.set('hubot:dekaipu:hp', dekaipu_hp);
  client.set('hubot:dekaipu:appeared', 'true');
  client.set('hubot:dekaipu:last_attacker', 'false');
  callback(dekaipu_hp);
}

// 最後の攻撃者を確認
Pokemon.prototype.checkLastAttacker = function(callback) {
  client.get('hubot:dekaipu:last_attacker', function(err, val) {
    callback(val);
  });
}

// でかいぷ消す
Pokemon.prototype.delDekaIPU = function(callback) {
  client.set('hubot:dekaipu:appeared', 'false');
}

// 攻撃する
Pokemon.prototype.doAttack = function(user_name, pokemon, callback) {
  client.get('hubot:dekaipu:hp', function(err, hp) {
    seed = Math.random();
    damage = Math.floor(0.8 * pokemon.attack + seed * 0.4 * pokemon.attack);
    crit = false;
    if (Math.random() > 0.9) {
      crit = true;
      damage = damage * 2;
    }
    dekaipu_hp = Number(hp) - damage;
    client.set('hubot:dekaipu:hp', dekaipu_hp);
    client.set('hubot:dekaipu:last_attacker', user_name);
    damage_key = printf("hubot:dekaipu:damage:%s", user_name);
    client.get(damage_key, function(err, val2) {
      client.set(damage_key, Number(val2) + damage);
    });
    callback(err, damage, crit, dekaipu_hp);
  });
}

// ダメージランキング表示
Pokemon.prototype.getDamageRank = function(callback) {
  client.keys("hubot:dekaipu:damage:*", function(err, keys) {
    _.each(keys, function(key) {
      client.get(key, function(err2, damage) {
        var obj = {key: key, damage:damage};
        callback(null, obj);
      });
    });
  });
}

// ポケモン情報取得
Pokemon.prototype.getPokemonInfo = function(uri, callback) {
  url = printf("http://pokeapi.co/%s", uri);
  request.get(url, function(err, res, body) {
    callback(err, JSON.parse(body));
  });
}

// ランダムにポケモンを選ぶ
Pokemon.prototype.getPokemonRandom = function(callback) {
  url = printf("%s/api/v1/pokedex/", this.api);
  request.get(url, function(err, res, body) {
    pokemon = _.sample(JSON.parse(body).objects[0].pokemon);
    callback(err, pokemon);
  });
}

// ポケモン画像
Pokemon.prototype.getPokemonImg = function(name, callback) {
  img_api = printf("http://ajax.googleapis.com/ajax/services/search/images?q=%s&v=1.0", name);
  request.get(img_api, function(err, res, body) {
    body = JSON.parse(body);
    img_url = null;
    if (body.responseStatus == 200) {
      img_url = body.responseData.results[0].unescapedUrl;
    }
    callback(err, img_url);
  });
}

// message lock
Pokemon.prototype.checkLock = function(callback) {
  client.get('hubot:pokemon:lock', function(err, lock) {
    callback(null, lock);
  });
}

Pokemon.prototype.lock = function(user_name, callback) {
  client.set('hubot:pokemon:lock', user_name);
  callback(null, true);
}

Pokemon.prototype.unlock = function(callback) {
  client.set('hubot:pokemon:lock', false);
  callback(null, true);
}

Pokemon.prototype.getUserInfo = function(user_name, callback) {
  client.get(printf('hubot:pokemon:user:%s', user_name), function(err, body) {
    user_info = JSON.parse(body);
    callback(null, user_info);
  });
}

Pokemon.prototype.calculateStatus = function(pokemon, level, callback) {
  url = printf("http://pokeapi.co/%s", pokemon.resource_uri);
  request.get(url, function(err, res, body) {
    body = JSON.parse(body);
    calculated_info = {};
    calculated_info.hp = Math.floor(body.hp * 2 * level / 100 + level + 10);
    calculated_info.attack = Math.floor((body.attack * 2) * level / 100 + 5);
    calculated_info.defense = Math.floor((body.defense * 2) * level / 100 + 5);
    calculated_info.sp_atk = Math.floor((body.sp_atk * 2) * level / 100 + 5);
    calculated_info.sp_def = Math.floor((body.sp_def * 2) * level / 100 + 5);
    calculated_info.speed = Math.floor((body.speed * 2) * level / 100 + 5);
    callback(err, calculated_info);
  });
}

Pokemon.prototype.checkEvolution = function(pokemon, callback) {
  Pokemon.prototype.getPokemonInfo(pokemon.resource_uri, function(err, info) {
    Pokemon.prototype.getPokemonInfo(info.evolutions[0].resource_uri, function(err2, info2) {
      callback(null, info.evolutions[0].level, info2);
    });
  });
}

Pokemon.prototype.setUserInfo = function(user_name, info, callback) {
  client.set(printf('hubot:pokemon:user:%s', user_name), JSON.stringify(info));
  callback(null, "success");
}

Pokemon.prototype.setTutorial = function(user_name, callback) {
  user_info = {
    'tutorial': true,
    'money': 10000
  };
  client.set(printf('hubot:pokemon:user:%s', user_name), JSON.stringify(user_info));
  callback(null, user_info);
}

Pokemon.prototype.getParty = function(user_name, callback) {
  client.get(printf('hubot:pokemon:party:%s', user_name), function(err, party) {
    callback(null, party);
  });
}

Pokemon.prototype.getMyPokemon = function(user_name, callback) {
  client.get(printf('hubot:pokemon:party:%s', user_name), function(err, party) {
    party = JSON.parse(party);
    first_mon = _.first(Object.keys(party), 1);
    callback(null, party[first_mon]);
  });
}

Pokemon.prototype.setPokemonInfo = function(user_name, pokemon, callback) {
  console.log(pokemon);
  client.get(printf('hubot:pokemon:party:%s', user_name), function(err, party) {
    party_obj = JSON.parse(party);
    party_obj[pokemon.name] = pokemon;
    client.set(printf('hubot:pokemon:party:%s', user_name), JSON.stringify(party_obj));
    callback(null, 'result');
  });
}

Pokemon.prototype.delPokemonInfo = function(user_name, name, callback) {
  client.get(printf('hubot:pokemon:party:%s', user_name), function(err, party) {
    party_obj = JSON.parse(party);
    delete party_obj[name];
    client.set(printf('hubot:pokemon:party:%s', user_name), JSON.stringify(party_obj));
    callback(null, 'result');
  });
}

Pokemon.prototype.getExpTable = function(callback) {
  callback(null, this.exp_table);
}

// get っていうのはポケモンゲットだぜ！の get です
Pokemon.prototype.getPokemon = function(user_name, num, callback) {
  url = printf("http://pokeapi.co/api/v1/pokemon/%s", num);
  request.get(url, function(err, res, mon) {
    mon = JSON.parse(mon);
    Pokemon.prototype.calculateStatus(mon, 1, function(err, calculated_info) {
      pokemon = {
        "name": mon.name,
        "resource_uri": mon.resource_uri,
        "lv": 1,
        "exp": 0,
        "hp": calculated_info.hp,
        "max_hp": calculated_info.hp,
        "attack": calculated_info.attack,
        "defense": calculated_info.defense,
        "sp_atk": calculated_info.sp_atk,
        "sp_def": calculated_info.sp_def,
        "speed": calculated_info.speed,
      }
      client.get(printf('hubot:pokemon:party:%s', user_name), function(err, party) {
        party_obj = JSON.parse(party);
        if (party_obj == null) {
          party_obj = {};
        }
        party_obj[pokemon.name] = pokemon;
        client.set(printf('hubot:pokemon:party:%s', user_name), JSON.stringify(party_obj));
        callback(null, 'success', pokemon);
      });
    });
  });
}

module.exports = new Pokemon
