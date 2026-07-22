export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  fullName: string;
  street: string;
  city: string;
  zip: string;
  isDefault: boolean;
}