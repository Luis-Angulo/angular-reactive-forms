export class Customer {

  constructor(
    public firstName = '',
    public lastName = '',
    public phone = '',
    public email = '',
    public notification = 'email',
    public sendCatalog = false,
    public addressType = 'home',
    public street1?: string,
    public street2?: string,
    public city?: string,
    public state = '',
    public zip?: string) { }
}
