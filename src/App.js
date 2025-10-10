import React, { useState } from 'react';
import { AlertCircle, Download, Plus, Eye, CheckCircle, XCircle, Filter, Calendar, User } from 'lucide-react';

// Données initiales
const INITIAL_DATA = {
  generations: [
    { id: 1, name: 'ATRACT-C' },
    { id: 2, name: 'ATRACT-S' }
  ],
  chefs: [
    { id: 1, name: 'Mathieu PIOCHE', lastName: 'PIOCHE', email: 'mathieu.pioche@example.com' },
    { id: 2, name: 'Jérôme RIVORY', lastName: 'RIVORY', email: 'jerome.rivory@example.com' },
    { id: 3, name: 'Jérémie JACQUES', lastName: 'JACQUES', email: 'jeremie.jacques@example.com' },
    { id: 4, name: 'Fabien PINARD', lastName: 'PINARD', email: 'fabien.pinard@example.com' },
    { id: 5, name: 'Timothée WALLENHORST', lastName: 'WALLENHORST', email: 'timothee.wallenhorst@example.com' },
    { id: 6, name: 'Romain LEGROS', lastName: 'LEGROS', email: 'romain.legros@example.com' },
    { id: 7, name: 'Jean GRIMALDI', lastName: 'GRIMALDI', email: 'jean.grimaldi@example.com' }
  ],
  campaigns: [],
  assignments: [],
  tests: []
};

// Alerte rouge
const RedAlert = () => (
  <div className="bg-red-600 text-white p-4 rounded-lg border-4 border-red-700 my-4 animate-pulse">
    <div className="flex items-center gap-3">
      <AlertCircle className="w-8 h-8 flex-shrink-0" />
      <div>
        <p className="font-bold text-lg tracking-wide mb-2">
          ⚠️ DISPOSITIF DÉFECTUEUX - RETOUR OBLIGATOIRE
        </p>
        <p className="text-sm mb-2">
          À nettoyer avec détergent / formol avant envoi
        </p>
        <p className="text-sm">
          Conservez le dispositif et envoyez-le par courrier à :
        </p>
        <p className="font-semibold mt-1">
          Louis-Jean MASGNAUX<br />
          53 avenue Parmentier<br />
          75011 Paris
        </p>
      </div>
    </div>
  </div>
);

// Modal campagne
const NewCampaignModal = ({ onClose, onCreateCampaign, generations }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Actif',
    inventory: { 1: 0, 2: 0 }
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      window.alert('Le nom est obligatoire');
      return;
    }
    const total = Object.values(formData.inventory).reduce((a, b) => a + b, 0);
    if (total === 0) {
      window.alert('Entrez au moins 1 dispositif');
      return;
    }
    onCreateCampaign(formData);
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
                <option>Actif</option>
                <option>Clos</option>
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
                  value={formData.inventory[1]}
                  onChange={(e) => setFormData({
                    ...formData,
                    inventory: {...formData.inventory, 1: parseInt(e.target.value) || 0}
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
                  value={formData.inventory[2]}
                  onChange={(e) => setFormData({
                    ...formData,
                    inventory: {...formData.inventory, 2: parseInt(e.target.value) || 0}
                  })}
                  className="w-full border-4 border-purple-500 rounded-xl px-4 py-6 text-center text-4xl font-bold"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-xl">
              <p className="text-center text-3xl font-bold">
                TOTAL: {formData.inventory[1] + formData.inventory[2]} dispositifs
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 px-6 py-4 rounded-xl font-bold text-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg"
            >
              Créer la campagne
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vue Chef - Dashboard complet - VERSION SIMPLIFIÉE
const ChefDashboard = ({ chef, campaigns, assignments, tests, generations, onAddTest, onConfirmReception }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'deviceSelection', 'testForm'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [testForm, setTestForm] = useState({
    testDate: new Date().toISOString().split('T')[0],
    context: 'Côlon',
    contextOther: '',
    clip: 'Boston',
    clipOther: '',
    easeScore: 3,
    efficacyScore: 3,
    problem: false,
    problemDesc: '',
    comments: ''
  });

  const chefCampaigns = campaigns.filter(campaign => 
    assignments.some(a => a.campaignId === campaign.id && a.chefId === chef.id)
  );

  const chefAssignments = selectedCampaign
    ? assignments.filter(a => a.campaignId === selectedCampaign.id && a.chefId === chef.id)
    : [];

  const getAssignmentTests = (assignmentId) => {
    return tests.filter(t => t.assignmentId === assignmentId);
  };

  const handleSubmitTest = () => {
    if (testForm.problem && !testForm.problemDesc.trim()) {
      window.alert('La description du problème est obligatoire');
      return;
    }
    
    const newTest = {
      id: Date.now(),
      assignmentId: selectedAssignment.id,
      testDate: testForm.testDate,
      context: testForm.context === 'Autre' ? testForm.contextOther : testForm.context,
      clip: testForm.clip === 'Autre' ? testForm.clipOther : testForm.clip,
      easeScore: testForm.easeScore,
      efficacyScore: testForm.efficacyScore,
      problem: testForm.problem,
      problemDesc: testForm.problemDesc,
      comments: testForm.comments,
      mediaUrls: []
    };
    
    onAddTest(newTest);
    
    setCurrentView('dashboard');
    setSelectedAssignment(null);
    setTestForm({
      testDate: new Date().toISOString().split('T')[0],
      context: 'Côlon',
      contextOther: '',
      clip: 'Boston',
      clipOther: '',
      easeScore: 3,
      efficacyScore: 3,
      problem: false,
      problemDesc: '',
      comments: ''
    });
  };

  const handleStartTest = () => {
    console.log('🔵 handleStartTest appelé');
    
    if (chefAssignments.length === 0) {
      window.alert('Aucune assignation disponible');
      return;
    }
    
    const availableAssignments = chefAssignments.filter(a => {
      const tested = getAssignmentTests(a.id).length;
      return tested < a.qtyAssigned;
    });
    
    console.log('✅ Assignations disponibles:', availableAssignments);
    
    if (availableAssignments.length === 0) {
      window.alert('Tous les dispositifs ont été testés !');
      return;
    }
    
    if (availableAssignments.length > 1) {
      console.log('📋 Affichage sélection');
      setCurrentView('deviceSelection');
    } else {
      console.log('📝 Affichage formulaire direct');
      setSelectedAssignment(availableAssignments[0]);
      setCurrentView('testForm');
    }
  };

  const handleSelectDevice = (assignment) => {
    setSelectedAssignment(assignment);
    setCurrentView('testForm');
  };

  const handleConfirmReception = () => {
    const assignmentIds = chefAssignments.map(a => a.id);
    onConfirmReception(assignmentIds);
  };

  const allReceived = chefAssignments.length > 0 && chefAssignments.every(a => a.receivedConfirmedAt);

  // ÉTAPE 1: Sélection campagne
  if (!selectedCampaign) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bonjour {chef.name},</h1>
        <p className="text-gray-600 mb-8">Sélectionnez une campagne pour accéder à vos tests</p>

        {chefCampaigns.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-800">Aucune campagne assignée</p>
            <p className="text-gray-600 mt-2">Contactez l'administrateur.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {chefCampaigns.map(campaign => {
              const campaignAssignments = assignments.filter(a => a.campaignId === campaign.id && a.chefId === chef.id);
              const totalAssigned = campaignAssignments.reduce((sum, a) => sum + a.qtyAssigned, 0);
              const totalTested = campaignAssignments.reduce((sum, a) => {
                return sum + tests.filter(t => t.assignmentId === a.id).length;
              }, 0);
              const hasReceived = campaignAssignments.some(a => a.receivedConfirmedAt);

              return (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">Début : {new Date(campaign.startDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      campaign.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{totalAssigned}</p>
                      <p className="text-xs text-gray-600">Envoyés</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{hasReceived ? '✓' : '—'}</p>
                      <p className="text-xs text-gray-600">Réception</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{totalTested}</p>
                      <p className="text-xs text-gray-600">Testés</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{totalAssigned - totalTested}</p>
                      <p className="text-xs text-gray-600">Restants</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ÉTAPE 2: Sélection du dispositif
  if (currentView === 'deviceSelection') {
    const availableAssignments = chefAssignments.filter(a => {
      const tested = getAssignmentTests(a.id).length;
      return tested < a.qtyAssigned;
    });

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Sélectionnez le type de dispositif à tester</h2>
        <p className="text-gray-600 mb-6">Choisissez le dispositif que vous souhaitez tester</p>

        <div className="grid gap-4">
          {availableAssignments.map(assignment => {
            const gen = generations.find(g => g.id === assignment.generationId);
            const assignmentTests = getAssignmentTests(assignment.id);
            const tested = assignmentTests.length;
            const remaining = assignment.qtyAssigned - tested;

            return (
              <button
                key={assignment.id}
                onClick={() => handleSelectDevice(assignment)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:border-blue-500 border-2 border-transparent transition-all text-left"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{gen.name}</h3>
                    <p className="text-gray-600 mt-1">Cliquez pour tester ce dispositif</p>
                  </div>
                  <div className="bg-blue-100 rounded-full px-4 py-2">
                    <span className="text-blue-800 font-bold text-lg">{remaining} restants</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Envoyés</p>
                    <p className="text-xl font-bold">{assignment.qtyAssigned}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Testés</p>
                    <p className="text-xl font-bold text-green-600">{tested}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ÉTAPE 3: Formulaire de test
  if (currentView === 'testForm' && selectedAssignment) {
    const assignment = selectedAssignment;
    const assignmentTests = getAssignmentTests(assignment.id);
    const remaining = assignment.qtyAssigned - assignmentTests.length;
    const gen = generations.find(g => g.id === assignment.generationId);

    const availableAssignments = chefAssignments.filter(a => {
      const tested = getAssignmentTests(a.id).length;
      return tested < a.qtyAssigned;
    });

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button 
          onClick={() => {
            setCurrentView(availableAssignments.length > 1 ? 'deviceSelection' : 'dashboard');
            setSelectedAssignment(null);
          }}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Nouveau test</h2>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            {gen.name} - Testés {assignmentTests.length} | Restants {remaining}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Date du test</label>
            <input
              type="date"
              value={testForm.testDate}
              onChange={(e) => setTestForm({ ...testForm, testDate: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Contexte</label>
            <select
              value={testForm.context}
              onChange={(e) => setTestForm({ ...testForm, context: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option>Estomac</option>
              <option>Côlon</option>
              <option>Rectum</option>
              <option>Ex-vivo</option>
              <option>Autre</option>
            </select>
            {testForm.context === 'Autre' && (
              <input
                type="text"
                placeholder="Précisez..."
                value={testForm.contextOther}
                onChange={(e) => setTestForm({ ...testForm, contextOther: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Clip utilisé</label>
            <div className="border rounded px-3 py-3 space-y-2">
              {['Boston', 'Olympus', 'Vityl', 'Microtech', 'Autre'].map(clip => (
                <label key={clip} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="radio"
                    name="clip"
                    checked={testForm.clip === clip}
                    onChange={() => setTestForm({ ...testForm, clip: clip })}
                    className="w-4 h-4"
                  />
                  <span>{clip}</span>
                </label>
              ))}
            </div>
            {testForm.clip === 'Autre' && (
              <input
                type="text"
                placeholder="Précisez le type de clip..."
                value={testForm.clipOther}
                onChange={(e) => setTestForm({ ...testForm, clipOther: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Facilité de mise en place: {testForm.easeScore}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={testForm.easeScore}
              onChange={(e) => setTestForm({ ...testForm, easeScore: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Très difficile</span>
              <span>Très facile</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Efficacité de la traction: {testForm.efficacyScore}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={testForm.efficacyScore}
              onChange={(e) => setTestForm({ ...testForm, efficacyScore: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Inefficace</span>
              <span>Très efficace</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Problème rencontré?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!testForm.problem}
                  onChange={() => setTestForm({ ...testForm, problem: false, problemDesc: '' })}
                />
                Non
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={testForm.problem}
                  onChange={() => setTestForm({ ...testForm, problem: true })}
                />
                Oui
              </label>
            </div>
          </div>

          {testForm.problem && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2 text-red-600">
                  Description du problème *
                </label>
                <textarea
                  value={testForm.problemDesc}
                  onChange={(e) => setTestForm({ ...testForm, problemDesc: e.target.value })}
                  className="w-full border border-red-300 rounded px-3 py-2 h-24"
                  placeholder="Décrivez précisément le problème..."
                  required
                />
              </div>
              <RedAlert />
            </>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Commentaires (optionnel)</label>
            <textarea
              value={testForm.comments}
              onChange={(e) => setTestForm({ ...testForm, comments: e.target.value })}
              className="w-full border rounded px-3 py-2 h-20"
              placeholder="Remarques supplémentaires..."
            />
          </div>

          <button
            onClick={handleSubmitTest}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Enregistrer le test
          </button>
        </div>
      </div>
    );
  }

  // ÉTAPE 4: Dashboard principal
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => setSelectedCampaign(null)}
          className="text-blue-600 hover:text-blue-800 mb-2"
        >
          ← Changer de campagne
        </button>
        <h1 className="text-3xl font-bold mb-2">Bonjour {chef.name},</h1>
        <p className="text-gray-600 mb-6">Campagne: {selectedCampaign.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Génération</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Envoyés</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Réception</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Testés</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Restants</th>
            </tr>
          </thead>
          <tbody>
            {chefAssignments.map(assignment => {
              const gen = generations.find(g => g.id === assignment.generationId);
              const assignmentTests = getAssignmentTests(assignment.id);
              const tested = assignmentTests.length;
              const remaining = assignment.qtyAssigned - tested;

              return (
                <tr key={assignment.id}>
                  <td className="px-6 py-4">{gen.name}</td>
                  <td className="px-6 py-4">{assignment.qtyAssigned}</td>
                  <td className="px-6 py-4">
                    {assignment.receivedConfirmedAt ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Oui ({new Date(assignment.receivedConfirmedAt).toLocaleDateString('fr-FR')})
                      </span>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">{tested}</td>
                  <td className="px-6 py-4">{remaining}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        {allReceived ? (
          <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              Réception confirmée le {new Date(chefAssignments[0].receivedConfirmedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        ) : (
          <button 
            onClick={handleConfirmReception}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmer la réception
          </button>
        )}
        <button
          onClick={handleStartTest}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau test
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Vos tests récents</h3>
        <div className="space-y-3">
          {chefAssignments.flatMap(assignment => {
            const gen = generations.find(g => g.id === assignment.generationId);
            return getAssignmentTests(assignment.id).map(test => (
              <div key={test.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{gen.name}</span>
                    <span className="text-gray-500 ml-3">{new Date(test.testDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {test.problem && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Problème
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {test.context} • Clip: {test.clip || 'N/A'} • Facilité {test.easeScore}/5 • Efficacité {test.efficacyScore}/5
                </p>
                {test.problem && (
                  <div className="mt-3">
                    <RedAlert />
                    <p className="text-sm mt-2"><strong>Problème:</strong> {test.problemDesc}</p>
                  </div>
                )}
                {test.comments && (
                  <p className="text-sm text-gray-600 mt-2 italic">{test.comments}</p>
                )}
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
};

// Vue Observateur HIC - Vue d'ensemble (EN ANGLAIS)
const ObserverDashboard = ({ campaigns, assignments, tests, chefs, generations }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filterChef, setFilterChef] = useState('all');
  const [filterGeneration, setFilterGeneration] = useState('all');
  const [showProblemsOnly, setShowProblemsOnly] = useState(false);

  const handleExport = () => {
    const campaign = selectedCampaign || campaigns[0];
    if (!campaign) {
      window.alert('No campaign available');
      return;
    }

    const campaignAssignments = assignments.filter(a => a.campaignId === campaign.id);
    const campaignTests = tests.filter(t => 
      campaignAssignments.some(a => a.id === t.assignmentId)
    );

    let csv = 'Campaign,Chef,Generation,Test Date,Context,Clip,Ease,Efficacy,Problem,Problem Description,Comments\n';
    
    campaignTests.forEach(test => {
      const assignment = campaignAssignments.find(a => a.id === test.assignmentId);
      const chef = chefs.find(c => c.id === assignment.chefId);
      const gen = generations.find(g => g.id === assignment.generationId);
      
      csv += `"${campaign.name}","${chef.name}","${gen.name}","${test.testDate}","${test.context}","${test.clip || 'N/A'}",${test.easeScore},${test.efficacyScore},${test.problem ? 'Yes' : 'No'},"${test.problemDesc || ''}","${test.comments || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${campaign.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getFilteredTests = () => {
    const campaign = selectedCampaign || campaigns[0];
    if (!campaign) return [];

    const campaignAssignments = assignments.filter(a => a.campaignId === campaign.id);
    let filteredTests = tests.filter(t => 
      campaignAssignments.some(a => a.id === t.assignmentId)
    );

    if (filterChef !== 'all') {
      filteredTests = filteredTests.filter(t => {
        const assignment = campaignAssignments.find(a => a.id === t.assignmentId);
        return assignment.chefId === parseInt(filterChef);
      });
    }

    if (filterGeneration !== 'all') {
      filteredTests = filteredTests.filter(t => {
        const assignment = campaignAssignments.find(a => a.id === t.assignmentId);
        return assignment.generationId === parseInt(filterGeneration);
      });
    }

    if (showProblemsOnly) {
      filteredTests = filteredTests.filter(t => t.problem);
    }

    return filteredTests;
  };

  const getStats = () => {
    const campaign = selectedCampaign || campaigns[0];
    if (!campaign) return null;

    const campaignAssignments = assignments.filter(a => a.campaignId === campaign.id);
    const campaignTests = tests.filter(t => 
      campaignAssignments.some(a => a.id === t.assignmentId)
    );

    const totalAssigned = campaignAssignments.reduce((sum, a) => sum + a.qtyAssigned, 0);
    const totalTested = campaignTests.length;
    const problemTests = campaignTests.filter(t => t.problem).length;
    const avgEase = campaignTests.length > 0 
      ? (campaignTests.reduce((sum, t) => sum + t.easeScore, 0) / campaignTests.length).toFixed(1)
      : 0;
    const avgEfficacy = campaignTests.length > 0
      ? (campaignTests.reduce((sum, t) => sum + t.efficacyScore, 0) / campaignTests.length).toFixed(1)
      : 0;

    return {
      totalAssigned,
      totalTested,
      problemTests,
      avgEase,
      avgEfficacy,
      completion: totalAssigned > 0 ? Math.round((totalTested / totalAssigned) * 100) : 0
    };
  };

  const filteredTests = getFilteredTests();
  const stats = getStats();

  if (campaigns.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-800">No campaign available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">HIC Observer Dashboard</h1>
          <p className="text-gray-600">Test tracking and analysis</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Campaign</label>
        <select
          value={selectedCampaign?.id || campaigns[0]?.id}
          onChange={(e) => setSelectedCampaign(campaigns.find(c => c.id === parseInt(e.target.value)))}
          className="border-2 rounded-lg px-4 py-2"
        >
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Sent</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalAssigned}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tested</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalTested}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-3xl font-bold text-green-600">{stats.completion}%</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Issues</p>
            <p className="text-3xl font-bold text-red-600">{stats.problemTests}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Avg. Ease</p>
            <p className="text-3xl font-bold text-orange-600">{stats.avgEase}/5</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Avg. Efficacy</p>
            <p className="text-3xl font-bold text-teal-600">{stats.avgEfficacy}/5</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Chef</label>
            <select
              value={filterChef}
              onChange={(e) => setFilterChef(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All</option>
              {chefs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Generation</label>
            <select
              value={filterGeneration}
              onChange={(e) => setFilterGeneration(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All</option>
              {generations.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Display</label>
            <label className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showProblemsOnly}
                onChange={(e) => setShowProblemsOnly(e.target.checked)}
              />
              <span>Issues only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Chef</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Generation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Context</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Clip</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ease</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Efficacy</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No tests found with these filters
                  </td>
                </tr>
              ) : (
                filteredTests.map(test => {
                  const campaign = selectedCampaign || campaigns[0];
                  const campaignAssignments = assignments.filter(a => a.campaignId === campaign.id);
                  const assignment = campaignAssignments.find(a => a.id === test.assignmentId);
                  const chef = chefs.find(c => c.id === assignment.chefId);
                  const gen = generations.find(g => g.id === assignment.generationId);

                  return (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{new Date(test.testDate).toLocaleDateString('en-US')}</td>
                      <td className="px-4 py-3 font-semibold">{chef.name}</td>
                      <td className="px-4 py-3">{gen.name}</td>
                      <td className="px-4 py-3">{test.context}</td>
                      <td className="px-4 py-3 text-sm">{test.clip || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          test.easeScore >= 4 ? 'bg-green-100 text-green-800' :
                          test.easeScore >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {test.easeScore}/5
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          test.efficacyScore >= 4 ? 'bg-green-100 text-green-800' :
                          test.efficacyScore >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {test.efficacyScore}/5
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {test.problem ? (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                            <XCircle className="w-4 h-4" />
                            Issue
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                            <CheckCircle className="w-4 h-4" />
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTests.some(t => t.problem) && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            Issue Details
          </h3>
          <div className="space-y-3">
            {filteredTests.filter(t => t.problem).map(test => {
              const campaign = selectedCampaign || campaigns[0];
              const campaignAssignments = assignments.filter(a => a.campaignId === campaign.id);
              const assignment = campaignAssignments.find(a => a.id === test.assignmentId);
              const chef = chefs.find(c => c.id === assignment.chefId);
              const gen = generations.find(g => g.id === assignment.generationId);

              return (
                <div key={test.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold">{chef.name}</span>
                      <span className="text-gray-600 mx-2">•</span>
                      <span>{gen.name}</span>
                      <span className="text-gray-600 mx-2">•</span>
                      <span className="text-sm text-gray-600">{new Date(test.testDate).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2"><strong>Context:</strong> {test.context}</p>
                  <p className="text-sm mb-2"><strong>Clip:</strong> {test.clip || 'N/A'}</p>
                  <p className="text-sm"><strong>Issue:</strong> {test.problemDesc}</p>
                  {test.comments && (
                    <p className="text-sm mt-2 text-gray-600"><strong>Comment:</strong> {test.comments}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Page de gestion des chefs (Admin)
const ChefsManagement = ({ chefs, onAddChef, onDeleteChef }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6">
      {showAddModal && (
        <AddChefModal
          onClose={() => setShowAddModal(false)}
          onAdd={(chef) => {
            onAddChef(chef);
            setShowAddModal(false);
          }}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Testeurs</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter un testeur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {chefs.map(chef => (
              <tr key={chef.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{chef.name}</td>
                <td className="px-6 py-4 text-gray-600">{chef.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer ${chef.name} ?`)) {
                        onDeleteChef(chef.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Modal ajout chef
const AddChefModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = () => {
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
    onAdd({ name, lastName, email });
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
            <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
              Annuler
            </button>
            <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Liste des campagnes
const AdminCampaignList = ({ campaigns, onSelectCampaign, onNewCampaign, generations }) => {
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className="p-6">
      {showNewModal && (
        <NewCampaignModal
          onClose={() => setShowNewModal(false)}
          onCreateCampaign={(data) => {
            onNewCampaign(data);
            setShowNewModal(false);
          }}
          generations={generations}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campagnes</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nouvelle campagne
        </button>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune campagne</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre première campagne</p>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Créer une campagne
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Démarrage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{campaign.name}</td>
                  <td className="px-6 py-4">{new Date(campaign.startDate).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        C: {campaign.inventory[1]}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                        S: {campaign.inventory[2]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectCampaign(campaign)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ouvrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Détail campagne
const AdminCampaignDetail = ({ campaign, assignments, chefs, generations, onBack, onAddAssignment }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);

  const getAvailableStock = (genId) => {
    const initial = campaign.inventory[genId] || 0;
    const assigned = assignments.filter(a => a.generationId === genId).reduce((sum, a) => sum + a.qtyAssigned, 0);
    return initial - assigned;
  };

  return (
    <div className="p-6">
      {showAssignModal && (
        <NewAssignmentModal
          campaign={campaign}
          chefs={chefs}
          generations={generations}
          getAvailableStock={getAvailableStock}
          onClose={() => setShowAssignModal(false)}
          onCreateAssignment={(data) => {
            onAddAssignment(data);
            setShowAssignModal(false);
          }}
        />
      )}

      <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-4">← Retour aux campagnes</button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter assignation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {generations.map(gen => {
          const initial = campaign.inventory[gen.id] || 0;
          const available = getAvailableStock(gen.id);
          const assigned = initial - available;
          const percentage = initial > 0 ? Math.round((assigned / initial) * 100) : 0;

          return (
            <div key={gen.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{gen.name}</h3>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  available === 0 ? 'bg-red-100 text-red-800' :
                  available < 10 ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {available} disponibles
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Stock initial: {initial}</p>
                <p>Assignés: {assigned}</p>
              </div>
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Chef</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Génération</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Quantité</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  Aucune assignation. Cliquez sur "Ajouter assignation" pour commencer.
                </td>
              </tr>
            ) : (
              assignments.map(a => {
                const chef = chefs.find(c => c.id === a.chefId);
                const gen = generations.find(g => g.id === a.generationId);
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold">{chef?.name}</td>
                    <td className="px-4 py-4">{gen?.name}</td>
                    <td className="px-4 py-4">{a.qtyAssigned}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Modal assignation
const NewAssignmentModal = ({ campaign, chefs, generations, getAvailableStock, onClose, onCreateAssignment }) => {
  const [chefId, setChefId] = useState('');
  const [generationId, setGenerationId] = useState('');
  const [qty, setQty] = useState(10);

  const available = generationId ? getAvailableStock(parseInt(generationId)) : 0;

  const handleCreate = () => {
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
    onCreateAssignment({
      campaignId: campaign.id,
      chefId: parseInt(chefId),
      generationId: parseInt(generationId),
      qtyAssigned: qty
    });
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
            <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
              Annuler
            </button>
            <button onClick={handleCreate} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login
const LoginScreen = ({ onLogin, chefs }) => {
  const [loginType, setLoginType] = useState('admin');
  const [password, setPassword] = useState('');
  const [selectedChef, setSelectedChef] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (loginType === 'admin') {
      if (password === 'Latractiondufuturen2026@') {
        onLogin('admin', null);
      } else {
        setError('Mot de passe incorrect');
      }
    } else if (loginType === 'chef') {
      if (!selectedChef) {
        setError('Veuillez sélectionner un chef');
        return;
      }
      const chef = chefs.find(c => c.id === parseInt(selectedChef));
      const expectedPassword = `${chef.lastName}ATRACT`;
      if (password === expectedPassword) {
        onLogin('chef', chef);
      } else {
        setError('Mot de passe incorrect');
      }
    } else if (loginType === 'observer') {
      if (password === 'HicATRACT2026') {
        onLogin('observer', null);
      } else {
        setError('Mot de passe incorrect');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">A-TRACT Test Tracker</h1>
          <p className="text-gray-600">Connexion à la plateforme</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setLoginType('admin'); setError(''); setPassword(''); }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              loginType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => { setLoginType('chef'); setError(''); setSelectedChef(''); setPassword(''); }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              loginType === 'chef' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Chef
          </button>
          <button
            onClick={() => { setLoginType('observer'); setError(''); setPassword(''); }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              loginType === 'observer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            HIC
          </button>
        </div>

        <div className="space-y-4">
          {loginType === 'chef' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sélectionnez votre nom</label>
              <select
                value={selectedChef}
                onChange={(e) => setSelectedChef(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choisissez...</option>
                {chefs.map(chef => (
                  <option key={chef.id} value={chef.id}>{chef.name}</option>
                ))}
              </select>
            </div>
          )}

          {(loginType === 'admin' || loginType === 'observer' || (loginType === 'chef' && selectedChef)) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="Entrez votre mot de passe"
                autoFocus={loginType !== 'chef'}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

// Application principale
export default function AtractApp() {
  const [data, setData] = useState(INITIAL_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentChef, setCurrentChef] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [adminView, setAdminView] = useState('campaigns');

  const handleLogin = (role, chef) => {
    setUserRole(role);
    setCurrentChef(chef);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentChef(null);
    setSelectedCampaign(null);
  };

  const handleCreateCampaign = (campaignData) => {
    const newCampaign = {
      id: data.campaigns.length + 1,
      ...campaignData
    };
    setData({...data, campaigns: [...data.campaigns, newCampaign]});
    setSelectedCampaign(newCampaign);
  };

  const handleAddChef = (chefData) => {
    const newChef = {
      id: data.chefs.length + 1,
      lastName: chefData.lastName || chefData.name.split(' ').pop().toUpperCase(),
      ...chefData
    };
    setData({...data, chefs: [...data.chefs, newChef]});
  };

  const handleDeleteChef = (chefId) => {
    setData({
      ...data,
      chefs: data.chefs.filter(c => c.id !== chefId),
      assignments: data.assignments.filter(a => a.chefId !== chefId)
    });
  };

  const handleAddAssignment = (assignmentData) => {
    const newAssignment = {
      id: data.assignments.length + 1,
      ...assignmentData,
      receivedConfirmedAt: null
    };
    setData({...data, assignments: [...data.assignments, newAssignment]});
  };

  const handleAddTest = (test) => {
    setData({...data, tests: [...data.tests, test]});
  };

  const handleConfirmReception = (assignmentIds) => {
    const now = new Date().toISOString();
    setData({
      ...data,
      assignments: data.assignments.map(a => 
        assignmentIds.includes(a.id) ? {...a, receivedConfirmedAt: now} : a
      )
    });
  };

  const filteredAssignments = selectedCampaign 
    ? data.assignments.filter(a => a.campaignId === selectedCampaign.id)
    : [];

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} chefs={data.chefs} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">A-TRACT Test Tracker</h1>
          <div className="flex gap-3 items-center">
            <span className="font-semibold">
              {userRole === 'admin' && '👤 Admin'}
              {userRole === 'chef' && `👨‍🍳 ${currentChef.name}`}
              {userRole === 'observer' && '🔬 HIC Observer'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main>
        {userRole === 'admin' && (
          <div>
            {!selectedCampaign && (
              <div className="border-b bg-white">
                <div className="container mx-auto px-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAdminView('campaigns')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        adminView === 'campaigns'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Gestion des campagnes
                    </button>
                    <button
                      onClick={() => setAdminView('chefs')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        adminView === 'chefs'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Gestion des testeurs
                    </button>
                    <button
                      onClick={() => setAdminView('chef-view')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        adminView === 'chef-view'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Vue Chef
                    </button>
                    <button
                      onClick={() => setAdminView('hic-view')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        adminView === 'hic-view'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Supervision HIC
                    </button>
                  </div>
                </div>
              </div>
            )}

            {adminView === 'campaigns' && !selectedCampaign && (
              <AdminCampaignList
                campaigns={data.campaigns}
                onSelectCampaign={setSelectedCampaign}
                onNewCampaign={handleCreateCampaign}
                generations={data.generations}
              />
            )}

            {adminView === 'campaigns' && selectedCampaign && (
              <AdminCampaignDetail
                campaign={selectedCampaign}
                assignments={filteredAssignments}
                chefs={data.chefs}
                generations={data.generations}
                onBack={() => setSelectedCampaign(null)}
                onAddAssignment={handleAddAssignment}
              />
            )}

            {adminView === 'chefs' && (
              <ChefsManagement
                chefs={data.chefs}
                onAddChef={handleAddChef}
                onDeleteChef={handleDeleteChef}
              />
            )}

            {adminView === 'chef-view' && (
              <div>
                <div className="bg-blue-50 border-b border-blue-200 p-4">
                  <div className="container mx-auto flex items-center justify-between">
                    <p className="text-sm text-blue-800">
                      <strong>Mode Admin :</strong> Vous visualisez la vue Chef.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-blue-800">Chef :</label>
                      <select
                        value={currentChef?.id || data.chefs[0]?.id}
                        onChange={(e) => setCurrentChef(data.chefs.find(c => c.id === parseInt(e.target.value)))}
                        className="border-2 border-blue-300 rounded-lg px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {data.chefs.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <ChefDashboard
                  chef={currentChef || data.chefs[0]}
                  campaigns={data.campaigns}
                  assignments={data.assignments}
                  tests={data.tests}
                  generations={data.generations}
                  onAddTest={handleAddTest}
                  onConfirmReception={handleConfirmReception}
                />
              </div>
            )}

            {adminView === 'hic-view' && (
              <div>
                <div className="bg-blue-50 border-b border-blue-200 p-4">
                  <div className="container mx-auto">
                    <p className="text-sm text-blue-800">
                      <strong>Admin Mode:</strong> You are viewing HIC Supervision.
                    </p>
                  </div>
                </div>
                <ObserverDashboard
                  campaigns={data.campaigns}
                  assignments={data.assignments}
                  tests={data.tests}
                  chefs={data.chefs}
                  generations={data.generations}
                />
              </div>
            )}
          </div>
        )}

        {userRole === 'chef' && (
          <ChefDashboard
            chef={currentChef}
            campaigns={data.campaigns}
            assignments={data.assignments}
            tests={data.tests}
            generations={data.generations}
            onAddTest={handleAddTest}
            onConfirmReception={handleConfirmReception}
          />
        )}

        {userRole === 'observer' && (
          <ObserverDashboard
            campaigns={data.campaigns}
            assignments={data.assignments}
            tests={data.tests}
            chefs={data.chefs}
            generations={data.generations}
          />
        )}
      </main>
    </div>
  );
}