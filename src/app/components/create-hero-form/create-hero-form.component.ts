import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms';


import { HeroService } from '../../core/services/heroes/hero.service';
import { Hero } from '../../core/models/hero';
@Component({
  selector: 'app-create-hero-form',
  templateUrl: './create-hero-form.component.html',
  styleUrls: ['./create-hero-form.component.scss']
})
export class CreateHeroFormComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private dialogRef: MatDialogRef<CreateHeroFormComponent>
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  selectedImage: File | undefined;
  dataUrl: string = '';

  handleDataUrl(dataUrl: string): void {
    this.dataUrl = dataUrl;
  }

  onSubmit(): void {
    if(!this.form.valid) {
      this.markAllControlsAsTouched();
      return
    }

    const hero: Partial<Hero> = {
      name: this.form.value.name,
      description: this.form.value.description,
      thumbnail: this.dataUrl as string
    }

    this.heroService.createOrEdit(hero)
    this.clearForm()
    this.dialogRef.close();
  }

  private markAllControlsAsTouched(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName)?.markAsTouched();
    });
  }

  private clearForm(): void {
    this.form.reset();
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName)?.setErrors(null);
      this.form.get(controlName)?.markAsPristine();
      this.form.get(controlName)?.markAsUntouched();
    });
  }
}

