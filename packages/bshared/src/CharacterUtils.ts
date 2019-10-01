import { Config } from "./config";

export abstract class CharacterUtils {
  public static readonly pollutionTickTime = Config.getInt("POLLUTION_TICK_TIME");
  public static readonly severeWoundDeathTime = Config.getInt("SEVERE_WOUND_DEATH_TIME");
  public static readonly homelessTickTime = Config.getInt("HOMELESS_TICK_TIME");
  public static readonly homelessPollutionChance = Config.getFloat("HOMELESS_POLLUTION_CHANCE");
  public static readonly medicRejectTime = Config.getInt("MEDIC_REJECT_TIME");

  public static getPollutionByTime(startTime: Date, current: Date = new Date()): number {
    return Math.floor((current.getTime() - startTime.getTime()) / this.pollutionTickTime);
  }

  public static getTimeByPollution(pollution: number, current: Date = new Date()): Date {
    return new Date(current.getTime() - pollution * this.pollutionTickTime);
  }

  public static getHomelessPollutionStarted() {
    return Math.random() < this.homelessPollutionChance;
  }

  public static getNewRejectTime(rejectTime: Date, addTime: number): Date {
    return new Date((rejectTime < new Date() ? Date.now() : rejectTime.getTime()) + addTime);
  }

  public static getMedicRejectTime() {
    return this.medicRejectTime;
  }
}
