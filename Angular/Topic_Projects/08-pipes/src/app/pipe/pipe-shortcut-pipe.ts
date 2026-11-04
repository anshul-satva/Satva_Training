import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeShortcut',
})
export class PipeShortcut implements PipeTransform {
  transform(fullname: string): string {
    const parts = fullname.split(' ');
    if (parts.length < 2) {
      return fullname;
    }
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[1];
    return `${first}. ${last}`;
  }
}
