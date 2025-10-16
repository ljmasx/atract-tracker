import React, { useState } from 'react';
import { CAMPAIGN_STATUS, GENERATION_IDS } from '../utils/constants';

/**
 * Modal for creating new campaigns with inventory management
 */
const NewCampaignModal = ({ onClose, onCreateCampaign, generations }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    status: CAMPAIGN_STATUS.ACTIVE,
    inventory: { [GENERATION_IDS.ATRACT_C]: 0, [GENERATION_IDS.ATRACT_S]: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      window.alert('Le nom est obligatoire');
      return;
    }
    const total = Object.values(formData.inventory).reduce((a, b) => a + b, 0);
    if (total === 0) {
      window.alert('Entrez au moins 1 dispositif');
      return;
    }

    setIsLoading(true);
    await onCreateCampaign(formData);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Nouvelle campagne</h2>
          <button onClick={onClose} className="text-4xl text-gray-400 hover:text-gray-600">×</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block font-bold mb-2">Nom de la campagne *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border-2 rounded-lg px-4 py-3 text-lg"
              placeholder="Ex: ATRACT-C Oct 2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2">Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full border-2 rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 rounded-lg px-4 py-3"
              >
                <option>{CAMPAIGN_STATUS.ACTIVE}</option>
                <option>{CAMPAIGN_STATUS.CLOSED}</option>
              </select>
            </div>
          </div>

          <div className="border-4 border-blue-500 rounded-2xl p-6 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">📦</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">STOCK INITIAL *</h3>
              <p className="text-gray-700">Combien de dispositifs avez-vous reçus ?</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-xl border-4 border-green-400">
                <h4 className="text-xl font-bold mb-4 text-center">ATRACT-C</h4>
                <input
                  type="number"
                  min="0"
                  value={formData.inventory[GENERATION_IDS.ATRACT_C]}
                  onChange={(e) => setFormData({
                    ...formData,
                    inventory: {...formData.inventory, [GENERATION_IDS.ATRACT_C]: parseInt(e.target.value) || 0}
                  })}
                  className="w-full border-4 border-green-500 rounded-xl px-4 py-6 text-center text-4xl font-bold"
                  placeholder="0"
                />
              </div>

              <div className="bg-white rounded-xl p-6 shadow-xl border-4 border-purple-400">
                <h4 className="text-xl font-bold mb-4 text-center">ATRACT-S</h4>
                <input
                  type="number"
                  min="0"
                  value={formData.inventory[GENERATION_IDS.ATRACT_S]}
                  onChange={(e) => setFormData({
                    ...formData,
                    inventory: {...formData.inventory, [GENERATION_IDS.ATRACT_S]: parseInt(e.target.value) || 0}
                  })}
                  className="w-full border-4 border-purple-500 rounded-xl px-4 py-6 text-center text-4xl font-bold"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-xl">
              <p className="text-center text-3xl font-bold">
                TOTAL: {formData.inventory[GENERATION_IDS.ATRACT_C] + formData.inventory[GENERATION_IDS.ATRACT_S]} dispositifs
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 px-6 py-4 rounded-xl font-bold text-lg"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer la campagne'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCampaignModal;
