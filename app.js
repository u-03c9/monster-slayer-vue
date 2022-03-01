const // PLAYER
  PLAYER_HP = 100,
  PLAYER_MIN_AP = 5,
  PLAYER_MAX_AP = 12,
  PLAYER_MIN_SP_AP = 10,
  PLAYER_MAX_SP_AP = 25,
  // MONSTER
  MONSTER_HP = 100,
  MONSTER_MIN_AP = 8,
  MONSTER_MAX_AP = 15;

const getRandomAP = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const app = Vue.createApp({
  data() {
    return {
      playerHP: PLAYER_HP,
      monsterHP: MONSTER_HP,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHP < 0) return { width: "0%" };
      return { width: this.monsterHP + "%" };
    },
    playerBarStyles() {
      if (this.playerHP < 0) return { width: "0%" };
      return { width: this.playerHP + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHP(value) {
      if (value <= 0 && this.monsterHP <= 0) {
        // draw
        this.winner = "draw";
      } else if (value <= 0) {
        // player lost
        this.winner = "monster";
        console.log("player is dead");
      }
    },
    monsterHP(value) {
      if (value <= 0 && this.playerHP <= 0) {
        // draw
        this.winner = "draw";
      } else if (value <= 0) {
        // player won
        this.winner = "player";
        console.log("monster is dead");
      }
    },
  },
  methods: {
    startNewGame() {
      this.playerHP = PLAYER_HP;
      this.monsterHP = MONSTER_HP;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomAP(PLAYER_MIN_AP, PLAYER_MAX_AP);
      this.monsterHP -= attackValue;
      this.addLogMessage("player", "attack with", attackValue);
      this.attackPlayer();
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomAP(PLAYER_MIN_SP_AP, PLAYER_MAX_SP_AP);
      this.monsterHP -= attackValue;
      this.addLogMessage("player", "special-attack with", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomAP(MONSTER_MIN_AP, MONSTER_MAX_AP);
      this.playerHP -= attackValue;
      this.addLogMessage("monster", "attack with", attackValue);
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomAP(8, 20);
      this.playerHP =
        this.playerHP + healValue > 100
          ? (this.playerHP = 100)
          : (this.playerHP += healValue);
      this.addLogMessage("player", "heal by", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(attacker, action, value) {
      this.logMessages.unshift({
        actionBy: attacker,
        actionType: action,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
