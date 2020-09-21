import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.buildForm(new Customer());
  }

  buildForm(defaults?: Customer): FormGroup {
    const f = this.fb.group({
      firstName: [
        defaults.firstName,
        [Validators.required, Validators.minLength(3)],
      ],
      lastName: [
        defaults.lastName,
        [Validators.required, Validators.maxLength(50)],
      ],
      phone: [defaults.phone],
      email: [defaults.email, [Validators.required, Validators.email]],
      notification: [defaults.notification],
      sendCatalog: [defaults.sendCatalog],
      address: this.buildAddressGroup(),
    });
    return f;
  }

  buildAddressGroup(): FormGroup {
    const afg = this.fb.group({
      addressType: ['home', Validators.required],
      street1: ['', Validators.required],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });
    return afg;
  }

  setNotification(notificatonType: string): void {
    const control = this.form.controls.phone;
    if(notificatonType === 'phone'){
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  save(values): void {
    // form value model doesnt correspond to customer, you can map it to it manually
    // but the course changes the model later so don't bother yet
    console.log(values);
    console.log('Saved: ' + JSON.stringify(values));
  }
}
