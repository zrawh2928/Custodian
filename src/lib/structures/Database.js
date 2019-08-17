const { Client } = require('pg');
const chalk = require('chalk');

const connection = new Client();

module.exports.connect = function(client) {
  client.logger.debug('Opening DB Connection!');
  connection.connect();
  this.query(
    'CREATE TABLE IF NOT EXISTS guilds (                 \
     "id" BIGSERIAL PRIMARY KEY,                         \
     "name" TEXT,                                        \
     "owner" BIGSERIAL,                                  \
     "prefix" TEXT DEFAULT \'--\'                        \
     );'
  );

  this.query(
    'CREATE TABLE IF NOT EXISTS infractions (            \
    "case" SERIAL PRIMARY KEY,                           \
    "reason" TEXT,                                       \
    "type" TEXT,                                         \
    "moderator" TEXT,                                    \
    "moderator_id" BIGSERIAL,                            \
    "user" TEXT,                                         \
    "user_id" BIGSERIAL                                  \
    );'
  );

  this.query(
    'CREATE TABLE IF NOT EXISTS settings (               \
     "id" BIGSERIAL PRIMARY KEY,                         \
     "autopunishment" BOOLEAN DEFAULT false,             \
     "maxWarns" INTEGER,                                 \
     "maxMutes" INTEGER,                                 \
     "maxKicks" INTEGER,                                 \
     "logChannel" BIGSERIAL DEFAULT null,                \
     "rich" BOOLEAN DEFAULT false                        \
     );'
  );

  client.logger.debug('Done! Starting Bot.');
};


// Server Related Queries

module.exports.addServer = function(id, name, owner) {
  const addServerQuery = {
    text: 'INSERT INTO guilds (id, name, owner) ' +
        'VALUES ($1, $2, $3)',
    values: [id, name, owner]
  };
  return connection.query(addServerQuery);
};


module.exports.removeServer = function(id) {
  const removeServerQuery = {
    text: 'DELETE FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(removeServerQuery);
};


module.exports.getServer = function(id) {
  const getServerQuery = {
    text: 'SELECT * FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(getServerQuery);
};

module.exports.isServerAdded = async function(id) {
  const isServerAddedQuery = {
    text: 'SELECT * FROM guilds WHERE id = $1',
    values: [id]
  };
  const serverQuery = await connection.query(isServerAddedQuery);
  if (serverQuery.rows.length === 0) {
    return false;
  } else {
    return true;
  }
};

module.exports.selectGuilds = function(name) {
  const selectGuildsQuery = {
    text: 'SELECT * FROM guilds ' +
    'WHERE name ILIKE $1 LIMIT 7',
    values: [`%${name}%`]
  };
  return connection.query(selectGuildsQuery);
};

module.exports.getGuildSettings = function(id, _value) {
  if (!_value) _value = '*';
  const getGuildSettingsQuery = {
    text: 'SELECT $2 FROM guilds WHERE id = $1',
    values: [id, _value]
  };
  return connection.query(getGuildSettingsQuery);
};

module.exports.getInfractionsSize = function() {
  const getInfractionsSizeQuery = {
    text: 'SELECT COUNT(*) FROM infractions;'
  };
  return connection.query(getInfractionsSizeQuery);
};

module.exports.updatePrefix = function(id, prefix) {
  const updatePrefixQuery = {
    text: 'UPDATE guilds SET prefix = $2 WHERE id = $1',
    values: [id, prefix]
  };
  return connection.query(updatePrefixQuery);
};

module.exports.selectPrefix = function(id) {
  const selectPrefixQuery = {
    text: 'SELECT prefix FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(selectPrefixQuery);
};

// Member Related Queries

module.exports.addMember = function(id, name) {
  const addMemberQuery = {
    text: 'INSERT INTO members (id, name) ' +
        'VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
    values: [id, name]
  };
  return connection.query(addMemberQuery);
};

module.exports.removeMember = function(id) {
  const removeMemberQuery = {
    text: 'DELETE FROM members WHERE id = $1',
    values: [id]
  };
  return connection.query(removeMemberQuery);
};

// Infraction Queries

module.exports.createInfraction = function(mod, mod_id, caseNum, user, user_id, type, reason) {
  const createInfractionQuery = {
    text: 'INSERT INTO infractions (case, reason, type, moderator, moderator_id, user, user_id) ' +
        'VALUES ($3, $7, $6, $1, $2, $4, $5)',
    values: [mod, mod_id, caseNum, user, user_id, type, reason]
  };
  return connection.query(createInfractionQuery);
};

// Helper Queries

module.exports.query = function(rawSQL) {
  const rawQuery = {
    text: rawSQL
  };
  return connection.query(rawQuery);
};

module.exports._query = function(rawSQL) {
  const rawQuery = {
    text: rawSQL
  };
  return connection.query(rawQuery);
};
