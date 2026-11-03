import { Component, input, output } from '@angular/core';

export type StepperStepType = 'firstStep' | 'middleStep' | 'lastStep';

/**
 * PILAR `stepperButtonSet` — tombol navigasi form multi-step.
 * Tiga varian: firstStep (Draf/Batal/Selanjutnya), middleStep (Batal/Sebelumnya/Selanjutnya),
 * lastStep (Batal/Sebelumnya/Simpan).
 */
@Component({
  selector: 'app-stepper-button-set',
  standalone: true,
  templateUrl: './stepper-button-set.component.html',
})
export class StepperButtonSetComponent {
  readonly type = input<StepperStepType>('firstStep');
  readonly showDraftSet = input(true);

  readonly draft = output<void>();
  readonly cancel = output<void>();
  readonly previous = output<void>();
  readonly next = output<void>();
  readonly save = output<void>();

  get isFirst(): boolean {
    return this.type() === 'firstStep';
  }

  get isMiddle(): boolean {
    return this.type() === 'middleStep';
  }

  get isLast(): boolean {
    return this.type() === 'lastStep';
  }

  get isMiddleOrLast(): boolean {
    return this.isMiddle || this.isLast;
  }
}
