import { useState } from 'react';
import type { Address } from '../../types/address';
import { Button } from '../ui/Button';

interface AddressForm {
  initial?: Address;
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

export function AddressForm({ initial, onSave, onCancel }: AddressForm) {
  const [label, setLabel] = useState(initial?.label ?? '');
  const [fullName, setFullName] = useState(initial?.fullName ?? '');
  const [street, setStreet] = useState(initial?.street ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [zip, setZip] = useState(initial?.zip ?? '');
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  const handleSave = () => {
    if (!label || !fullName || !street || !city || !zip) {
      alert('Please fill in all fields.');
      return;
    }
    onSave({ label, fullName, street, city, zip, isDefault });
  };

  return (
    <div className="space-y-3 border border-gray-200 rounded-xl p-4">
      <div>
        <label className="text-xs font-medium text-gray-700">Label (e.g. Home, Work)</label>
        <input
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-700">Full Name</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-700">Street Address</label>
        <input
          required
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700">City</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">ZIP Code</label>
          <input
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="accent-black"
        />
        Set as default address
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="button" onClick={handleSave} className="flex-1">Save Address</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </div>
  );
}