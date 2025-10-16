import React from 'react';

/**
 * Statistical dashboard component for chef performance tracking
 * Displays test metrics, distribution, and recent activity
 */
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

export default ChefStats;
