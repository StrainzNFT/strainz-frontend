import { Pipe, PipeTransform } from '@angular/core';
import { AccessoryType } from '../models/accessory.model';

@Pipe({
  name: 'accessoryType'
})
export class AccessoryTypePipe implements PipeTransform {

  transform(value: AccessoryType, ...args: unknown[]): string {
    switch (value) {
      case AccessoryType.Earring:
        return 'Earring';
      case AccessoryType.Joint:
        return 'Joint';

      case AccessoryType.Sunglasses:
        return 'Sunglasses';

    }
  }

}
