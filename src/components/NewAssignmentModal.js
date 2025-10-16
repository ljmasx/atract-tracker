import React, { useState } from 'react';

/**
 * Modal for creating device assignments to chefs
 */
const NewAssignmentModal = ({ campaign, chefs, generations, getAvailableStock, onClose, onCreateAssignment }) => {
  const [chefId, setChefId] = useState('');
  const [generationId, setGenerationId] = useState('');
  const [qty, setQty] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const available = generationId ? getAvailableStock(parseInt(generationId)) : 0;

  const handleCreate = async () => {
    if (!chefId || !generationId) {
      window.alert('Sélectionnez un chef et une génération');
      return;
    }
    if (qty <= 0) {
      window.alert('La quantité doit être > 0');
      return;
    }
    if (qty > available) {
      window.alert(`Stock insuffisant ! Seulement ${available} disponibles`);
      return;
    }

    setIsLoading(true);
    await onCreateAssignment({
      campaign_id: campaign.id,
      chef_id: parseInt(chefId),
      generation_id: parseInt(generationId),
      qty_assigned: qty
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Ajouter assignation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Chef *</label>
            <select
              value={chefId}
              onChange={(e) => setChefId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Sélectionnez...</option>
              {chefs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Génération *</label>
            <select
              value={generationId}
              onChange={(e) => setGenerationId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Sélectionnez...</option>
              {generations.map(g => {
                const avail = getAvailableStock(g.id);
                return (
                  <option key={g.id} value={g.id} disabled={avail === 0}>
                    {g.name} ({avail} disponibles)
                  </option>
                );
              })}
            </select>
          </div>

          {generationId && (
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-sm font-semibold text-green-800">📦 Stock: {available}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Quantité *</label>
            <input
              type="number"
              min="1"
              max={available || 999}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="w-full border rounded px-3 py-2"
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
              onClick={handleCreate}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAssignmentModal;
