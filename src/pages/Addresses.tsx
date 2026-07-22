import { useState } from 'react';
import { Pencil, Trash2, Star, Plus } from 'lucide-react';
import { useAddresses } from '../hooks/useAddresses';
import { AddressForm } from '../components/checkout/AddressForm';
import { Button } from '../components/ui/Button';
import type { Address } from '../types/address';

export function Addresses() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSave = (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, data);
    } else {
      addAddress(data);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        {!showForm && (
          <Button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Address
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <AddressForm
            initial={editingAddress ?? undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      {addresses.length === 0 && !showForm && (
        <p className="text-gray-400 text-sm">No saved addresses yet.</p>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{addr.label}</p>
                {addr.isDefault && (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Default</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{addr.fullName}</p>
              <p className="text-sm text-gray-500">{addr.street}, {addr.city} {addr.zip}</p>
            </div>

            <div className="flex items-center gap-2">
              {!addr.isDefault && (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  title="Set as default"
                  className="text-gray-300 hover:text-yellow-500"
                >
                  <Star size={18} />
                </button>
              )}
              <button
                onClick={() => {
                  setEditingAddress(addr);
                  setShowForm(true);
                }}
                title="Edit"
                className="text-gray-300 hover:text-gray-700"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this address?')) deleteAddress(addr.id);
                }}
                title="Delete"
                className="text-gray-300 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}