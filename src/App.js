import React, { useState, useEffect } from 'react';
import { AlertCircle, Download, Plus, Eye, CheckCircle, XCircle, Filter, Calendar, User } from 'lucide-react';
import { supabase } from './supabaseClient';

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

// Composant Statistiques Chef
const ChefStats = ({ tests, assignments, generations }) => {
  if (tests.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">Aucun test effectué pour le moment</p>
      </div>
    );
  }

  // Calcul des statistiques
  const totalTests = tests.length;
  const avgEase = (tests.reduce((sum, t) => sum + t.ease_score, 0) / totalTests).toFixed(1);
  const avgEfficacy = (tests.reduce((sum, t) => sum + t.efficacy_score, 0) / totalTests).toFixed(1);
  const problemTests = tests.filter(t => t.problem).length;
  const problemRate = ((problemTests / totalTests) * 100).toFixed(0);

  // Répartition par contexte
  const contextStats = tests.reduce((acc, test) => {
    acc[test.context] = (acc[test.context] || 0) + 1;
    return acc;
  }, {});

  // Répartition par clip
  const clipStats = tests.reduce((acc, test) => {
    const clip = test.clip || 'N/A';
    acc[clip] = (acc[clip] || 0) + 1;
    return acc;
  }, {});

  // Répartition par génération
  const genStats = {};
  assignments.forEach(assignment => {
    const gen = generations.find(g => g.id === assignment.generation_id);
    const genTests = tests.filter(t => t.assignment_id === assignment.id);
    if (gen && genTests.length > 0) {
      if (!genStats[gen.name]) {
        genStats[gen.name] = { count: 0, avgEase: 0, avgEfficacy: 0 };
      }
      genStats[gen.name].count += genTests.length;
      genStats[gen.name].avgEase += genTests.reduce((sum, t) => sum + t.ease_score, 0);
      genStats[gen.name].avgEfficacy += genTests.reduce((sum, t) => sum + t.efficacy_score, 0);
    }
  });

  Object.keys(genStats).forEach(genName => {
    const count = genStats[genName].count;
    genStats[genName].avgEase = (genStats[genName].avgEase / count).toFixed(1);
    genStats[genName].avgEfficacy = (genStats[genName].avgEfficacy / count).toFixed(1);
  });

  // Évolution dans le temps (derniers tests)
  const recentTests = [...tests].sort((a, b) => 
    new Date(b.test_date) - new Date(a.test_date)
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-700 font-semibold mb-1">Total Tests</p>
          <p className="text-3xl font-bold text-blue-900">{totalTests}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
          <p className="text-sm text-green-700 font-semibold mb-1">Facilité Moyenne</p>
          <p className="text-3xl font-bold text-green-900">{avgEase}/5</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
          <p className="text-sm text-purple-700 font-semibold mb-1">Efficacité Moyenne</p>
          <p className="text-3xl font-bold text-purple-900">{avgEfficacy}/5</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
          <p className="text-sm text-red-700 font-semibold mb-1">Taux de Problèmes</p>
          <p className="text-3xl font-bold text-red-900">{problemRate}%</p>
          <p className="text-xs text-red-600 mt-1">{problemTests}/{totalTests} tests</p>
        </div>
      </div>

      {/* Répartition par génération */}
      {Object.keys(genStats).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📊 Performance par Génération
          </h3>
          <div className="grid gap-3">
            {Object.entries(genStats).map(([genName, stats]) => (
              <div key={genName} className="border-2 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg">{genName}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {stats.count} tests
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Facilité moyenne</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(stats.avgEase / 5) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold">{stats.avgEase}/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Efficacité moyenne</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(stats.avgEfficacy / 5) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold">{stats.avgEfficacy}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Répartition par contexte et clip */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contextes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            🎯 Répartition par Contexte
          </h3>
          <div className="space-y-2">
            {Object.entries(contextStats)
              .sort((a, b) => b[1] - a[1])
              .map(([context, count]) => {
                const percentage = ((count / totalTests) * 100).toFixed(0);
                return (
                  <div key={context} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20">{context}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full flex items-center justify-end px-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-white text-xs font-bold">{count}</span>
                        )}
                      </div>
                    </div>
                    {percentage <= 15 && (
                      <span className="text-sm font-bold text-gray-700 w-8">{count}</span>
                    )}
                    <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Clips */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📎 Répartition par Clip
          </h3>
          <div className="space-y-2">
            {Object.entries(clipStats)
              .sort((a, b) => b[1] - a[1])
              .map(([clip, count]) => {
                const percentage = ((count / totalTests) * 100).toFixed(0);
                return (
                  <div key={clip} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 truncate">{clip}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full flex items-center justify-end px-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-white text-xs font-bold">{count}</span>
                        )}
                      </div>
                    </div>
                    {percentage <= 15 && (
                      <span className="text-sm font-bold text-gray-700 w-8">{count}</span>
                    )}
                    <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Derniers tests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          🕐 Évolution Récente
        </h3>
        <div className="space-y-2">
          {recentTests.map((test, index) => (
            <div key={test.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 w-24">
                {new Date(test.test_date).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex-1 text-sm font-medium">{test.context}</span>
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                  Facilité: {test.ease_score}/5
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                  Efficacité: {test.efficacy_score}/5
                </span>
              </div>
              {test.problem && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                  ⚠️ Problème
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// Vue Chef - Dashboard complet
const ChefDashboard = ({ chef, campaigns, assignments, tests, generations, onAddTest, onConfirmReception, onRefresh }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
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
    assignments.some(a => a.campaign_id === campaign.id && a.chef_id === chef.id)
  );

  const chefAssignments = selectedCampaign
    ? assignments.filter(a => a.campaign_id === selectedCampaign.id && a.chef_id === chef.id)
    : [];

  const getAssignmentTests = (assignmentId) => {
    return tests.filter(t => t.assignment_id === assignmentId);
  };

  const handleSubmitTest = async () => {
    if (testForm.problem && !testForm.problemDesc.trim()) {
      window.alert('La description du problème est obligatoire');
      return;
    }
    
    await onAddTest({
      assignment_id: selectedAssignment.id,
      test_date: testForm.testDate,
      context: testForm.context === 'Autre' ? testForm.contextOther : testForm.context,
      clip: testForm.clip === 'Autre' ? testForm.clipOther : testForm.clip,
      ease_score: testForm.easeScore,
      efficacy_score: testForm.efficacyScore,
      problem: testForm.problem,
      problem_desc: testForm.problemDesc,
      comments: testForm.comments
    });
    
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
    
    await onRefresh();
  };

  const handleStartTest = () => {
    if (chefAssignments.length === 0) {
      window.alert('Aucune assignation disponible');
      return;
    }
    
    const availableAssignments = chefAssignments.filter(a => {
      const tested = getAssignmentTests(a.id).length;
      return tested < a.qty_assigned;
    });
    
    if (availableAssignments.length === 0) {
      window.alert('Tous les dispositifs ont été testés !');
      return;
    }
    
    if (availableAssignments.length > 1) {
      setCurrentView('deviceSelection');
    } else {
      setSelectedAssignment(availableAssignments[0]);
      setCurrentView('testForm');
    }
  };

  const handleSelectDevice = (assignment) => {
    setSelectedAssignment(assignment);
    setCurrentView('testForm');
  };

  const handleConfirmReception = async () => {
    const assignmentIds = chefAssignments.map(a => a.id);
    await onConfirmReception(assignmentIds);
    await onRefresh();
  };

  const allReceived = chefAssignments.length > 0 && chefAssignments.every(a => a.received_confirmed_at);

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
              const campaignAssignments = assignments.filter(a => a.campaign_id === campaign.id && a.chef_id === chef.id);
              const totalAssigned = campaignAssignments.reduce((sum, a) => sum + a.qty_assigned, 0);
              const totalTested = campaignAssignments.reduce((sum, a) => {
                return sum + tests.filter(t => t.assignment_id === a.id).length;
              }, 0);
              const hasReceived = campaignAssignments.some(a => a.received_confirmed_at);

              return (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">Début : {new Date(campaign.start_date).toLocaleDateString('fr-FR')}</p>
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

  if (currentView === 'deviceSelection') {
    const availableAssignments = chefAssignments.filter(a => {
      const tested = getAssignmentTests(a.id).length;
      return tested < a.qty_assigned;
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
            const gen = generations.find(g => g.id === assignment.generation_id);
            const assignmentTests = getAssignmentTests(assignment.id);
            const tested = assignmentTests.length;
            const remaining = assignment.qty_assigned - tested;

            return (
              <button
                key={assignment.id}
                onClick={() => handleSelectDevice(assignment)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:border-blue-500 border-2 border-transparent transition-all text-left"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{gen?.name}</h3>
                    <p className="text-gray-600 mt-1">Cliquez pour tester ce dispositif</p>
                  </div>
                  <div className="bg-blue-100 rounded-full px-4 py-2">
                    <span className="text-blue-800 font-bold text-lg">{remaining} restants</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Envoyés</p>
                    <p className="text-xl font-bold">{assignment.qty_assigned}</p>
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

  if (currentView === 'testForm' && selectedAssignment) {
    const assignment = selectedAssignment;
    const assignmentTests = getAssignmentTests(assignment.id);
    const remaining = assignment.qty_assigned - assignmentTests.length;
    const gen = generations.find(g => g.id === assignment.generation_id);

    const availableAssignments = chefAssignments.filter(a => {
      const tested = getAssignmentTests(a.id).length;
      return tested < a.qty_assigned;
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
            {gen?.name} - Testés {assignmentTests.length} | Restants {remaining}
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
              const gen = generations.find(g => g.id === assignment.generation_id);
              const assignmentTests = getAssignmentTests(assignment.id);
              const tested = assignmentTests.length;
              const remaining = assignment.qty_assigned - tested;

              return (
                <tr key={assignment.id}>
                  <td className="px-6 py-4">{gen?.name}</td>
                  <td className="px-6 py-4">{assignment.qty_assigned}</td>
                  <td className="px-6 py-4">
                    {assignment.received_confirmed_at ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Oui ({new Date(assignment.received_confirmed_at).toLocaleDateString('fr-FR')})
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
              Réception confirmée le {new Date(chefAssignments[0].received_confirmed_at).toLocaleDateString('fr-FR')}
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

        {/* 📹 NOUVEAU BOUTON VIDÉO */}
        <button
          onClick={() => window.open('https://drive.google.com/drive/folders/1adNAY4uZMzPY9OHMN8FsvNrgQi0PyXAk', '_blank')}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Ajouter une vidéo
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Vos tests récents</h3>
        <div className="space-y-3">
          {chefAssignments.flatMap(assignment => {
            const gen = generations.find(g => g.id === assignment.generation_id);
            return getAssignmentTests(assignment.id).map(test => (
              <div key={test.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{gen?.name}</span>
                    <span className="text-gray-500 ml-3">{new Date(test.test_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {test.problem && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Problème
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {test.context} • Clip: {test.clip || 'N/A'} • Facilité {test.ease_score}/5 • Efficacité {test.efficacy_score}/5
                </p>
                {test.problem && (
                  <div className="mt-3">
                    <RedAlert />
                    <p className="text-sm mt-2"><strong>Problème:</strong> {test.problem_desc}</p>
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
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Vos tests récents</h3>
        <div className="space-y-3">
          {chefAssignments.flatMap(assignment => {
            // ... code des tests récents
          })}
        </div>
      </div>  ← Fin de la section tests récents

      {/* 👇 INSÉREZ ICI 👇 */}
      <div className="mt-12 border-t-4 border-blue-500 pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📊 Mes Statistiques Globales
        </h2>
        <ChefStats 
          tests={chefAssignments.flatMap(assignment => getAssignmentTests(assignment.id))}
          assignments={chefAssignments}
          generations={generations}
        />
      </div>  
    </div>
  );
};

// Vue Observateur HIC
const ObserverDashboard = ({ campaigns, assignments, tests, chefs, generations }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('all'); // Changé de null à 'all'
  const [filterChef, setFilterChef] = useState('all');
  const [filterGeneration, setFilterGeneration] = useState('all');
  const [showProblemsOnly, setShowProblemsOnly] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState(null);

  // 🐛 LOGS DE DÉBOGAGE - AJOUTEZ CES LIGNES
  console.log('=== DÉBOGAGE HIC DASHBOARD ===');
  console.log('Total tests:', tests.length);
  console.log('Total assignments:', assignments.length);
  console.log('Total chefs:', chefs.length);
  console.log('Total generations:', generations.length);
  console.log('Campaign sélectionnée:', selectedCampaign?.name || campaigns[0]?.name);

  const handleExport = () => {
    const campaignsToExport = selectedCampaign === 'all' ? campaigns : [campaigns.find(c => c.id === parseInt(selectedCampaign))];
    
    if (!campaignsToExport || campaignsToExport.length === 0) {
      window.alert('No campaign available');
      return;
    }

    let csv = 'Campaign,Chef,Generation,Test Date,Context,Clip,Ease,Efficacy,Problem,Problem Description,Comments\n';
    
    campaignsToExport.forEach(campaign => {
      const campaignAssignments = assignments.filter(a => a.campaign_id === campaign.id);
      const campaignTests = tests.filter(t => 
        campaignAssignments.some(a => a.id === t.assignment_id)
      );

      campaignTests.forEach(test => {
        const assignment = campaignAssignments.find(a => a.id === test.assignment_id);
        const chef = chefs.find(c => c.id === assignment.chef_id);
        const gen = generations.find(g => g.id === assignment.generation_id);
        
        csv += `"${campaign.name}","${chef.name}","${gen.name}","${test.test_date}","${test.context}","${test.clip || 'N/A'}",${test.ease_score},${test.efficacy_score},${test.problem ? 'Yes' : 'No'},"${test.problem_desc || ''}","${test.comments || ''}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = selectedCampaign === 'all' 
      ? `export_all_campaigns_${new Date().toISOString().split('T')[0]}.csv`
      : `export_${campaigns.find(c => c.id === parseInt(selectedCampaign)).name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.download = filename;
    a.click();
  };

  const getFilteredTests = () => {
    // Si "Toutes les campagnes", on prend tous les assignments
    const relevantAssignments = selectedCampaign === 'all' 
      ? assignments 
      : assignments.filter(a => a.campaign_id === parseInt(selectedCampaign));

    let filteredTests = tests.filter(t => 
      relevantAssignments.some(a => a.id === t.assignment_id)
    );

    if (filterChef !== 'all') {
      filteredTests = filteredTests.filter(t => {
        const assignment = relevantAssignments.find(a => a.id === t.assignment_id);
        return assignment?.chef_id === parseInt(filterChef);
      });
    }

    if (filterGeneration !== 'all') {
      filteredTests = filteredTests.filter(t => {
        const assignment = relevantAssignments.find(a => a.id === t.assignment_id);
        return assignment?.generation_id === parseInt(filterGeneration);
      });
    }

    if (showProblemsOnly) {
      filteredTests = filteredTests.filter(t => t.problem);
    }

    return filteredTests;
  };

  const getStats = () => {
    // Si "Toutes les campagnes"
    const relevantAssignments = selectedCampaign === 'all'
      ? assignments
      : assignments.filter(a => a.campaign_id === parseInt(selectedCampaign));

    const relevantTests = tests.filter(t => 
      relevantAssignments.some(a => a.id === t.assignment_id)
    );

    const totalAssigned = relevantAssignments.reduce((sum, a) => sum + a.qty_assigned, 0);
    const totalTested = relevantTests.length;
    const problemTests = relevantTests.filter(t => t.problem).length;
    const avgEase = relevantTests.length > 0 
      ? (relevantTests.reduce((sum, t) => sum + t.ease_score, 0) / relevantTests.length).toFixed(1)
      : 0;
    const avgEfficacy = relevantTests.length > 0
      ? (relevantTests.reduce((sum, t) => sum + t.efficacy_score, 0) / relevantTests.length).toFixed(1)
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

  // 🐛 LOGS DE DÉBOGAGE - AJOUTEZ CES LIGNES
console.log('Filtered tests:', filteredTests.length);
console.log('Détails filtered tests:', filteredTests);

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
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
          className="border-2 rounded-lg px-4 py-2"
        >
          <option value="all">📊 Toutes les campagnes</option>
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
                   // 👇 INSÉREZ CES LIGNES ICI 👇
                  console.log('🔵 Processing test:', test.id);
                  console.log('  → Test complet:', test);
                  // 👆 FIN DE L'INSERTION 👆

                  const campaign = selectedCampaign || campaigns[0];
                  const assignment = assignments.find(a => a.id === test.assignment_id);
                  console.log('  → assignment_id du test:', test.assignment_id);
                  console.log('  → Assignment trouvée?', assignment ? 'OUI ✅' : 'NON ❌');
                  if (assignment) {
                    console.log('  → Assignment complète:', assignment);
                  };
                  
                  // 👇 INSÉREZ CES LIGNES ICI 👇
                  console.log('  → assignment_id du test:', test.assignment_id);
                  console.log('  → Assignment trouvée?', assignment ? 'OUI ✅' : 'NON ❌');
                  if (assignment) {
                    console.log('  → Assignment complète:', assignment);
                  }
                  // 👆 FIN DE L'INSERTION 👆
                  
                  // Protection : si pas d'assignment, on skip
                  if (!assignment) {
                    console.warn('Test sans assignment:', test.id);
                    return null;
                  }
                  
                  const chef = chefs.find(c => c.id === assignment?.chef_id);
                  const gen = generations.find(g => g.id === assignment?.generation_id);
                  
                  // Protection : si pas de chef ou génération, on skip
                  if (!chef || !gen) {
                    console.warn('Test sans chef ou génération:', test.id);
                    return null;
                  }
                  
                  const isExpanded = expandedTestId === test.id;

                  return (
                    <React.Fragment key={test.id}>
                      {/* Ligne principale */}
                      <tr 
                        onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">{new Date(test.test_date).toLocaleDateString('en-US')}</td>
                        <td className="px-4 py-3 font-semibold">{chef.name}</td>
                        <td className="px-4 py-3">{gen.name}</td>
                        <td className="px-4 py-3">{test.context}</td>
                        <td className="px-4 py-3 text-sm">{test.clip || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            test.ease_score >= 4 ? 'bg-green-100 text-green-800' :
                            test.ease_score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.ease_score}/5
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            test.efficacy_score >= 4 ? 'bg-green-100 text-green-800' :
                            test.efficacy_score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.efficacy_score}/5
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {test.problem ? (
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Issue
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                OK
                              </span>
                            )}
                            {(test.comments || test.problem_desc) && (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Ligne de détails expansible */}
                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan="8" className="px-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-gray-700">Date:</span>
                                  <span className="ml-2 text-gray-600">{new Date(test.test_date).toLocaleDateString('en-US')}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Chef:</span>
                                  <span className="ml-2 text-gray-600">{chef.name}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Generation:</span>
                                  <span className="ml-2 text-gray-600">{gen.name}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Context:</span>
                                  <span className="ml-2 text-gray-600">{test.context}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Clip:</span>
                                  <span className="ml-2 text-gray-600">{test.clip || 'N/A'}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-gray-700">Ease Score:</span>
                                  <span className="ml-2 text-gray-600">{test.ease_score}/5</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Efficacy Score:</span>
                                  <span className="ml-2 text-gray-600">{test.efficacy_score}/5</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Problem:</span>
                                  <span className="ml-2 text-gray-600">{test.problem ? 'Yes' : 'No'}</span>
                                </div>
                              </div>

                              {test.problem_desc && (
                                <div className="col-span-2 mt-2 p-3 bg-red-50 border border-red-200 rounded">
                                  <p className="font-semibold text-red-800 mb-1">⚠️ Problem Description:</p>
                                  <p className="text-gray-700">{test.problem_desc}</p>
                                </div>
                              )}

                              {test.comments && (
                                <div className="col-span-2 mt-2 p-3 bg-white border border-gray-200 rounded">
                                  <p className="font-semibold text-gray-800 mb-1">💬 Comments:</p>
                                  <p className="text-gray-700 italic">{test.comments}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
              const relevantAssignments = selectedCampaign === 'all'
                ? assignments
                : assignments.filter(a => a.campaign_id === parseInt(selectedCampaign));
              
              const assignment = relevantAssignments.find(a => a.id === test.assignment_id);
              const chef = chefs.find(c => c.id === assignment?.chef_id);
              const gen = generations.find(g => g.id === assignment?.generation_id);

              return (
                <div key={test.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold">{chef?.name}</span>
                      <span className="text-gray-600 mx-2">•</span>
                      <span>{gen?.name}</span>
                      <span className="text-gray-600 mx-2">•</span>
                      <span className="text-sm text-gray-600">{new Date(test.test_date).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2"><strong>Context:</strong> {test.context}</p>
                  <p className="text-sm mb-2"><strong>Clip:</strong> {test.clip || 'N/A'}</p>
                  <p className="text-sm"><strong>Issue:</strong> {test.problem_desc}</p>
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
// Gestion des chefs
const ChefsManagement = ({ chefs, onAddChef, onDeleteChef }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6">
      {showAddModal && (
        <AddChefModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (chef) => {
            await onAddChef(chef);
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
                    onClick={async () => {
                      if (window.confirm(`Supprimer ${chef.name} ?`)) {
                        await onDeleteChef(chef.id);
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

// Liste des campagnes
// Liste des campagnes
const AdminCampaignList = ({ campaigns, onSelectCampaign, onNewCampaign, onDeleteCampaign, generations }) => {
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className="p-6">
      {showNewModal && (
        <NewCampaignModal
          onClose={() => setShowNewModal(false)}
          onCreateCampaign={async (data) => {
            await onNewCampaign(data);
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
                <tr 
                  key={campaign.id} 
                  onClick={() => onSelectCampaign(campaign)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{campaign.name}</td>
                  <td className="px-6 py-4">{new Date(campaign.start_date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        C: {campaign.inventory['1'] || campaign.inventory[1]}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                        S: {campaign.inventory['2'] || campaign.inventory[2]}
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
                    <div className="flex items-center justify-between gap-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCampaign(campaign);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        Ouvrir
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCampaign(campaign.id, campaign.name);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
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
    const initial = campaign.inventory[genId] || campaign.inventory[genId.toString()] || 0;
    const assigned = assignments.filter(a => a.generation_id === genId).reduce((sum, a) => sum + a.qty_assigned, 0);
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
          onCreateAssignment={async (data) => {
            await onAddAssignment(data);
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
          const initial = campaign.inventory[gen.id] || campaign.inventory[gen.id.toString()] || 0;
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
                const chef = chefs.find(c => c.id === a.chef_id);
                const gen = generations.find(g => g.id === a.generation_id);
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold">{chef?.name}</td>
                    <td className="px-4 py-4">{gen?.name}</td>
                    <td className="px-4 py-4">{a.qty_assigned}</td>
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
      const expectedPassword = `${chef.last_name}ATRACT`;
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
                  <option key={chef.id} value={chef.id}>
                  {chef.name.split(' ')[0]}
                </option>
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
  const [data, setData] = useState({
    generations: [],
    chefs: [],
    campaigns: [],
    assignments: [],
    tests: []
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentChef, setCurrentChef] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [adminView, setAdminView] = useState('campaigns');
  const [isLoading, setIsLoading] = useState(true);

  // Charger toutes les données depuis Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [
        { data: generations },
        { data: chefs },
        { data: campaigns },
        { data: assignments },
        { data: tests }
      ] = await Promise.all([
        supabase.from('generations').select('*').order('id'),
        supabase.from('chefs').select('*').order('name'),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*'),
        supabase.from('tests').select('*').order('created_at', { ascending: false })
      ]);

      setData({
        generations: generations || [],
        chefs: chefs || [],
        campaigns: campaigns || [],
        assignments: assignments || [],
        tests: tests || []
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleCreateCampaign = async (campaignData) => {
    try {
      const { data: newCampaign, error } = await supabase
        .from('campaigns')
        .insert([{
          name: campaignData.name,
          start_date: campaignData.startDate,
          status: campaignData.status,
          inventory: campaignData.inventory
        }])
        .select()
        .single();

      if (error) throw error;

      await loadData();
      setSelectedCampaign(newCampaign);
    } catch (error) {
      console.error('Erreur création campagne:', error);
      window.alert('Erreur lors de la création de la campagne');
    }
  };
  const handleDeleteCampaign = async (campaignId, campaignName) => {
    const confirmation = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la campagne "${campaignName}" ?\n\n` +
      `⚠️ ATTENTION : Cette action est DÉFINITIVE !\n\n` +
      `Toutes les assignations et tests associés seront également supprimés.`
    );

    if (!confirmation) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      window.alert('✅ Campagne supprimée avec succès');
      await loadData();
      
      // Si la campagne supprimée était sélectionnée, on désélectionne
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
    } catch (error) {
      console.error('Erreur suppression campagne:', error);
      window.alert('❌ Erreur lors de la suppression de la campagne');
    }
  };
  const handleAddChef = async (chefData) => {
    try {
      const { error } = await supabase
        .from('chefs')
        .insert([{
          name: chefData.name,
          last_name: chefData.lastName,
          email: chefData.email
        }]);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erreur ajout chef:', error);
      window.alert('Erreur lors de l\'ajout du testeur');
    }
  };

  const handleDeleteChef = async (chefId) => {
    try {
      const { error } = await supabase
        .from('chefs')
        .delete()
        .eq('id', chefId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erreur suppression chef:', error);
      window.alert('Erreur lors de la suppression');
    }
  };

  const handleAddAssignment = async (assignmentData) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .insert([assignmentData]);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erreur ajout assignation:', error);
      window.alert('Erreur lors de l\'ajout de l\'assignation');
    }
  };

  const handleAddTest = async (testData) => {
    try {
      const { error } = await supabase
        .from('tests')
        .insert([testData]);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erreur ajout test:', error);
      window.alert('Erreur lors de l\'enregistrement du test');
    }
  };

  const handleConfirmReception = async (assignmentIds) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('assignments')
        .update({ received_confirmed_at: now })
        .in('id', assignmentIds);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erreur confirmation réception:', error);
      window.alert('Erreur lors de la confirmation');
    }
  };

  const filteredAssignments = selectedCampaign 
    ? data.assignments.filter(a => a.campaign_id === selectedCampaign.id)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

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
                onDeleteCampaign={handleDeleteCampaign}
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

                {/* Dashboard Chef */}
                <ChefDashboard
                  chef={currentChef || data.chefs[0]}
                  campaigns={data.campaigns}
                  assignments={data.assignments}
                  tests={data.tests}
                  generations={data.generations}
                  onAddTest={handleAddTest}
                  onConfirmReception={handleConfirmReception}
                  onRefresh={loadData}
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
            onRefresh={loadData}
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