import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeUntil'
})
export class TimeUntilPipe implements PipeTransform {

  transform(date: Date, ...args: unknown[]): string {
    const until = this.timeUntil(date);
    return `${until.days ? `${until.days} days, ` : ''}${until.hours ? `${until.hours} hrs, ` : ''}${until.minutes ? `${until.minutes} mins` : ''}`;
  }
  timeUntil(when): any { // this ignores months
    const obj: any = {};
    obj._milliseconds = when.valueOf() - new Date().valueOf();
    obj.milliseconds = obj._milliseconds % 1000;
    obj._seconds = (obj._milliseconds - obj.milliseconds) / 1000;
    obj.seconds = obj._seconds % 60;
    obj._minutes = (obj._seconds - obj.seconds) / 60;
    obj.minutes = obj._minutes % 60;
    obj._hours = (obj._minutes - obj.minutes) / 60;
    obj.hours = obj._hours % 24;
    obj._days = (obj._hours - obj.hours) / 24;
    obj.days = obj._days % 365;
    // finally
    obj.years = (obj._days - obj.days) / 365;
    return obj;
  }

}
