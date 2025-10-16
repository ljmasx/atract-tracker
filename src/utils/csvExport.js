/**
 * Export test data to CSV file
 * @param {Array} campaignsToExport - Campaigns to include in export
 * @param {Array} assignments - All assignments
 * @param {Array} tests - All tests
 * @param {Array} chefs - All chefs
 * @param {Array} generations - All generations
 * @param {Object|string} selectedCampaign - Selected campaign or 'all'
 * @param {Array} campaigns - All campaigns
 */
export const exportTestsToCSV = (
  campaignsToExport,
  assignments,
  tests,
  chefs,
  generations,
  selectedCampaign,
  campaigns
) => {
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
