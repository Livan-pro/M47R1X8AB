import { Config } from "./config";

export abstract class CharacterUtils {
  public static readonly pollutionTickTime = Config.getInt("POLLUTION_TICK_TIME");
  public static readonly severeWoundDeathTime = Config.getInt("SEVERE_WOUND_DEATH_TIME");

  public static getPollutionByTime(startTime: Date, current: Date = new Date()): number {
    return Math.floor((current.getTime() - startTime.getTime()) / this.pollutionTickTime);
  }

  public static getTimeByPollution(pollution: number, current: Date = new Date()): Date {
    return new Date(current.getTime() - pollution * this.pollutionTickTime);
  }
}
