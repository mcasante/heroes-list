import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { HeroService } from '../../core/services/heroes/hero.service';
import { Hero } from '../../core/models/hero';
@Component({
  selector: 'app-create-hero-form',
  templateUrl: './create-hero-form.component.html',
  styleUrls: ['./create-hero-form.component.scss'],
})
export class CreateHeroFormComponent {
  form: FormGroup;
  selectedImage: string | ArrayBuffer | null =
    (this.data?.hero?.thumbnail as string) || null;
  dataUrl: string = (this.data?.hero?.thumbnail as string) || '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { hero: Hero },
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private dialogRef: MatDialogRef<CreateHeroFormComponent>,
  ) {
    this.form = this.formBuilder.group({
      name: [this.data?.hero?.name || '', Validators.required],
      description: [this.data?.hero?.description || ''],
    });
  }

  handleDataUrl(dataUrl: string): void {
    this.dataUrl = dataUrl;
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.markAllControlsAsTouched();
      return;
    }

    const hero: Partial<Hero> = {
      ...this.data.hero,
      name: this.form.value.name,
      description: this.form.value.description,
      thumbnail: this.dataUrl as string,
    };

    this.heroService.createOrEdit(hero);
    this.clearForm();
    this.dialogRef.close(true);
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.get(controlName)?.markAsTouched();
    });
  }

  private clearForm(): void {
    this.form.reset();
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.get(controlName)?.setErrors(null);
      this.form.get(controlName)?.markAsPristine();
      this.form.get(controlName)?.markAsUntouched();
    });
  }
}
