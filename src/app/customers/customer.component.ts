import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Customer } from './customer';

// pasing params to a validator fn requires wrapping the validator in a closure that sets up the validator
function ratingRange(options: any): ValidatorFn {
  // the custom rating validator
  return function (c: AbstractControl): { [key: string]: boolean } | null {
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < options.min || c.value > options.max)
    ) {
      return { range: true };
    }
    return null;
  };
}

function emailCrossValidator(
  group: AbstractControl
): { [key: string]: boolean } | null {
  const email = group.get('email');
  const confirm = group.get('emailConfirm');
  if (email.pristine || confirm.pristine) {
    return null;
  }
  const res =email.value === confirm.value ? null : { 'match': true };
  return res;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  form: FormGroup;
  emailMessage = ''; // the current validation message for the email field
  // each of the keys must match an error field key (the "kind" of error)
  // an i18ln intl object already kind of does this, so, more reason to look into implementing it
  validationMessages = {
    required: 'please enter your email address',
    email: 'please enter a valid email address'
  };

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
      emailGroup: this.fb.group(
        {
          email: [defaults.email, [Validators.required, Validators.email]],
          emailConfirm: ['', Validators.required],
        },
        { validator: emailCrossValidator }
      ),
      notification: [defaults.notification],
      rating: [defaults.rating, ratingRange({ min: 1, max: 5 })], // using the ratingRange custom validator fn
      sendCatalog: [defaults.sendCatalog],
      address: this.buildAddressGroup(),
    });
    // All abstractControl subtype objs allow subscription to changes like this, neato
    f.controls.notification.valueChanges.subscribe(notifType => this.setNotification(notifType));

    // TODO: make this code be able to set all valueChange and statusChange logic so that
    // the template does not do any of this change detection
    // problem is that focus or touch changes are NOT observable by default
    const emailControl = f.get('emailGroup.email');
    emailControl.valueChanges.subscribe(() => this.setMessage(emailControl));
    return f;
  }

  setMessage(c: AbstractControl): void {
    // assume that every change in values could lead to a valid state, so empty the
    // errors string
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(k => this.validationMessages[k]).join(' ');
    }
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
    if (notificatonType === 'phone') {
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
