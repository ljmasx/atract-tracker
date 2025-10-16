import React, { useState } from 'react';

/**
 * Modal for adding new testers/chefs
 */
const AddChefModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      window.alert('Le nom complet est obligatoire');
      return;
    }
    if (!lastName.trim()) {
      window.alert('Le nom de famille est obligatoire');
      return;
    }
    if (!email.trim()) {
      window.alert('L\'email est obligatoire');
      return;
    }

    setIsLoading(true);
    await onAdd({ name, lastName, email });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Ajouter un testeur</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nom complet *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Marie DUPONT"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nom de famille (pour mot de passe) *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.toUpperCase())}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: DUPONT"
            />
            <p className="text-xs text-gray-500 mt-1">Mot de passe sera: {lastName || 'NOM'}ATRACT</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: marie.dupont@example.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChefModal;
